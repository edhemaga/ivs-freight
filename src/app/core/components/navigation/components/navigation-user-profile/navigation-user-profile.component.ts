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
} from '@core/components/navigation/animations/navigation.animation';

// models
import { NavigationUserPanel } from '@core/components/navigation/models';
// constants
import { NavigationDataConstants } from '@core/components/navigation/utils/constants/navigation-data.constants';

// services
import { NavigationService } from '@core/components/navigation/services/navigation.service';
import { WebsiteAuthService } from '@pages/website/services/website-auth.service';
import { ModalService } from '@shared/services/modal.service';
import { UserProfileUpdateService } from '@shared/services/user-profile-update.service';

// components
import { NavigationProfileUpdateModalComponent } from '@core/components/navigation/components/navigation-profile-update-modal/navigation-profile-update-modal.component';

// enums
import { EGeneralActions } from '@shared/enums';

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
        private userProfileUpdateService: UserProfileUpdateService
    ) {}

    ngOnInit() {
        this.loggedUser = JSON.parse(localStorage.getItem('user'));

        this.loggedUser = {
            ...this.loggedUser,
            avatar: this.loggedUser?.avatarFile?.url ?? null,
        };
        this.userProfileUpdateService.updateUserProfile$
            .pipe(debounceTime(1000), takeUntil(this.destroy$))
            .subscribe((val: boolean) => {
                if (val) {
                    this.loggedUser = JSON.parse(localStorage.getItem('user'));

                    this.loggedUser = {
                        ...this.loggedUser,
                        avatar:
                            this.loggedUser?.avatarFile?.url ??
                            'assets/svg/common/ic_profile.svg',
                    };
                }
            });
    }

    public onUserPanelClose(): void {
        this.navigationService.onDropdownActivation({
            name: 'User Panel',
            type: !this.isUserPanelOpen,
        });
    }

    public onAction(data: NavigationUserPanel): void {
        switch (data.action) {
            case EGeneralActions.UPDATE:
                this.modalService.openModal(
                    NavigationProfileUpdateModalComponent,
                    {
                        size: 'medium',
                    }
                );
                break;
            case 'status':
                break;
            case 'company':
                this.navigationService.onDropdownActivation({
                    name: 'User Company Details',
                    type: true,
                });
                break;
            case 'help':
                break;
            case 'logout':
                localStorage.clear();
                this.websiteAuthService.accountLogout();
                break;
            default:
                return;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
