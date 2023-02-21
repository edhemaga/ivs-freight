import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FormService } from '../../../services/form/form.service';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { RoutingStateService } from '../../routing/state/routing-state/routing-state.service';
import { UpdateMapCommand } from 'appcoretruckassist';
import { CommonModule } from '@angular/common';
import { TaModalComponent } from '../../shared/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '../../standalone-components/ta-tab-switch/ta-tab-switch.component';
import { TaInputComponent } from '../../shared/ta-input/ta-input.component';

@Component({
    selector: 'app-map-settings-modal',
    templateUrl: './map-settings-modal.component.html',
    styleUrls: ['./map-settings-modal.component.scss'],
    standalone: true,
    imports: [ 
                CommonModule, 
                FormsModule, 
                TaModalComponent, 
                TaTabSwitchComponent, 
                ReactiveFormsModule, 
                TaInputComponent
    ]
})
export class MapSettingsModalComponent implements OnInit, OnDestroy {
    public mapSettingsForm: UntypedFormGroup;
    public isFormDirty: boolean = false;
    @Input() editData: any;

    public distanceTabs: { id: number; name: string; checked: boolean }[] = [
        {
            id: 1,
            name: 'MILES',
            checked: true,
        },
        {
            id: 2,
            name: 'KM',
            checked: false,
        },
    ];

    public addressTabs: { id: number; name: string; checked: boolean }[] = [
        {
            id: 1,
            name: 'CITY',
            checked: true,
        },
        {
            id: 2,
            name: 'ADDRESS',
            checked: false,
        },
    ];

    public borderTabs: { id: number; name: string; checked: boolean }[] = [
        {
            id: 1,
            name: 'OPEN BORDER',
            checked: true,
        },
        {
            id: 2,
            name: 'CLOSED BORDER',
            checked: false,
        },
    ];

    private destroy$ = new Subject<void>();

    constructor(
        private formBuilder: UntypedFormBuilder,
        private formService: FormService,
        private modalService: ModalService,
        private inputService: TaInputService,
        private notificationService: NotificationService,
        private routingService: RoutingStateService
    ) {}

    ngOnInit() {
        this.createForm();

        if (this.editData?.type === 'edit') {
            this.editMap(this.editData.id);
        }
    }

    private createForm() {
        this.mapSettingsForm = this.formBuilder.group({
            mapName: [null, [Validators.required, Validators.maxLength(16)]],
            distanceUnit: [null],
            addressType: [null],
            borderType: [null],
        });

        this.formService.checkFormChange(this.mapSettingsForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    public onModalAction(data: { action: string; bool: boolean }) {
        switch (data.action) {
            case 'close': {
                break;
            }
            case 'set-map-settings': {
                if (this.mapSettingsForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.mapSettingsForm);
                    return;
                }

                if (this.editData?.type === 'edit') {
                    this.updateMap(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: 'set-map-settings',
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
                let distanceUnit = event.name == 'Miles' ? 'mi' : 'km';

                this.mapSettingsForm.get('distanceUnit').setValue(distanceUnit);
                break;
            }
            case 'Address-tab': {
                let addressType = event.name == 'City' ? 'city' : 'address';

                this.mapSettingsForm.get('addressType').setValue(addressType);
                break;
            }
            case 'Border-tab': {
                let borderType =
                    event.name == 'Open Border' ? 'open' : 'closed';

                this.mapSettingsForm.get('borderType').setValue(borderType);
                break;
            }
            default: {
                break;
            }
        }
    }

    private updateMap(id: number) {
        const form = this.mapSettingsForm.value;

        const newData: UpdateMapCommand = {
            id: id,
            name: form.mapName,
        };

        this.routingService
            .updateMap(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.setModalSpinner({
                        action: 'set-map-settings',
                        status: true,
                        close: true,
                    });
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: 'set-map-settings',
                        status: false,
                        close: false,
                    });
                },
            });
    }

    private editMap(id: number) {
        this.routingService
            .getMapById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    this.mapSettingsForm.patchValue({
                        mapName: res.name,
                    });
                },
                error: () => {},
            });
    }

    private resetForm() {
        if (this.editData?.type === 'edit') {
            this.editMap(this.editData.id);
        } else {
            this.mapSettingsForm.reset();
            this.isFormDirty = false;
        }

        this.distanceTabs = [
            {
                id: 1,
                name: 'Miles',
                checked: false,
            },
            {
                id: 2,
                name: 'Km',
                checked: false,
            },
        ];

        this.addressTabs = [
            {
                id: 1,
                name: 'City',
                checked: false,
            },
            {
                id: 2,
                name: 'Address',
                checked: false,
            },
        ];

        this.borderTabs = [
            {
                id: 1,
                name: 'Open Border',
                checked: false,
            },
            {
                id: 2,
                name: 'Closed Border',
                checked: false,
            },
        ];
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
