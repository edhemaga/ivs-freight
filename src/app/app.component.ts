import {Component, HostListener, OnInit, Renderer2} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter, map, mergeMap, Subject, takeUntil} from "rxjs";
import {SharedService} from "./core/services/shared/shared.service";
import {AuthService} from "./core/services/auth/auth.service";
import {RoutingFullScreenService} from "./core/services/routing-full-screen/routing-full-screen.service";
import {Idle} from '@ng-idle/core';
import moment from "moment";
import {CommunicatorUserService} from "./core/services/communication-user/communicator-user.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {UserService} from "./core/services/user/user.service";

/// <reference types="@types/googlemaps" />

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('scrollButtonAnimation', [
      transition(':enter', [
        style({transform: 'scale(0.6)'}),
        animate('200ms', style({transform: 'scale(0.8)'})),
      ]),
      transition(':leave', [
        style({transform: 'scale(0.8)'}),
        animate('200ms', style({transform: 'scale(0.6)'})),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  previewPdfActive = false;
  lowResMode = false;
  fileExt = '';
  daysLeft: any;
  today = new Date();
  trialVisible = false;
  fixedHeader = false;
  userCompany: any;
  companySubscribed: any;
  companyTrialExpired: any;
  private destroy$: Subject<void> = new Subject<void>();
  public expanded = false;
  public showScrollButton = false;
  public isOpen: boolean;
  public scrollConfig = {
    suppressScrollX: false,
    suppressScrollY: false,
  };
  public pathsForToolApp = [
    {path: '/tools/gpstracking'},
    {path: '/tools/contacts'},
    {path: '/tools/miles'},
    {path: '/tools/mvr'},
    {path: '/tools/reports'},
    {path: '/tools/todo'},
    {path: '/tools/calendar'},
    {path: '/tools/statistics'},
    {path: '/tools/factoring'},
    {path: '/tools/routing'},
    {path: '//tools/accounts'},
  ];
  mapFullScreen: boolean;
  toastMessages: any[] = [];
  toastTimeouts: any[] = [];
  noHoverTimeout: any;
  isGalleryVisible = false;
  /* Sidebar variables */
  public showSideBar = false;
  currentUser: any;
  showAttachments: boolean;
  private hoverId?: string = null;
  currentPage: any;

  constructor(
    private router: Router,
    public titleService: Title,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private mapModeService: RoutingFullScreenService,
    private auth: AuthService,
    private communicatorUserService: CommunicatorUserService,
    private idle: Idle,
    private renderer: Renderer2,
    public userService: UserService
  ) {
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route: any) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route: any) => route.data)
      )
      .subscribe((event: any) => {
        this.currentPage = event.title.toLowerCase();
        this.titleService.setTitle("TruckAssist" + " | " + event.title);
        //const user = JSON.parse(localStorage.getItem('currentUser'));
        // TODO check also if user is on trial from User response (future).
        //this.trialVisible = (!(this.router.url.includes('applicant') || user == undefined || false));
      });

    if (localStorage.getItem('userCompany') != null) {
      this.getCompanySubscription();
    }

    this.lowResMode = (window.innerWidth < 1261);
    this.sharedService.emitTogglePdf.subscribe((resp: any) => {
      this.previewPdfActive = resp;
    });
    document.addEventListener('scroll', this.scroll, true);
    window.addEventListener('resize', this.resize, true);

    this.mapModeService.currentMapMode
      .pipe(takeUntil(this.destroy$))
      .subscribe((mapMode: boolean) => {
        this.trialVisible = !mapMode;
      });

    /* this.auth.currentUser
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          if (res) {
            this.calculateDaysLeft();
            this.getCompanySubscription();
          }
        }
      ); */

    if (this.communicatorUserService.user?.status !== 'busy') {
      this.communicatorUserService.changeMyStatus('online');
    }

    this.getUserData();
    window.onscroll = () => {
      this.showScrollButton = document.body.scrollTop > 20 || document.documentElement.scrollTop > 20;
    };

    /* this.gridCompressionService.currentDataSource
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: GridCompression) => {
        if (data && data.checked) {
          this.expanded = data.expanded;
          this.changeRef.detectChanges();
        }
      });

    this.mapModeServise.currentMapMode
      .pipe(takeUntil(this.destroy$))
      .subscribe((mapMode: boolean) => {
        this.mapFullScreen = mapMode;
      });

    this.galleryService.galleryVisibility
      .pipe(takeUntil(this.destroy$))
      .subscribe((visibility: boolean) => (this.isGalleryVisible = visibility));

    this.attachmentsService.showAttachmentsCurrent
      .pipe(takeUntil(this.destroy$))
      .subscribe((show) => {
        this.showAttachments = show;
      }); */
  }

  onDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.idle.stop();
    this.communicatorUserService.changeMyStatus('offline');
    //this.communicatorNotificationService.disallowToastMessages();
  }

  onHideAttachments() {
    //this.attachmentsService.showAttachmentsPopUp(false);
  }

  doSomething() {
    this.isOpen = false;
    this.showSideBar = false;
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    console.log('poziva se beforeunload');
    //event ? this.communicatorNotificationService?.disallowToastMessages() : null;
  }

  closeToastMessage(id: string) {
    document.getElementById('toast').classList.add('toast-expired');
    setTimeout(() => {
      //this.removeToast(id);
      //this.removeTimeout(id);
    }, 300);
  }

  scroll = (event: any) => {
    if (event.target.nodeName == '#document') {
      if (this.trialVisible) {
        if (window.scrollY > 95) {
          this.fixedHeader = true;
        }
        if (window.scrollY <= 94.99) {
          this.fixedHeader = false;
        }
      }
    }
  }

  hoverToastMessage(id: string) {
    //this.hoverId = id;

    if (this.noHoverTimeout) {
      clearTimeout(this.noHoverTimeout);
    }

    this.createMissingTimeouts();

    const index = this.toastMessages.findIndex((item) => item.data.id === this.hoverId);

    if (index !== -1) {
      const removeTimeoutIds = this.toastMessages
        .filter((i) => i >= index)
        .map((item) => item.data.id);

      for (const removeTimeoutId of removeTimeoutIds) {
        //this.removeTimeout(removeTimeoutId);
      }
    }
  }

  noHoverToastMessage() {
    if (this.noHoverTimeout) {
      clearTimeout(this.noHoverTimeout);
    }

    this.noHoverTimeout = setTimeout(() => {
      //this.hoverId = null;
      this.createMissingTimeouts();
    }, 500);
  }

  /**
   * Top function
   */
  public top() {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  /**
   * Reset back to top function
   */
  public resetBackToTop() {
    this.showScrollButton = false;
  }

  public getUserData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.userService
      .getUserByUsername(currentUser?.username)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (user: any) => {
          this.currentUser = user;
        },
        (error: any) => {
          error ? this.sharedService.handleServerError() : null;
        }
      );
  }

  // Drag and drop zone for chat events
  @HostListener('dragover', ['$event'])
  public onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    //this.communicatorHelpersService.onDispatchChatContainerAboutAttachment(true);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    if (!evt.fromElement) {
      //this.communicatorHelpersService.onDispatchChatContainerAboutAttachment(false);
    }
  }

  private removeToast(id: string) {
    const removeIndex = this.toastMessages.findIndex((item) => item.data.id === id);
    if (removeIndex !== -1) {
      this.toastMessages.splice(removeIndex, 1);
    }
  }

  private removeTimeout(id: string) {
    const removeTimeoutIndex = this.toastTimeouts.findIndex((item) => item.id === id);
    if (removeTimeoutIndex !== -1) {
      clearTimeout(this.toastTimeouts[removeTimeoutIndex].timeout);
      this.toastTimeouts.splice(removeTimeoutIndex, 1);
    }
  }

  private createMissingTimeouts() {
    const timeoutIds = this.toastTimeouts.map((item) => item.id);

    const missingToastTimeoutIds = this.toastMessages
      .filter((item) => !timeoutIds.includes(item.data.id))
      .map((item) => item.data.id);

    for (let i = 0; i < missingToastTimeoutIds.length; i++) {
      const timeout = setTimeout(() => {
        this.closeToastMessage(missingToastTimeoutIds[i]);
      }, 3000 * (i + 1));

      this.toastTimeouts.push({
        id: missingToastTimeoutIds[i],
        timeout,
      });
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const element = document.getElementById('trial-wrapper');
      if (typeof (element) != 'undefined' && element != null) {
        this.trialVisible = true;
      }
      $('.pac-container').remove();
    }, 1000);
  }

  resize = (): void => {
    window.scrollTo(window.pageXOffset, window.pageYOffset - 1);
    window.scrollTo(window.pageXOffset, window.pageYOffset + 1);
  }

  getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  @HostListener('click', ['$event'])
  onClick(e: any) {
    const clickParrent = e.srcElement.offsetParent?.className;
    if (
      clickParrent === undefined ||
      clickParrent.includes('k-editor') ||
      clickParrent.includes('k-picker-wrap') ||
      clickParrent.includes('k-button') ||
      clickParrent.includes('note-col') ||
      clickParrent.includes('dispacher-table') ||
      e.srcElement.className.includes('note-column') ||
      clickParrent.includes('type-accordion2') ||
      e.srcElement.offsetParent?.children[0]?.className?.includes('note-col')
    ) {
    } else {
      this.sharedService.emitCloseNote.emit(true);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const res = event.currentTarget.innerWidth;
    this.lowResMode = (res < 1260);
    const dropdownPanel = Array.from(document.getElementsByClassName('ng-dropdown-panel') as HTMLCollectionOf<HTMLElement>);
    const ngSelectF = document.getElementsByClassName('ng-select-opened')[0];
    let leftOffset;
    let topOffset;
    if (ngSelectF !== null && ngSelectF !== undefined) {
      leftOffset = ngSelectF.getBoundingClientRect().left;
      topOffset = ngSelectF.getBoundingClientRect().top + 26;
    }
    if (dropdownPanel !== null && dropdownPanel !== undefined && dropdownPanel.length > 0) {
      // @ts-ignore
      dropdownPanel[0].style.left = leftOffset.toString() + 'px';
      // @ts-ignore
      dropdownPanel[0].style.top = topOffset.toString() + 'px';
    }
  }

  calculateDaysLeft() {
    // @ts-ignore
    const accountCreated = JSON.parse(localStorage.getItem('userCompany')).createdAt;

    const result = moment(this.today).diff(moment(accountCreated), 'days');
    if (result < 0) {
      this.daysLeft = Math.abs(14 - result);
    } else {
      this.daysLeft = 14 - result;
      if (this.daysLeft < 0) {
        /* setTimeout(() => {
          this.modalService.openModal(ExpiredNewModalComponent, null , null , { size: 'expired' });
        } , 3000); */
      }
    }
  }

  private isUserInChat() {
    return this.router.url.includes('communicator');
  }

  getCompanySubscription() {
    // @ts-ignore
    this.userCompany = JSON.parse(localStorage.getItem('userCompany'));
    this.companySubscribed = this.userCompany?.subscribed;
    this.companyTrialExpired = this.userCompany?.trialExpired;
    this.setProgressColor();
  }

  setProgressColor() {
    setTimeout(() => {
      const progressChange = document.getElementsByTagName('body') as HTMLCollectionOf<HTMLElement>;
      if (this.companySubscribed == 0) {
        this.renderer.addClass(progressChange[0], 'expiration-banner');
      } else {
        if (progressChange[0].classList.contains('expiration-banner')) {
          this.renderer.removeClass(progressChange[0], 'expiration-banner');
        }
      }
    });
  }

}
