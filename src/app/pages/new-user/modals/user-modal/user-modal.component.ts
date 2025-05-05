import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of } from 'rxjs';

// Form
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';

// Models
import { Tabs } from '@ca-shared/models/tabs.model';
import { CompanyUserModalResponse } from 'appcoretruckassist';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Helpers
import { UserModalHelper } from '@pages/new-user/modals/user-modal/utils/helpers';

// Components
import {
    CaCustomCardComponent,
    CaInputDropdownTestComponent,
    CaModalButtonComponent,
    CaModalComponent,
    CaTabSwitchComponent,
    eGeneralActions,
    eModalButtonClassType,
    eModalButtonSize,
    InputTestComponent,
} from 'ca-components';
import { SvgIconComponent } from 'angular-svg-icon';

// Pipes
import { UserModalInputConfigPipe } from '@pages/new-user/modals/user-modal/pipes/user-modal-input-config.pipe';

// Enums
import { eUserModalForm } from '@pages/new-user/modals/user-modal/enums';

// Services
import { UserService } from '@pages/new-user/services/user.service';

// Interfaces
import { IUserModal } from '@pages/new-user/interfaces';

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

        // Pipes
        UserModalInputConfigPipe,
    ],
})
export class UserModalComponent implements OnInit {
    // Inputs
    @Input() editData: IUserModal;

    // Enums
    public eGeneralActions = eGeneralActions;
    public eUserModalForm = eUserModalForm;
    public eModalButtonClassType = eModalButtonClassType;
    public eModalButtonSize = eModalButtonSize;

    // Icon routes
    public svgRoutes = SharedSvgRoutes;

    // Modal title
    public modalTitle: string;

    // Show modal buttons based on edit mode
    public isEditMode: boolean;

    // Show modal spinner
    public activeAction = '';

    // Tabs
    public userTabs: Tabs[] = UserModalHelper.getUserTabs();
    public departmentTabs: Tabs[];

    // Form
    public userForm: UntypedFormGroup;
    public dropdownList: CompanyUserModalResponse;

    constructor(
        private userService: UserService,
        private ngbActiveModal: NgbActiveModal
    ) {}

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

                this.modalTitle = UserModalHelper.generateModalTitle(
                    this.isEditMode
                );

                this.departmentTabs = UserModalHelper.getDepartmentTabs(
                    userData?.isAdmin
                );
            }
        );
    }

    // Leave for now, as it is not done in backend yet
    public onUserTabChange(): void {}

    public onDepartmentTabChange(tab: Tabs): void {
        const isAdmin = tab.id === 2;
        this.userForm.get(eUserModalForm.IS_ADMIN).setValue(isAdmin);
    }

    public onModalAction(action: eGeneralActions): void {
        switch (action) {
            case this.eGeneralActions.CLOSE:
                this.ngbActiveModal.close();
                break;
        }
    }
}
