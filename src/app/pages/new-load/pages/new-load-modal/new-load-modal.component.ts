// Modules
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';

// Enums
import { eGeneralActions } from '@shared/enums';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Services
import { LoadService } from '@shared/services/load.service';
import { ModalService } from '@shared/services';

// Interface
import { ILoadModal } from '@pages/new-load/pages/new-load-modal/interfaces';

// Helpers
import { LoadModalHelper } from '@pages/new-load/pages/new-load-modal/utils/helpers';

// Models
import { LoadModalResponse, LoadResponse } from 'appcoretruckassist';

// Constants
import { LoadModalConstants } from '@pages/load/pages/load-modal/utils/constants';

// Components
import { SvgIconComponent } from 'angular-svg-icon';
import {
    CaModalButtonComponent,
    CaModalComponent,
    CaLoadStatusComponent,
    eModalButtonClassType,
    eModalButtonSize,
    CaTabSwitchComponent,
    CaInputDropdownTestComponent,
} from 'ca-components';

@Component({
    selector: 'app-new-load-modal',
    templateUrl: './new-load-modal.component.html',
    styleUrl: './new-load-modal.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,

        // Components
        CaModalComponent,
        SvgIconComponent,
        CaModalButtonComponent,
        CaLoadStatusComponent,
        CaTabSwitchComponent,
        CaInputDropdownTestComponent,
    ],
})
export class NewLoadModalComponent implements OnInit {
    @Input() editData: ILoadModal;

    public isModalValidToSubmit = false;

    // Show spinner when saving modal
    public activeAction = null;

    // Main modal title
    public modalTitle: string;

    // Show static data, such as status, load number
    public load: LoadResponse;
    public staticData: LoadModalResponse;
    public tabs = LoadModalConstants.LOAD_MODAL_TABS;

    // Enums
    public eModalButtonClassType = eModalButtonClassType;
    public eModalButtonSize = eModalButtonSize;
    public eGeneralActions = eGeneralActions;

    // Icon routes
    public svgRoutes = SharedSvgRoutes;

    // Form
    public loadForm: UntypedFormGroup;

    constructor(
        private ngbActiveModal: NgbActiveModal,
        private loadService: LoadService,
        private formBuilder: UntypedFormBuilder,
        private modalService: ModalService
    ) {}

    ngOnInit(): void {
        this.createForm();
        this.setupInitalData();
    }

    public onTabChange(): void {}

    public onModalAction(action: eGeneralActions): void {
        switch (action) {
            case this.eGeneralActions.CLOSE:
                this.onCloseModal();
                break;

            case this.eGeneralActions.CONVERT_TO_LOAD:
            case this.eGeneralActions.CONVERT_TO_TEMPLATE:
                const isTemplate =
                    action === this.eGeneralActions.CONVERT_TO_TEMPLATE;

                this.editData = {
                    isEdit: false,
                    id: null,
                    isTemplate,
                };

                this.modalTitle = LoadModalHelper.generateTitle(
                    this.editData,
                    {}
                );
                break;
            case this.eGeneralActions.CREATE_TEMPLATE:
            // Open projection modal
        }
    }

    private createForm() {
        this.loadForm = this.formBuilder.group({
            dispatcherId: null,
            companyId: null,
        });
    }

    private setupInitalData(): void {
        this.loadService.apiGetLoadModal().subscribe((staticData) => {
            this.staticData = {
                ...staticData,
                // dispatcher
                dispatchers: staticData?.dispatchers?.map((item) => {
                    return {
                        ...item,
                        name: item?.fullName,
                        logoName: item?.avatarFile?.url,
                    };
                }),
            };
        });
        // Before setting the title we should get modal by id to see if modal is active | pending or active
        if (this.editData.isEdit) {
            this.loadService
                .getLoadById(this.editData.id, this.editData.isTemplate)
                .subscribe((load) => {
                    // We will use this for some static data
                    this.load = load;

                    this.modalTitle = LoadModalHelper.generateTitle(
                        this.editData,
                        load.statusType
                    );
                });
        } else {
            // Creating new load
            this.modalTitle = LoadModalHelper.generateTitle(this.editData, {});
        }
    }

    private onCloseModal(): void {
        this.ngbActiveModal.close();
    }
}
