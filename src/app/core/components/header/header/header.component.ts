import {Component, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {UserProfile} from "../../../model/user-model";
import {AuthService} from "../../../services/auth/auth.service";
import {Router} from "@angular/router";
import {SharedService} from "../../../services/shared/shared.service";
import {UserService} from "../../../services/user/user.service";
import {ChangePasswordComponent} from "../../authentication/change-password/change-password.component";
import {CustomModalService} from "../../../services/modals/custom-modal.service";
import {CommunicatorNotificationService} from "../../../services/communicator/communicator-notification.service";
import {CommunicatorUserService} from "../../../services/communication-user/communicator-user.service";
import {CommunicatorUserDataService} from "../../../services/communicator/communicator-user-data.service";
import {NotificationService} from "../../../services/notification/notification.service";
import {DriverManageComponent} from "../../modals/driver-manage/driver-manage.component";

declare var magicLine;
declare var anime;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() currentUser: UserProfile;
  public isFullScreen = false;
  public expandInput = false;
  public userCompany: any;
  public company: any;
  isActiveLinkSafety = false;
  // Chat messages
  unreadMessage = false;
  public menuItems: Array<{ route: string; name: string }> = [
    {route: '/dashboard', name: 'Dashboard'},
    {route: '/dispatcher', name: 'Dispatch'},
    {route: '/loads', name: 'Load'},
    {route: '/customers', name: 'Customer'},
    {route: '/drivers', name: 'Driver'},
    {route: '/trucks', name: 'Truck'},
    {route: '/trailers', name: 'Trailer'},
    {route: '/repairs', name: 'Repair'},
    {route: '/owners', name: 'Owner'},
    /*  { route: '/accounting', name: 'Accounting' }, */
    /*  { route: '/safety', name: 'Safety' }, */
  ];
  public searchCollapsed = true;
  /* Dropdown variables */
  public showoptions = false;
  public showtooloptions = false;
  public changecolor = false;
  public options = [
    {option: 'Driver', path: 'driver'},
    {option: 'Trailer', path: 'trailer'},
    {option: 'Broker', path: 'broker'},
    {option: 'Truck', path: 'truck'},
    {option: 'Load', path: 'load'},
    {option: 'Shipper', path: 'shipper'},
  ];
  public secondOptions = [
    {option: 'Contact', path: 'contact'},
    {option: 'Event', path: ''},
    {option: 'Account', path: 'account'},
    {option: 'Task', path: 'task'},
  ];
  public thirdOptions = [
    {option: 'Owner', path: 'owner'},
    {option: 'User', path: 'user'},
  ];
  public fourthOptions = [
    {option: 'Repair', path: 'repair'},
    {option: 'Shop', path: 'shop'},
  ];
  public fiveOptions = [
    {option: 'Credit', path: ''},
    {option: 'Bonus', path: ''},
    {option: 'Deduction', path: ''},
    {option: 'Fuel', path: 'fuel'},
  ];
  trialVisible = true;
  daysLeft = 10;
  public counter = 0;
  public width = '0px';
  public isOpen: boolean;
  public paths = [
    {path: '/tools/contacts'},
    {path: '/tools/miles'},
    {path: '/tools/mvr'},
    {path: '/tools/reports'},
    {path: '/tools/todo'},
    {path: '/tools/calendar'},
    {path: '/tools/statistics'},
    {path: '/tools/factoring'},
    {path: '/tools/routing'},
    {path: '/tools/accounts'},
  ];
  pathsSafety = [
    {path: '/safety/accident'},
    {path: '/safety/violation'},
    {path: '/safety/log'},
    {path: '/safety/scheduled-insurance'},
  ];
  pathsAccounting = [
    {path: '/accounting/payroll'},
    {path: '/accounting/fuel'},
    {path: '/accounting/ifta'},
    {path: '/accounting/ledger'},
    {path: '/accounting/tax'},
  ];
  public isBlue = false;
  public avatarError = false;
  isAccountingLinkActive = false;
  currentUserStatus?: string;
  showSafetyOptions: boolean;
  showAccountingOptions: boolean;
  public loading = false;
  isMapFullScreen: boolean;
  userInfoDropDownOpened: boolean;
  switchCompanyActive = false;
  switchCompanyDropItems = [];
  private destroy$: Subject<void> = new Subject<void>();
  private unreadInterval: any;

  constructor(
    private authService: AuthService,
    private customModalService: CustomModalService,
    public router: Router,
    private userService: UserService,
    private shared: SharedService,
    private elementRef: ElementRef,
    private communicatorNotificationService: CommunicatorNotificationService,
    // private mapModeServise: RoutingFullscreenService,
    private communicatorUserService: CommunicatorUserService,
    private communicatorUserDataService: CommunicatorUserDataService,
    private notification: NotificationService
  ) {
    this.router.events.subscribe(() => {
      for (const path of this.paths) {
        if (this.router.url === path.path) {
          this.isBlue = true;
          break;
        } else {
          this.isBlue = false;
        }
      }

      for (const path of this.pathsSafety) {
        if (this.router.url === path.path) {
          this.isActiveLinkSafety = true;
          break;
        } else {
          this.isActiveLinkSafety = false;
        }
      }

      for (const path of this.pathsAccounting) {
        if (this.router.url === path.path) {
          this.isAccountingLinkActive = true;
          break;
        } else {
          this.isAccountingLinkActive = false;
        }
      }
    });
  }

  get changeStatusOption() {
    if (['online', 'active', 'away'].includes(this.communicatorUserService.user?.status)) {
      return 'busy';
    } else {
      if (this.isUserInChat()) {
        return 'active';
      } else {
        return 'online';
      }
    }
  }

  get userStatus() {
    return this.currentUserStatus;
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    this.showtooloptions = false;
    this.showSafetyOptions = false;
    this.showAccountingOptions = false;
    if (!clickedInside) {
      this.showoptions = false;
      this.changecolor = false;
      this.counter = 0;
    } else if (clickedInside) {
      if (this.counter === 1) {
        this.showoptions = false;
        this.counter = 0;
      }
      if (this.showoptions) {
        this.counter = 1;
      }
    }
  }

  ngOnInit() {
    this.switchCompanyDropItems = JSON.parse(localStorage.getItem('multiple_companies'));
    this.userCompany = JSON.parse(localStorage.getItem('userCompany'));

    this.userService.getEditUser.pipe(takeUntil(this.destroy$)).subscribe((user: UserProfile) => {
      if (user.id === this.currentUser.id) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
      }
    });

    this.communicatorNotificationService
      .onHasUnreadSubscriptionsChanged()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasUnread: boolean) => {
        this.unreadMessage = hasUnread;
      });

    this.communicatorNotificationService.trackHasUnreadSubscriptions();

    /* this.mapModeServise.currentMapModeSpecial
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        this.isMapFullScreen = data;
      }); */

    this.userService.getNewUser.pipe(takeUntil(this.destroy$)).subscribe(() => {
      setTimeout(() => {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      }, 1000);
    });

    this.shared.updateOfficeFactoringSubject.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const currentUserJsonString = localStorage.getItem('currentUser');
      const {companyId} = JSON.parse(currentUserJsonString);
      this.shared.getCompany(companyId).subscribe((res) => {
        this.userCompany = {...res};
      });
    });

    this.shared.emitMagicLine.pipe(takeUntil(this.destroy$)).subscribe((resp: boolean) => {
      if (resp) {
        this.handleMagicLine();
      }
    });

    this.communicatorUserDataService.chatUser
      .pipe(takeUntil(this.destroy$))
      .subscribe((chatUser: any) => {
        setTimeout(() => (this.currentUserStatus = chatUser?.status));
      });
  }

  ngAfterViewInit() {
    this.handleMagicLine();
  }

  changeSelectedCompany(company) {
    this.authService
      .onCompanySelect(company.companyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.notification.success(' Changing the company. ');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
  }

  public onCloseDrop() {
    this.counter = 0;
    this.showoptions = false;
    this.shared.notifyOther({option: 'call_child', value: true});

    this.userInfoDropDownOpened = !document.getElementById('user_info_dropdown').classList.contains('show');
  }

  /* Method For Out Outside Click */
  onClickOutside() {
    if (this.userInfoDropDownOpened) {
      this.counter = 0;
      this.showoptions = false;
      this.shared.notifyOther({option: 'call_child', value: true});
      this.userInfoDropDownOpened = false;
    }
  }

  preventNavigation(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  headerLogoClick() {
    const linkWrapper = document.querySelector('.magic-line-inner');
    const links = linkWrapper.querySelectorAll('a');
    Array.prototype.forEach.call(links, (el) => {
      el.classList.remove('active');
    });
  }

  /**
   * Full screen function
   */
  public fullScreen() {
    if (document.fullscreenElement) {
      this.isFullScreen = false;
      document.exitFullscreen();
    } else {
      this.isFullScreen = true;
      document.documentElement.requestFullscreen();
    }
  }

  /* Open model in drop down */
  public openModal(index: number, options: any) {
    const path = options[index].path;
    const data = {
      type: 'new',
      vehicle: 'truck',
    };
    switch (path) {
      case 'driver':
        this.customModalService.openModal(DriverManageComponent, {data}, null, {size: 'small'});
        break;

      /* case 'truck':
        this.customModalService.openModal(TruckManageComponent, {data}, null, {size: 'small'});
        break;

      case 'fuel':
        this.customModalService.openModal(FuelManageComponent, {data}, null, {size: 'small'});
        break;

      case 'shop':
        this.customModalService.openModal(RepairShopManageComponent, {data}, null, {
          size: 'small',
        });
        break;

      case 'trailer':
        this.customModalService.openModal(TrailerManageComponent, {data}, null, {
          size: 'small',
        });
        break;

      case 'load':
        this.customModalService.openModal(ManageLoadComponent, {data}, null, {
          size: 'xxl',
        });
        break;

      case 'repair':
        this.customModalService.openModal(MaintenanceManageComponent, {data}, null, {
          size: 'large',
        });
        break;

      case 'owner':
        this.customModalService.openModal(OwnerManageComponent, {data}, null, {
          size: 'small',
        });
        break;

      case 'user':
        this.customModalService.openModal(CompanyUserManageComponent, {data}, null, {
          size: 'small',
        });
        break;

      case 'account':
        this.customModalService.openModal(AccountsManageComponent, {data}, null, {
          size: 'small',
        });
        break;

      case 'contact':
        this.customModalService.openModal(ContactManageComponent, {data}, null, {
          size: 'small',
        });
        break;

      case 'task':
        this.customModalService.openModal(TodoManageComponent, {data}, null, {
          size: 'small',
        });
        break;

      case 'broker':
        this.customModalService.openModal(CustomerManageComponent, {data}, null, {
          size: 'small',
        });
        break;

      case 'shipper':
        this.customModalService.openModal(ShipperManageComponent, {data}, null, {
          size: 'small',
        });
        break; */

      default:
        return;
    }
  }

  /**
   * Change password function
   */
  public updateProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.userService
      .getUserByUsername(currentUser.username)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (user: any) => {
          this.customModalService.openModal(ChangePasswordComponent, user, null, {size: 'small'});
        },
        (error: any) => {
          error ? this.shared.handleServerError() : null;
        }
      );
  }

  /**
   * Logout function
   */
  public logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('userCompany');
    this.communicatorNotificationService.disallowToastMessages()
    localStorage.clear();
    this.router.navigate(['/login']);
    this.authService.logout();
  }

  /* Option bar for models in nav*/
  onDropOptions() {
    this.showoptions = !this.showoptions;
    if (this.changecolor) {
      this.changecolor = false;
    }
  }

  onDropToolOptions(event: any) {
    event.stopPropagation();
    this.showtooloptions = !this.showtooloptions;
    this.showSafetyOptions = false;
    this.showAccountingOptions = false;

    if (this.showoptions) {
      this.showoptions = false;
    }
  }

  onDropSafetyOptions(event: any) {
    event.stopPropagation();
    this.showSafetyOptions = !this.showSafetyOptions;
    this.showtooloptions = false;
    this.showAccountingOptions = false;

    if (this.showoptions) {
      this.showoptions = false;
    }
  }

  onDropAccountingOptions(event: any) {
    event.stopPropagation();
    this.showAccountingOptions = !this.showAccountingOptions;
    this.showtooloptions = false;
    this.showSafetyOptions = false;

    if (this.showoptions) {
      this.showoptions = false;
    }
  }

  OnChange_color() {
    this.changecolor = !this.changecolor;
    if (this.showtooloptions) {
      this.showtooloptions = false;
    }
  }

  toggleSearch() {
    this.searchCollapsed = !this.searchCollapsed;
    if (!this.searchCollapsed) {
      document.getElementById('search-input').focus();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.communicatorNotificationService.untrackHasUnreadSubscriptions();
  }

  changeMyStatus() {
    this.communicatorUserService.changeMyStatus(this.changeStatusOption);
  }

  toggleActivity(tooltip: any): void {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open();
    }
  }

  private isUserInChat() {
    return this.router.url.includes('communicator');
  }

  public handleMagicLine() {
    const myMagicLine = new magicLine(document.querySelectorAll('.magic-line-menu'), {
      mode: 'line',
      animationCallback: (el: any, params: any) => {
        // https://animejs.com/documentation/
        anime({
          targets: el,
          left: params.left,
          top: params.top,
          width: params.width,
          height: params.height,
          easing: 'easeInOutQuad',
          duration: 250,
        });
      },
    });
    myMagicLine.init();
  }



}
