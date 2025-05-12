/* eslint-disable */
// Modules
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
    NgbActiveModal,
    NgbModule,
    NgbPopover,
} from '@ng-bootstrap/ng-bootstrap';
import {
    FormArray,
    ReactiveFormsModule,
    UntypedFormGroup,
} from '@angular/forms';

// rxjs
import { catchError, forkJoin, Observable, of } from 'rxjs';

// Enums
import { eGeneralActions } from '@shared/enums';
import { eLoadModalActions } from '@pages/new-load/enums';
import {
    eLoadModalForm,
    eLoadModalStopsForm,
} from '@pages/new-load/pages/new-load-modal/enums';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Services
import { LoadService } from '@shared/services/load.service';
import { LoadStoreService } from '@pages/new-load/state/services/load-store.service';
import { RoutingService } from '@shared/services/routing.service';

// Interface
import { ILoadModal } from '@pages/new-load/pages/new-load-modal/interfaces';

// Helpers
import { LoadModalHelper } from '@pages/new-load/pages/new-load-modal/utils/helpers';

// Models
import {
    DispatchLoadModalResponse,
    EnumValue,
    LoadModalResponse,
    LoadResponse,
    LoadTemplateResponseCreateGenericWithUploadsResponse,
    LongLat,
    RoutingResponse,
    ShipperLoadModalResponse,
} from 'appcoretruckassist';
import { Tabs } from '@shared/models';

// Config
import { LoadModalConfig } from '@pages/load/pages/load-modal/utils/constants';

// Pipes
import { TemplateButtonConfigPipe } from '@pages/new-load/pages/new-load-modal/pipes/template-button-config.pipe';
import { LoadModalInputConfigPipe } from '@pages/new-load/pages/new-load-modal/pipes/load-modal-input-config.pipe';

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
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

@Component({
    selector: 'app-new-load-modal',
    templateUrl: './new-load-modal.component.html',
    styleUrl: './new-load-modal.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgbModule,

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
        TaAppTooltipV2Component,
        NewLoadModalStopsComponent,

        // Pipes
        TemplateButtonConfigPipe,
        LoadModalInputConfigPipe,
    ],
})
export class NewLoadModalComponent<T> implements OnInit {
    @ViewChild('popover') popover!: NgbPopover;

    // Inputs
    @Input() editData: ILoadModal;

    private driverLocation: LongLat;
    private stopsLocations: LongLat[] = [];

    public isModalValidToSubmit = false;

    // Show spinner when saving modal
    public activeAction = null;

    // Main modal title
    public modalTitle: string;

    // If user preselect template we need to change template popover
    public isTemplateSelected: boolean;
    public isPopoverOpen: boolean = false;
    // Show static data, such as status, load number
    public load: LoadResponse;
    // Show dropdown list options
    public dropdownList: LoadModalResponse;
    public tabs: Tabs[] = LoadModalHelper.getLoadTypeTabs();
    public routing: RoutingResponse;

