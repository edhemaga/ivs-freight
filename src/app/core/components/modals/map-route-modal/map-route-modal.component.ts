import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/core/services/form/form.service';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { Subject, takeUntil } from 'rxjs';
import { TruckTService } from '../../truck/state/truck.service';
import { TruckListResponse, CreateRouteCommand } from 'appcoretruckassist';
import { RoutingStateService } from '../../routing/state/routing-state/routing-state.service';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
    selector: 'app-map-route-modal',
    templateUrl: './map-route-modal.component.html',
    styleUrls: ['./map-route-modal.component.scss'],
})
export class MapRouteModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    public mapRouteForm: FormGroup;
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

    constructor(
        private formBuilder: FormBuilder,
        private formService: FormService,
        private modalService: ModalService,
        private inputService: TaInputService,
        private truckService: TruckTService,
        private routingService: RoutingStateService,
        private notificationService: NotificationService
    ) {}

    ngOnInit() {
        this.createForm();
        this.getTrucks();

        if (this.editData?.type === 'edit') {
            this.getRoute(this.editData.id);
        }
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

    public onModalAction(data: { action: string; bool: boolean }) {
        switch (data.action) {
            case 'close': {
                break;
            }
            case 'create-map-route': {
                if (this.mapRouteForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.mapRouteForm);
                    return;
                }

                if (this.editData?.type === 'edit') {
                    this.updateRoute(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: 'create-map-route',
                        status: true,
                    });
                } else {
                    this.addRoute();
                    this.modalService.setModalSpinner({
                        action: 'create-map-route',
                        status: true,
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
            .getTruckList(1, 1, 25)
            .pipe(takeUntil(this.destroy$))
            .subscribe((trucks: TruckListResponse) => {
                this.truckType = trucks.pagination.data.map((truck) => {
                    return {
                        ...truck.truckType,
                        folder: 'common',
                        subFolder: 'trucks',
                    };
                });
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
                next: () => {},
                error: () => {},
            });
    }

    private updateRoute(id: number) {
        const form = this.mapRouteForm.value;

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
                next: () => {},
                error: () => {},
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
        if (this.editData?.type === 'edit') {
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
