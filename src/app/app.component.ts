import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap, Subject, takeUntil } from 'rxjs';
import { SharedService } from './core/services/shared/shared.service';
import { Idle } from '@ng-idle/core';
import moment from 'moment';
import { UserService } from './core/services/user/user.service';
import { scrollButtonAnimation } from './app.component.animation';

/// <reference types="@types/googlemaps" />

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [scrollButtonAnimation('scrollButtonAnimation')],
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
  mapFullScreen: boolean;

  /* Sidebar variables */
  public showSideBar = false;
  currentUser: any;

  public currentPage: string = 'login';

  constructor(
    private router: Router,
    public titleService: Title,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private idle: Idle,
    private renderer: Renderer2,
    public userService: UserService
  ) {}

  ngOnInit() {
    console.log("APPP COMPONENT");
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
        this.currentPage = event?.title?.toLowerCase();
        this.titleService.setTitle('TruckAssist' + ' | ' + event.title);
      });

    if (localStorage.getItem('userCompany') != null) {
      this.getCompanySubscription();
    }

    this.lowResMode = window.innerWidth < 1261;
    this.sharedService.emitTogglePdf.subscribe((resp: any) => {
      this.previewPdfActive = resp;
    });
    document.addEventListener('scroll', this.scroll, true);
    window.addEventListener('resize', this.resize, true);

    // this.mapModeService.currentMapMode
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((mapMode: boolean) => {
    //     this.trialVisible = !mapMode;
    //   });

    this.getUserData();
    window.onscroll = () => {
      this.showScrollButton =
        document.body.scrollTop > 20 || document.documentElement.scrollTop > 20;
    };
  }

  doSomething() {
    this.isOpen = false;
    this.showSideBar = false;
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
  };

  /**
   * Top function
   */
  public top() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  ngAfterViewInit() {
    setTimeout(() => {
      const element = document.getElementById('trial-wrapper');
      if (typeof element != 'undefined' && element != null) {
        this.trialVisible = true;
      }
    }, 1000);
  }

  resize = (): void => {
    window.scrollTo(window.pageXOffset, window.pageYOffset - 1);
    window.scrollTo(window.pageXOffset, window.pageYOffset + 1);
  };

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
    this.lowResMode = res < 1260;
    const dropdownPanel = Array.from(
      document.getElementsByClassName(
        'ng-dropdown-panel'
      ) as HTMLCollectionOf<HTMLElement>
    );
    const ngSelectF = document.getElementsByClassName('ng-select-opened')[0];
    let leftOffset;
    let topOffset;
    if (ngSelectF !== null && ngSelectF !== undefined) {
      leftOffset = ngSelectF.getBoundingClientRect().left;
      topOffset = ngSelectF.getBoundingClientRect().top + 26;
    }
    if (
      dropdownPanel !== null &&
      dropdownPanel !== undefined &&
      dropdownPanel.length > 0
    ) {
      // @ts-ignore
      dropdownPanel[0].style.left = leftOffset.toString() + 'px';
      // @ts-ignore
      dropdownPanel[0].style.top = topOffset.toString() + 'px';
    }
  }

  calculateDaysLeft() {
    // @ts-ignore
    const accountCreated = JSON.parse(
      localStorage.getItem('userCompany')
    ).createdAt;

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

  getCompanySubscription() {
    // @ts-ignore
    this.userCompany = JSON.parse(localStorage.getItem('userCompany'));
    this.companySubscribed = this.userCompany?.subscribed;
    this.companyTrialExpired = this.userCompany?.trialExpired;
    this.setProgressColor();
  }

  setProgressColor() {
    setTimeout(() => {
      const progressChange = document.getElementsByTagName(
        'body'
      ) as HTMLCollectionOf<HTMLElement>;
      if (this.companySubscribed == 0) {
        this.renderer.addClass(progressChange[0], 'expiration-banner');
      } else {
        if (progressChange[0].classList.contains('expiration-banner')) {
          this.renderer.removeClass(progressChange[0], 'expiration-banner');
        }
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.idle.stop();
  }
}
