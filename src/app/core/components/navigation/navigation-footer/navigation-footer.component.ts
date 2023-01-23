import {
    Component,
    Input,
    EventEmitter,
    Output,
    OnInit,
    OnDestroy,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { FooterData } from '../model/navigation.model';
import { footerData } from '../model/navigation-data';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import {
    navigation_magic_line,
    navigation_route_animation,
} from '../navigation.animation';
import { ImageBase64Service } from '../../../utils/base64.image';
import { TaUserService } from '../../../services/user/user.service';

@Component({
    selector: 'app-navigation-footer',
    templateUrl: './navigation-footer.component.html',
    styleUrls: ['./navigation-footer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        navigation_route_animation('showHideDetails'),
        navigation_magic_line('showHideDetailsMagicLine'),
    ],
})
export class NavigationFooterComponent implements OnInit, OnChanges, OnDestroy {
    private destroy$ = new Subject<void>();
    @Input() isNavigationHovered: boolean = false;
    @Input() isUserCompanyDetailsOpen: boolean = false;
    @Input() isUserPanelOpen: boolean = false;
    @Input() isSettingsPanelOpen: boolean = false;
    @Input() isModalPanelOpen: boolean = false;
    @Input() showHideLineIfSettingsActive: boolean;
    @Input() isActiveFooterRouteClick: boolean;
    @Input() isActiveSubroute: boolean;
    @Input() subrouteContainerOpened: boolean;
    @Input() selectedRoute: string;
    @Input() selectedSubRoute: string;
    @Output() onActivateFooterRoutes = new EventEmitter<boolean>();
    @Output() userActivatedSettingsRoute = new EventEmitter<boolean>();

    public currentUserStatus: string = 'online';
    public footerData: FooterData[] = footerData;
    public loggedUser: any = null;
    public mouseOverMiddleNav: boolean = false;
    public mouseOverFooter: boolean = false;
    public settingsRouteActivated: boolean = false;
    public notificationsActive: boolean = false;
    public showMagicLine: boolean;
    public midleRouteActive: boolean = false;
    public showToolTip: boolean;
    constructor(
        private router: Router,
        private navigationService: NavigationService,
        private imageBase64Service: ImageBase64Service,
        private userService: TaUserService,
        private cdRef: ChangeDetectorRef
    ) {}
    ngOnChanges(changes: SimpleChanges): void {
        // console.log(this.subrouteContainerOpened);
    }
    ngOnInit() {
        this.navigationService.getValueNavHovered().subscribe((value) => {
            this.mouseOverMiddleNav = value;
            this.cdRef.detectChanges();
        });
        this.navigationService.getValueFootHovered().subscribe((value) => {
            this.mouseOverFooter = value;
            this.cdRef.detectChanges();
        });
        this.navigationService.getValueWhichNavIsOpen().subscribe((value) => {
            this.settingsRouteActivated = !value;
            this.notificationsActive = !value;
        });

        this.isActiveFooterRouteOnReload(window.location.pathname);
        if (localStorage.getItem('footer_active') !== null) {
            if (localStorage.getItem('footer_active') === '34') {
                this.navigationService.setValueWhichNavIsOpen(false);
                this.settingsRouteActivated = true;
                this.notificationsActive = false;
            } else {
                this.navigationService.setValueWhichNavIsOpen(false);
                this.notificationsActive = true;
                this.settingsRouteActivated = false;
            }
        }
        // this.navigationService.getValue().subscribe((value) => {
        //     this.notificationsActive = value;
        //     console.log(value, 'footer');
        // });
        // ----------------------- PRODUCSTION MODE ----------------------------
        // if(this.authQuery.getEntity(1)) {
        //   const currentUser: SignInResponse = this.authQuery.getEntity(1);

        //   if (currentUser.token) {
        //     return true;
        //   }
        // }

        // ----------------------- DEVELOP MODE ----------------------------

        this.loggedUser = JSON.parse(localStorage.getItem('user'));

        this.loggedUser = {
            ...this.loggedUser,
            avatar: this.loggedUser.avatar
                ? this.imageBase64Service.sanitizer(this.loggedUser.avatar)
                : 'assets/svg/common/ic_profile.svg',
        };

        this.footerData[2] = {
            id: this.loggedUser.userId,
            image: this.loggedUser.avatar,
            text: {
                companyName: this.loggedUser.companyName,
                userName: this.loggedUser.firstName.concat(
                    ' ',
                    this.loggedUser.lastName
                ),
            },
        };

        this.userService.updateUserProfile$
            .pipe(debounceTime(1000), takeUntil(this.destroy$))
            .subscribe((val: boolean) => {
                if (val) {
                    this.loggedUser = JSON.parse(localStorage.getItem('user'));

                    this.loggedUser = {
                        ...this.loggedUser,
                        avatar: this.loggedUser.avatar
                            ? this.imageBase64Service.sanitizer(
                                  this.loggedUser.avatar
                              )
                            : 'assets/svg/common/ic_profile.svg',
                    };

                    this.footerData[2] = {
                        id: this.loggedUser.userId,
                        image: this.loggedUser.avatar,
                        text: {
                            companyName: this.loggedUser.companyName,
                            userName: this.loggedUser.firstName.concat(
                                ' ',
                                this.loggedUser.lastName
                            ),
                        },
                    };

                    this.cdRef.detectChanges();
                }
            });
    }
    //If route is clicked get true
    public settingsRouteClicked($event) {
        this.navigationService.setValueWhichNavIsOpen(false);
        if ($event.id === 32) {
            this.notificationsActive = true;
            this.showMagicLine = true;
            localStorage.setItem('footer_active', $event.id.toString());
            this.settingsRouteActivated = false;
        } else {
            this.notificationsActive = false;
            this.showMagicLine = true;
            this.settingsRouteActivated = $event.value;
            this.userActivatedSettingsRoute.emit($event);
        }
    }
    public onAction(index: number, action: string) {
        switch (action) {
            case 'Open User Panel': {
                if (index === 2) {
                    this.navigationService.onDropdownActivation({
                        name: 'User Panel',
                        type: true,
                    });
                } else {
                    this.isActiveFooterRoute(this.footerData[index]);
                    localStorage.removeItem('subroute_active');
                    this.onActivateFooterRoutes.emit(true);
                }
                break;
            }
            default: {
                return;
            }
        }
        // this.navigationService.navigationDropdownActivation$.subscribe(
        //     (res) => {
        //         console.log(res);
        //     }
        // );
    }

    public isActiveFooterRoute(item: FooterData): boolean {
        if (item.id !== 3) {
            return this.router.url.includes(item.route);
        }
    }

    private isActiveFooterRouteOnReload(pathname: string) {
        const timeout = setTimeout(() => {
            const hasSettingsInRoute = pathname.includes('settings');

            if (hasSettingsInRoute) {
                this.router.navigate([`/${pathname}`]);
                this.onActivateFooterRoutes.emit(true);
            } else {
                this.onActivateFooterRoutes.emit(false);
            }
            clearTimeout(timeout);
        }, 50);
    }

    public identity(index: number, item: FooterData): number {
        return item.id;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
