// Modules
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';

// rxjs
import { catchError, forkJoin, Observable, of } from 'rxjs';

// Enums
import { eGeneralActions } from '@shared/enums';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Services
import { LoadService } from '@shared/services/load.service';
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

// Interface
import { ILoadModal } from '@pages/new-load/pages/new-load-modal/interfaces';

// Helpers
import { LoadModalHelper } from '@pages/new-load/pages/new-load-modal/utils/helpers';

// Models
import {
    LoadModalResponse,
    LoadResponse,
    LoadTemplateResponseCreateGenericWithUploadsResponse,
} from 'appcoretruckassist';
import { Tabs } from '@shared/models';

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
import { NewLoadModalStopsComponent } from '@pages/new-load/pages/new-load-modal/components/new-load-modal-stops/new-load-modal-stops.component';

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
        NewLoadModalStopsComponent,
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
    public dropdownList: LoadModalResponse;
    public tabs: Tabs[] = LoadModalHelper.getLoadTypeTabs();

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
        // Modules
        private ngbActiveModal: NgbActiveModal,

        // Services
        private loadService: LoadService,
        private loadStoreService: LoadStoreService
    ) {}

    ngOnInit(): void {
        this.setupInitalData();
    }

    private onLoadSave(action: eGeneralActions): void {
        const isSaveAndAddNew =
            action === this.eGeneralActions.SAVE_AND_ADD_NEW;
        const { isEdit, isTemplate, id } = this.editData;
        const load = LoadModalHelper.generateLoadModel(id, this.loadForm);

        let saveObservable: Observable<LoadTemplateResponseCreateGenericWithUploadsResponse>;

        this.activeAction = action;

        if (isEdit) {
            saveObservable = isTemplate
                ? this.loadService.updateLoadTemplate(load)
                : this.loadService.apiUpdateLoad(load);
        } else {
            saveObservable = isTemplate
                ? this.loadService.apiCreateLoadTemplate(load)
                : this.loadService.apiCreateLoad(load);
        }

        saveObservable
            .pipe(
                catchError((error) => {
                    this.activeAction = null;
                    return of(null);
                })
            )
            .subscribe((result) => this.onSaveAndAddNew(isSaveAndAddNew));
    }

    private onSaveAndAddNew(isSaveAndAddNew: boolean): void {
        // Reopen modal
        if (isSaveAndAddNew) {
            this.ngbActiveModal.close();
            this.loadStoreService.onOpenModal(this.editData);

            // TODO: Update
        } else this.ngbActiveModal.close();
    }

    private onLoadConvert(action: eGeneralActions): void {
        const isTemplate = action === this.eGeneralActions.CONVERT_TO_TEMPLATE;

        this.editData = {
            isEdit: false,
            id: null,
            isTemplate,
        };

        LoadModalHelper.updateFormValidatorsForTemplate(
            this.loadForm,
            isTemplate
        );

        this.modalTitle = LoadModalHelper.generateTitle(this.editData);
    }

    private setupInitalData(): void {
        const staticData$ = this.loadService.apiGetLoadModal();

        if (this.editData.isEdit) {
            const load$ = this.loadService.getLoadById(
                this.editData.id,
                this.editData.isTemplate
            );

            forkJoin([staticData$, load$]).subscribe(([dropdownList, load]) => {
                this.dropdownList = dropdownList;
                this.load = load;

                this.modalTitle = LoadModalHelper.generateTitle(
                    this.editData,
                    load.statusType
                );

                this.loadForm = LoadModalHelper.createForm(
                    load,
                    load.loadRequirements,
                    this.editData.isTemplate
                );
            });
        } else {
            staticData$.subscribe((dropdownList) => {
                this.loadForm = LoadModalHelper.createForm(
                    null,
                    null,
                    this.editData.isTemplate
                );
                this.dropdownList = dropdownList;
                this.modalTitle = LoadModalHelper.generateTitle(this.editData);
            });
        }
    }

    private onCloseModal(): void {
        this.ngbActiveModal.close();
    }

    public onTabChange(): void {}

    public onModalAction(action: eGeneralActions): void {
        switch (action) {
            case this.eGeneralActions.CLOSE:
                this.onCloseModal();
                break;

            case this.eGeneralActions.CONVERT_TO_LOAD:
            case this.eGeneralActions.CONVERT_TO_TEMPLATE:
                this.onLoadConvert(action);
                break;

            case this.eGeneralActions.CREATE_TEMPLATE:
                // Open projection modal
                break;

            case this.eGeneralActions.SAVE:
            case this.eGeneralActions.SAVE_AND_ADD_NEW:
                this.onLoadSave(action);
                break;
        }
    }
}
