// Modules
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';

// rxjs
import { forkJoin } from 'rxjs';

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

// Config
import { LoadModalConfig } from '@pages/load/pages/load-modal/utils/constants';

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
    InputTestComponent,
    CaCustomCardComponent,
} from 'ca-components';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';

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
        CaCustomCardComponent,
        InputTestComponent,
        TaCheckboxComponent,
        TaInputNoteComponent,
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

    // Config
    public LoadModalConfig = LoadModalConfig;

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
        this.loadForm = LoadModalHelper.generateInitalForm();
    }

    private setupInitalData(): void {
        const staticData$ = this.loadService.apiGetLoadModal();

        if (this.editData.isEdit) {
            const load$ = this.loadService.getLoadById(
                this.editData.id,
                this.editData.isTemplate
            );

            forkJoin([staticData$, load$]).subscribe(([staticData, load]) => {
                this.staticData = staticData;
                this.load = load;

                this.modalTitle = LoadModalHelper.generateTitle(
                    this.editData,
                    load.statusType
                );

                const { loadRequirements } = load || {};

                // TODO: Check this
                this.loadForm.patchValue({
                    dispatcherId: load.dispatcher?.id,
                    companyId: load.company?.id,
                    referenceNumber: load.referenceNumber,
                    brokerId: load.broker?.id,
                    weight: load.weight,
                    dispatchId: load.dispatch?.id,
                    // TODO: EXTRACT TO NEW FORM TO AVOID THIS REMAPING
                    trailerTypeId: loadRequirements?.trailerType?.id,
                    truckTypeId: loadRequirements?.truckType?.id,
                    trailerLengthId: loadRequirements?.trailerLength?.id,
                    doorType: loadRequirements?.doorType?.id,
                    suspension: loadRequirements?.suspension?.id,
                    year: loadRequirements?.year,
                    liftgate: loadRequirements?.liftgate,
                    // Check this generalCommodity
                    generalCommodity: load.generalCommodity?.id,
                    // Check this brokerContact
                    brokerContact: load.brokerContact?.brokerId,

                    driverMessage: '',
                    note: load.note,
                    baseRate: load.baseRate,
                });
            });
        } else {
            staticData$.subscribe((staticData) => {
                this.staticData = staticData;
                this.modalTitle = LoadModalHelper.generateTitle(
                    this.editData,
                    {}
                );
            });
        }
    }

    private onCloseModal(): void {
        this.ngbActiveModal.close();
    }
}
