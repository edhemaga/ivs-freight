import { ImageBase64Service } from 'src/app/shared/services/image-base64.service';
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

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// animations
import {
    dropDownAnimation,
    navigationRouteAnimation,
} from '../../animations/navigation.animation';

// models
import { NavigationUserPanel } from '../../models/navigation-user-panel.model';

// constants
import { NavigationDataConstants } from '../../utils/constants/navigation-data.constants';

// services
import { NavigationService } from '../../services/navigation.service';
import { WebsiteAuthService } from 'src/app/pages/website/services/website-auth.service';
import { ModalService } from 'src/app/shared/components/ta-modal/services/modal.service';
import { UserProfileUpdateService } from 'src/app/shared/services/user-profile-update.service';

// components
import { NavigationProfileUpdateModalComponent } from 'src/app/core/components/navigation/components/navigation-profile-update-modal/navigation-profile-update-modal.component';

@Component({
    selector: 'app-navigation-user-profile',
    templateUrl: './navigation-user-profile.component.html',
    styleUrls: ['./navigation-user-profile.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, FormsModule, AngularSvgIconModule],
    animations: [
        navigationRouteAnimation('showHideDetails'),
        dropDownAnimation,
    ],
})
export class NavigationUserProfileComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    @Input() isNavigationHovered: boolean = false;
    @Input() isUserPanelOpen: boolean = false;
    @Input() companiesExists: boolean;
    @Input() isUserCompanyDetailsOpen: boolean;

    public userNavigationData: NavigationUserPanel[] =
        NavigationDataConstants.userNavigationData;
    public currentUserStatus: string = 'online';
    isActiveMagicLine = true;
    public loggedUser: any = null;

    constructor(
        public router: Router,
        private websiteAuthService: WebsiteAuthService,
        private navigationService: NavigationService,
        private modalService: ModalService,
        private userProfileUpdateService: UserProfileUpdateService,
        private imageBase64Service: ImageBase64Service
    ) {}

    ngOnInit() {
        this.loggedUser = JSON.parse(localStorage.getItem('user'));

        this.loggedUser = {
            ...this.loggedUser,
            avatar: this.loggedUser.avatar
                ? this.imageBase64Service.sanitizer(this.loggedUser.avatar)
                : null,
        };
        this.userProfileUpdateService.updateUserProfile$
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
                this.modalService.openModal(
                    NavigationProfileUpdateModalComponent,
                    {
                        size: 'medium',
                    }
                );
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

    public identity(_: number, item: NavigationUserPanel): number {
        return item.id;
    }

    private changeMyStatus() {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
