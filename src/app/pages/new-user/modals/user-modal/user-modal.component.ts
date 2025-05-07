import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { forkJoin, of } from 'rxjs';

// Models
import { Tabs } from '@ca-shared/models/tabs.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
    CompanyUserModalResponse,
    CompanyUserResponse,
} from 'appcoretruckassist';
import { AddressEntity } from '@ca-shared/models/address-entity.model';

// Components
import { SvgIconComponent } from 'angular-svg-icon';
import {
    CaCustomCardComponent,
    CaInputDatetimePickerComponent,
    CaInputDropdownTestComponent,
    CaModalButtonComponent,
    CaModalComponent,
    CaTabSwitchComponent,
    eModalButtonClassType,
    eModalButtonSize,
    InputTestComponent,
    CaInputAddressDropdownComponent,
    CaInputNoteComponent,
} from 'ca-components';

// Pipes
import { UserModalInputConfigPipe } from '@pages/new-user/modals/user-modal/pipes/user-modal-input-config.pipe';

// Enums
import { eUserModalForm } from '@pages/new-user/modals/user-modal/enums';
import { eGeneralActions } from '@shared/enums';

// Services
import { UserService } from '@pages/new-user/services/user.service';
import { UserStoreService } from '@pages/new-user/state/services/user-store.service';
import { AddressService } from '@shared/services/address.service';

// Interfaces
import { IMappedUser, IUserModal } from '@pages/new-user/interfaces';

// Mixins
import { AddressMixin } from '@shared/mixins';

// Helpers
import { UserModalHelper } from '@pages/new-user/modals/user-modal/utils/helpers';
import { MethodsCalculationsHelper } from '@shared/utils/helpers';

// Svg Routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

@Component({
    selector: 'app-user-modal',
    templateUrl: './user-modal.component.html',
    styleUrl: './user-modal.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,

        // Components
        CaModalComponent,
        CaModalButtonComponent,
        CaTabSwitchComponent,
        SvgIconComponent,
        CaInputDropdownTestComponent,
        InputTestComponent,
        CaCustomCardComponent,
        CaInputAddressDropdownComponent,
        CaInputNoteComponent,
        CaInputDatetimePickerComponent,

        // Pipes
        UserModalInputConfigPipe,
    ],
})
export class UserModalComponent
    extends AddressMixin(
        class {
            addressService!: AddressService;
        }
    )
    implements OnInit
{
    // Inputs
    @Input() editData: IUserModal;

    // Show modal spinner
    public activeAction = null;
    public departmentTabs: Tabs[];
    public dropdownList: CompanyUserModalResponse;
    // Enums
    public eGeneralActions = eGeneralActions;
    public eModalButtonClassType = eModalButtonClassType;
    public eModalButtonSize = eModalButtonSize;
    public eUserModalForm = eUserModalForm;
    // Show modal buttons based on edit mode
    public isEditMode: boolean;
    // Modal title
    public modalTitle: string;
    // Icon routes
    public svgRoutes = SharedSvgRoutes;
    public taxFormTabs: Tabs[];
    public user: CompanyUserResponse;
    public userForm: UntypedFormGroup;
    public userTabs: Tabs[] = UserModalHelper.getUserTabs();

    // Address
    public selectedAddress: AddressEntity = null;

    constructor(
        private userService: UserService,
        public userStoreService: UserStoreService,
        public addressService: AddressService,

        private ngbActiveModal: NgbActiveModal
    ) {
        super();
    }

    ngOnInit(): void {
        this.setupModal();
    }

    private setupModal(): void {
        const staticData$ = this.userService.getModalDropdowns();
        this.isEditMode = this.editData?.isEdit;

        const userData$ = this.isEditMode
            ? this.userService.editUserModal(this.editData.id)
            : of(null);

        forkJoin([staticData$, userData$]).subscribe(
            ([dropdownData, userData]) => {
                this.dropdownList = dropdownData;

                this.userForm = UserModalHelper.createForm(userData || {});

                this.user = userData;

                this.selectedAddress = userData?.address;

                this.modalTitle = UserModalHelper.generateModalTitle(
                    this.isEditMode
                );

                this.departmentTabs = UserModalHelper.getDepartmentTabs(
                    userData?.isAdmin
                );

                this.taxFormTabs = UserModalHelper.getTaxFormTabs(
                    userData ? userData.is1099 : true
                );
            }
        );
    }

    public onDepartmentTabChange(tab: Tabs): void {
        const isAdmin = tab.id === 2;
        this.userForm.get(eUserModalForm.IS_ADMIN).setValue(isAdmin);
    }

    public onModalAction(action: eGeneralActions): void {
        const users: Partial<IMappedUser>[] = [
            {
                isSelected: true,
                fullName: `${this.user?.firstName} ${this.user?.lastName}`,
                id: this.user?.id,
            },
        ];

        this.activeAction = action;

        switch (action) {
            case this.eGeneralActions.CLOSE:
                this.ngbActiveModal.close();
                break;

            case this.eGeneralActions.DEACTIVATE:
                this.userStoreService.dispatchUserStatusChange(
                    { users },
                    this.ngbActiveModal
                );
                break;

            case this.eGeneralActions.DELETE:
                this.userStoreService.dispatchDeleteUsers(
                    { users },
                    this.ngbActiveModal
                );
                break;
            case eGeneralActions.SAVE_AND_ADD_NEW:
            case eGeneralActions.SAVE:
                // eslint-disable-next-line no-case-declarations
                const userData = {
                    ...this.userForm.value,
                    [eUserModalForm.START_DATE]:
                        MethodsCalculationsHelper.convertDateToBackend(
                            this.userForm.value[eUserModalForm.START_DATE]
                        ),
                };

                if (this.isEditMode) {
                    this.userService.editUser(userData).subscribe(() => {
                        this.userService
                            .editUserModal(this.editData.id)
                            .subscribe((user) =>
                                this.userStoreService.dispatchUpdateUser(user)
                            );
                        this.ngbActiveModal.close();
                    });
                } else {
                    this.userService.createNewUser(userData).subscribe(() => {
                        if (action === eGeneralActions.SAVE_AND_ADD_NEW) {
                            this.userForm.reset();

                            // Reset tabs
                            this.departmentTabs =
                                UserModalHelper.getDepartmentTabs(false);
                            this.taxFormTabs =
                                UserModalHelper.getTaxFormTabs(true);
                        } else {
                            this.ngbActiveModal.close();
                        }
                    });
                }

                break;
        }
    }

    public onHandleAddress(event: {
        address: AddressEntity;
        valid: boolean;
    }): void {
        if (event.valid) {
            this.selectedAddress = event.address;
        }
    }

    public onTaxFormTabChange(tab: Tabs): void {
        this.userForm.get(eUserModalForm.IS_1099).patchValue(tab.id === 1);
    }

    // Leave for now, as it is not done in backend yet
    public onUserTabChange(): void {}
}
