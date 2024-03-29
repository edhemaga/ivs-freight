import { ImageBase64Service } from 'src/app/core/utils/base64.image';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import {
    DropDownAnimation,
    navigation_route_animation,
} from '../navigation.animation';

//Model
import { userNavigationData } from '../../model/navigation-data';
import { NavigationUserPanel } from '../../model/navigation.model';

//Services
import { NavigationService } from '../../services/navigation.service';
import { WebsiteAuthService } from '../../../website/state/service/website-auth.service';
import { ModalService } from 'src/app/core/components/shared/ta-modal/modal.service';
import { TaUserService } from 'src/app/core/services/user/user.service';

//Components
import { ProfileUpdateModalComponent } from 'src/app/core/components/modals/profile-update-modal/profile-update-modal.component';

@Component({
    selector: 'app-navigation-user-profile',
    templateUrl: './navigation-user-profile.component.html',
    styleUrls: ['./navigation-user-profile.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, FormsModule, AngularSvgIconModule],
    animations: [
        navigation_route_animation('showHideDetails'),
        DropDownAnimation,
    ],
})
export class NavigationUserProfileComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    @Input() isNavigationHovered: boolean = false;
    @Input() isUserPanelOpen: boolean = false;
    @Input() companiesExists: boolean;
    @Input() isUserCompanyDetailsOpen: boolean;
    public userNavigationData: NavigationUserPanel[] = userNavigationData;
    public currentUserStatus: string = 'online';
    isActiveMagicLine = true;
    public loggedUser: any = null;
    constructor(
        public router: Router,
        private websiteAuthService: WebsiteAuthService,
        private navigationService: NavigationService,
        private modalService: ModalService,
        private userService: TaUserService,
        private imageBase64Service: ImageBase64Service
    ) {}

    ngOnInit() {
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
                : null,
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
                }
            });
    }
    public onUserPanelClose(event) {
        this.navigationService.onDropdownActivation({
            name: 'User Panel',
            type: event,
        });
    }

    public onAction(data: NavigationUserPanel) {
        switch (data.action) {
            case 'update': {
                this.modalService.openModal(ProfileUpdateModalComponent, {
                    size: 'medium',
                });
                break;
            }
            case 'status': {
                this.changeMyStatus();
                break;
            }
            case 'company': {
                this.navigationService.onDropdownActivation({
                    name: 'User Company Details',
                    type: true,
                });
                break;
            }
            case 'help': {
                break;
            }
            case 'logout': {
                localStorage.clear();
                this.websiteAuthService.accountLogout();
                break;
            }
            default:
                return;
        }
    }

    public identity(index: number, item: NavigationUserPanel): number {
        return item.id;
    }

    private changeMyStatus() {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
