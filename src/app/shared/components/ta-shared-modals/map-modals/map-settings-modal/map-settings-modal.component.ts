import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import {
    UntypedFormGroup,
    UntypedFormBuilder,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

// services
import { FormService } from '@shared/services/form.service';
import { ModalService } from '@shared/services/modal.service';
import { TaInputService } from '@shared/services/ta-input.service';
import { RoutingStateService } from '@shared/services/routing-state.service';

// models
import { UpdateMapCommand } from 'appcoretruckassist';

// components
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';

// enums
import { EGeneralActions } from '@shared/enums';

@Component({
    selector: 'app-map-settings-modal',
    templateUrl: './map-settings-modal.component.html',
    styleUrls: ['./map-settings-modal.component.scss'],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        // Component
        TaModalComponent,
        TaTabSwitchComponent,
        TaInputComponent,
    ],
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
        private routingService: RoutingStateService
    ) {}

    ngOnInit() {
        this.createForm();

        if (this.editData?.type === EGeneralActions.EDIT) {
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
            case EGeneralActions.CLOSE: {
                break;
            }
            case 'set-map-settings': {
                if (this.mapSettingsForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.mapSettingsForm);
                    return;
                }

                if (this.editData?.type === EGeneralActions.EDIT) {
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
        if (this.editData?.type === EGeneralActions.EDIT) {
            this.editMap(this.editData.id);
        } else {
            this.mapSettingsForm.reset();
            this.isFormDirty = false;

            this.distanceTabs = this.distanceTabs.map((item, index) => {
                return {
                    ...item,
                    checked: index === 0,
                };
            });

            this.addressTabs = this.addressTabs.map((item, index) => {
                return {
                    ...item,
                    checked: index === 0,
                };
            });

            this.borderTabs = this.borderTabs.map((item, index) => {
                return {
                    ...item,
                    checked: index === 0,
                };
            });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
