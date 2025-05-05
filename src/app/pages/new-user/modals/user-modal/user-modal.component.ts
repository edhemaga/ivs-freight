import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

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
    CaModalComponent,
    CaTabSwitchComponent,
    eGeneralActions,
    InputTestComponent,
} from 'ca-components';
import { SvgIconComponent } from 'angular-svg-icon';

// Pipes
import { UserModalInputConfigPipe } from '@pages/new-user/modals/user-modal/pipes/user-modal-input-config.pipe';

// Enums
import { eUserModalForm } from '@pages/new-user/modals/user-modal/enums';

// Services
import { UserService } from '@pages/new-user/services/user.service';

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
    // Enums
    public eGeneralActions = eGeneralActions;
    public eUserModalForm = eUserModalForm;

    // Icon routes
    public svgRoutes = SharedSvgRoutes;

    // Modal title
    public modalTitle: string = 'Invite User';

    // Tabs
    public userTabs: Tabs[] = UserModalHelper.getUserTabs();
    public departmentTabs: Tabs[] = UserModalHelper.getDepartmentTabs();

    // Form
    public userForm: UntypedFormGroup;
    public dropdownList: CompanyUserModalResponse;

    constructor(private userService: UserService) {}

    ngOnInit(): void {
        this.setupModal();
    }

    private setupModal(): void {
        this.userForm = UserModalHelper.createForm();

        const staticData$ = this.userService.getModalDropdowns();

        // TODO: We will add edit later
        staticData$.subscribe((data) => {
            this.dropdownList = data;
        });
    }

    public onUserTabChange(): void {}
    public onDepartmentTabChange(): void {}
}
