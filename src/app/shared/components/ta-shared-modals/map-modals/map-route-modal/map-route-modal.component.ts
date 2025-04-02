import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

// services
import { FormService } from '@shared/services/form.service';
import { ModalService } from '@shared/services/modal.service';
import { TaInputService } from '@shared/services/ta-input.service';
import { RoutingStateService } from '@shared/services/routing-state.service';
import { TruckService } from '@shared/services/truck.service';

// models
import { TruckListResponse, CreateRouteCommand } from 'appcoretruckassist';

// components
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaCheckboxCardComponent } from '@shared/components/ta-checkbox-card/ta-checkbox-card.component';
import {
    CaInputDatetimePickerComponent,
    CaTabSwitchComponent,
} from 'ca-components';

// enums
import { eGeneralActions } from '@shared/enums';

@Component({
    selector: 'app-map-route-modal',
    templateUrl: './map-route-modal.component.html',
    styleUrls: ['./map-route-modal.component.scss'],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        // Component
        TaModalComponent,
        TaInputComponent,
        TaInputDropdownComponent,
        TaCheckboxCardComponent,
        CaTabSwitchComponent,
        CaInputDatetimePickerComponent,
    ],
})
export class MapRouteModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    public mapRouteForm: UntypedFormGroup;
    public isFormDirty: boolean = false;

    public routeTabs: { id: number; name: string; checked: boolean }[] = [
        {
            id: 1,
            name: 'PRACTICAL',
            checked: true,
        },
        {
            id: 2,
            name: 'SHORTEST',
            checked: false,
        },
        {
            id: 3,
            name: 'CHEAPEST',
            checked: false,
        },
    ];

    public selectedTruckType: any = null;
    public truckType: any[] = [];

    public fuelCostCheckboxCard: boolean = true;

    private destroy$ = new Subject<void>();

    public addNewAfterSave: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private formService: FormService,
        private modalService: ModalService,
        private inputService: TaInputService,
        private truckService: TruckService,
        private routingService: RoutingStateService
    ) {}

    ngOnInit() {
        this.createForm();
        this.getTrucks();
    }

    private createForm() {
        var routeName = this.editData?.routeName
            ? this.editData?.routeName
            : null;

        this.mapRouteForm = this.formBuilder.group({
            routeName: [null, [Validators.required, Validators.maxLength(16)]],
            routeType: [null],
            truckId: [null],
            stopTime: [null],
            fuelCost: [null],
            fuelMpg: [null, Validators.maxLength(5)],
            fuelPrice: [null, Validators.maxLength(5)],
        });

        if (routeName) {
            this.setRouteNamePlaceholder();
            this.isFormDirty = true;
        }

        this.formService.checkFormChange(this.mapRouteForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;

                if (routeName) {
                    this.isFormDirty = true;
                }
            });
    }

    private setRouteNamePlaceholder() {
        var routeName = this.editData?.routeName
            ? this.editData?.routeName
            : null;

        this.mapRouteForm.patchValue({
            routeName: routeName,
        });

        if (routeName) this.isFormDirty = true;
    }

    public onModalAction(data: { action: string; bool: boolean }): void {
        switch (data.action) {
            case eGeneralActions.CLOSE: {
                break;
            }
            case 'save and add new': {
                if (this.mapRouteForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.mapRouteForm);
                    return;
                }
                this.addRoute();
                this.modalService.setModalSpinner({
                    action: 'save and add new',
                    status: true,
                    close: false,
                });
                this.addNewAfterSave = true;
                break;
            }
            case 'create-map-route': {
                if (this.mapRouteForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.mapRouteForm);
                    return;
                }

                if (this.editData?.type === eGeneralActions.EDIT) {
                    this.updateRoute(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: 'create-map-route',
                        status: true,
                        close: false,
                    });
                } else {
                    this.addRoute();
                    this.modalService.setModalSpinner({
                        action: 'create-map-route',
                        status: true,
                        close: false,
                    });
                }
                break;
            }

            case 'reset-map-routing': {
                this.resetForm();
                break;
            }
            default: {
                break;
            }
        }
    }

    public onTabChange(event: any, type: string): void {
        switch (type) {
            case 'Distance-tab': {
                this.mapRouteForm.get('routeType').setValue(event.name);
                break;
            }
            default: {
                break;
            }
        }
    }

    public onSelectDropdown(event: any) {
        this.selectedTruckType = event;
    }

    private getTrucks() {
        this.truckService
            .getTruckList(1, null, 1, 25)
            .pipe(takeUntil(this.destroy$))
            .subscribe((trucks: TruckListResponse) => {
                this.truckType = trucks.pagination.data.map((truck) => {
                    return {
                        id: truck.id,
                        name: truck.truckNumber,
                        truckType: truck.truckType,
                        folder: 'common',
                        subFolder: 'trucks',
                        logoName: truck.truckType.logoName,
                    };
                });

                // Edit
                if (this.editData?.type === eGeneralActions.EDIT) {
                    this.getRoute(this.editData.id);
                }
            });
    }

    private addRoute() {
        const form = this.mapRouteForm.value;

        const newData: CreateRouteCommand = {
            name: form.routeName,
            mapId: this.editData.mapId,
        };

        this.routingService
            .addRoute(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.addNewAfterSave) {
                        this.modalService.setModalSpinner({
                            action: 'save and add new',
                            status: false,
                            close: false,
                        });
                        this.formService.resetForm(this.mapRouteForm);
                        this.selectedTruckType = null;
                        this.routeTabs = this.routeTabs.map((item, index) => {
                            return {
                                ...item,
                                checked: index === 0,
                            };
                        });
                        this.addNewAfterSave = true;
                    } else {
                        this.modalService.setModalSpinner({
                            action: null,
                            status: true,
                            close: true,
                        });
                    }
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: false,
                        close: false,
                    });
                },
            });
    }

    private updateRoute(id: number) {
        const form = this.mapRouteForm.value;

        this.editData.stops.map((stop) => {
            stop.latitude = stop.lat;
            stop.longitude = stop.long;
        });

        const newData: any = {
            id: id,
            name: form.routeName,
            shape: this.editData.shape ? this.editData.shape : '',
            stops: this.editData.stops ? this.editData.stops : [],
        };

        this.routingService
            .updateRoute(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: true,
                    });
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: false,
                        close: false,
                    });
                },
            });
    }

    private getRoute(id: number) {
        this.routingService
            .getRouteById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    this.mapRouteForm.patchValue({
                        routeName: res.name,
                    });
                },
                error: () => {},
            });
    }

    private resetForm() {
        if (this.editData?.type === eGeneralActions.EDIT) {
            this.getRoute(this.editData.id);
        } else {
            this.mapRouteForm.reset();
            this.isFormDirty = false;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