    // Enums
    public eModalButtonClassType = eModalButtonClassType;
    public eModalButtonSize = eModalButtonSize;
    public eGeneralActions = eGeneralActions;
    public eLoadModalActions = eLoadModalActions;
    public eLoadModalForm = eLoadModalForm;

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
        private loadStoreService: LoadStoreService,
        private routingService: RoutingService
    ) {}

    ngOnInit(): void {
        this.setupInitialData();
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
                catchError(() => {
                    this.activeAction = null;
                    return of(null);
                })
            )
            .subscribe((result) => {
                if (result) this.onSaveAndAddNew(isSaveAndAddNew);
            });
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
        // Reset tooltip template button styles
        this.isTemplateSelected = false;

        // Switch view
        const isTemplate = action === this.eGeneralActions.CONVERT_TO_TEMPLATE;

        const isTemplateConvertedToLoad =
            action === this.eGeneralActions.CONVERT_TO_LOAD;

        this.editData = {
            isEdit: false,
            id: null,
            isTemplate,
            type: isTemplateConvertedToLoad
                ? eLoadModalActions.CREATE_LOAD_FROM_TEMPLATE
                : null,
        };

        LoadModalHelper.updateFormValidatorsForTemplate(
            this.loadForm,
            isTemplate
        );

        this.modalTitle = LoadModalHelper.generateTitle(this.editData);
    }

    private setupInitialData(): void {
        const staticData$ = this.loadService.apiGetLoadModal();

        if (this.editData.isEdit || !!this.editData.type) {
            const load$ = this.loadService.getLoadById(
                this.editData.id,
                this.editData.isTemplate
            );

            // Preselect button tooltip
            this.isTemplateSelected =
                this.editData.type ===
                eLoadModalActions.CREATE_LOAD_FROM_TEMPLATE;

            // If we have load type that means we are converting load to template or vice versa
            if (
                this.editData.type ===
                    eLoadModalActions.CREATE_LOAD_FROM_TEMPLATE ||
                this.editData.type ===
                    eLoadModalActions.CREATE_TEMPLATE_FROM_LOAD
            ) {
                const isTemplate =
                    this.editData.type ===
                    eLoadModalActions.CREATE_TEMPLATE_FROM_LOAD;

                this.editData = {
                    ...this.editData,
                    id: null,
                    isTemplate,
                    isEdit: false,
                };
            }

            forkJoin([staticData$, load$]).subscribe(([dropdownList, load]) => {
                this.dropdownList = dropdownList;
                this.load = load;

                this.modalTitle = LoadModalHelper.generateTitle(
                    this.editData,
                    load.statusType
                );

                this.loadForm = LoadModalHelper.createForm(
                    this.editData.isEdit,
                    load,
                    load.loadRequirements,
                    this.editData.isTemplate
                );
            });
        } else
            staticData$.subscribe((dropdownList) => {
                this.loadForm = LoadModalHelper.createForm(
                    false,
                    null,
                    null,
                    this.editData.isTemplate
                );
                this.dropdownList = dropdownList;
                this.modalTitle = LoadModalHelper.generateTitle(this.editData);
            });
    }

    private onCloseModal(): void {
        this.ngbActiveModal.close();
    }

    public onTabChange(): void {}

    public onRemoveTemplate(): void {
        this.isTemplateSelected = false;
    }

    public onDeleteTemplate(): void {
        this.loadStoreService.onDeleteLoadsFromList({
            isTemplate: true,
            loads: [this.load],
            isDetailsPage: false,
            ngbActiveModal: this.ngbActiveModal,
        });
    }

    public onDispatcherSelection(dispatcher: DispatchLoadModalResponse): void {
        this.driverLocation = dispatcher.currentLocationCoordinates;
        this.updateRouting();
    }

    public onShipperSelection(stop: {
        shipper: ShipperLoadModalResponse;
        index: number;
    }): void {
        this.stopsLocations[stop.index] = {
            latitude: stop.shipper.latitude,
            longitude: stop.shipper.longitude,
        };

        this.updateRouting();
    }

    public updateRouting(): void {
        if (!this.driverLocation || this.stopsLocations.length === 0) return;

        const locations = [this.driverLocation, ...this.stopsLocations].filter(
            (location) => !!location
        );

        this.routingService.getRoutingMiles(locations).subscribe((routing) => {
            this.routing = routing;

            this.routing.legs.forEach((leg, index) => {
                (this.loadForm.get(eLoadModalForm.STOPS) as FormArray)
                    .at(index)
                    .patchValue({
                        [eLoadModalStopsForm.LEG_HOURS]: [leg.hours],
                        [eLoadModalStopsForm.LEG_MILES]: [leg.minutes],
                        [eLoadModalStopsForm.LEG_MINUTES]: [leg.minutes],
                        [eLoadModalStopsForm.SHAPE]: [leg.shape],

                        // TODO: Maybe save this on load, it could affter reodering?
                        [eLoadModalStopsForm.STOP_ORDER]: [index + 1],

                        // Stop load orders should have different count, it is count separate based on load type
                        [eLoadModalStopsForm.STOP_LOAD_ORDER]: [index + 1],
                    });
            });
        });
    }

    public onSelectTemplate(template: EnumValue): void {
        this.isTemplateSelected = true;

        this.editData = {
            isTemplate: false,
            isEdit: false,
            id: template.id,
        };

        const loadTemplate$ = this.loadService.getLoadById(template.id, true);

        loadTemplate$.subscribe((loadTemplate) => {
            this.modalTitle = LoadModalHelper.generateTitle(this.editData);
            const templateForm = LoadModalHelper.createForm(
                false,
                loadTemplate,
                loadTemplate.loadRequirements,
                false
            );

            this.loadForm.patchValue(templateForm.value);
        });
    }

    public onModalAction(action: eGeneralActions): void {
        switch (action) {
            case this.eGeneralActions.DELETE:
                this.onDeleteTemplate();
                break;
            case this.eGeneralActions.CLOSE:
                this.onCloseModal();
                break;

            case this.eGeneralActions.CONVERT_TO_LOAD:
            case this.eGeneralActions.CONVERT_TO_TEMPLATE:
                this.onLoadConvert(action);
                break;

            case this.eGeneralActions.CREATE_TEMPLATE:
                // TODO Open projection modal
                break;

            case this.eGeneralActions.SAVE:
            case this.eGeneralActions.SAVE_AND_ADD_NEW:
                this.onLoadSave(action);
                break;
        }
    }
}
