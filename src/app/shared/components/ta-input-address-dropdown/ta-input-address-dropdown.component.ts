import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Self,
    ViewChild,
    ViewEncapsulation,
    ChangeDetectorRef,
    HostListener,
} from '@angular/core';
import {
    distinctUntilChanged,
    filter,
    Subject,
    switchMap,
    takeUntil,
    throttleTime,
} from 'rxjs';
import {
    UntypedFormGroup,
    NgControl,
    ControlValueAccessor,
    FormsModule,
} from '@angular/forms';

// Config
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

// Services
import { AddressService } from '@shared/services/address.service';

// Components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';

// Modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// enums
import { InputAddressStopTypesStringEnum } from '@shared/components/ta-input-address-dropdown/enums/input-address-stop-types-string.enum';
import { InputAddressTypeStringEnum } from '@shared/components/ta-input-address-dropdown/enums/input-address-type-string.enum';
import { InputAddressLayersStringEnum } from '@shared/components/ta-input-address-dropdown/enums/input-address-layers-string.enum';
import { EGeneralActions } from '@shared/enums';

// models
import { AddressData } from '@shared/components/ta-input-address-dropdown/models/address-data.model';
import { AddressList } from '@shared/components/ta-input-address-dropdown/models/address-list.model';
import { CommandsHandler } from '@shared/components/ta-input-address-dropdown/models/commands-handler.model';
import { AutocompleteSearchLayer } from 'appcoretruckassist';

@Component({
    selector: 'app-ta-input-address-dropdown',
    templateUrl: './ta-input-address-dropdown.component.html',
    styleUrls: [
        './ta-input-address-dropdown.component.scss',
        '../ta-input/ta-input.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        // Modules
        CommonModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        AngularSvgIconModule,

        // Components
        TaAppTooltipV2Component,
        TaInputDropdownComponent,
    ],
})
export class TaInputAddressDropdownComponent
    implements OnInit, ControlValueAccessor, OnDestroy
{
    @ViewChild('inputDropdown') inputDropdown: TaInputDropdownComponent;

    @Input() public activeAddress: AddressList;

    @Input() public inputConfig: ITaInput;
    @Input() set placeholderType(value: string) {
        this.checkSearchLayers(value);
    }
    @Input() public commandHandler: CommandsHandler;
    @Input() public isRouting: boolean = false;
    @Input() public closedBorder: boolean = false;
    @Input() public incorrectValue: boolean;
    @Input() public hideEmptyLoaded: boolean = false;
    @Input() public isDispatchBoardAddress: boolean = false;

    @Output() selectedAddress: EventEmitter<AddressData> =
        new EventEmitter<AddressData>(null);

    @Output() closeDropdown: EventEmitter<boolean> = new EventEmitter<boolean>(
        null
    );

    @Output() commandEvent: EventEmitter<any> = new EventEmitter<boolean>(null); //leave any for now

    @Output() changeFlag: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output() incorrectEvent: EventEmitter<boolean> =
        new EventEmitter<boolean>();

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        const key = event.key;
        if (this.inputConfig.name == 'RoutingAddress') {
            if (key === EGeneralActions.ENTER) {
                if (this.currentAddressData)
                    this.onCommands(event, EGeneralActions.CONFIRM);
            } else if (key === EGeneralActions.ESCAPE) this.clearInput(event);
        }
    }

    // Address data
    public addressList: AddressList[];
    private searchLayers: AutocompleteSearchLayer[];
    public currentAddressData: AddressData;

    // Config
    public addressExpanded: boolean = false;
    public chosenFromDropdown: boolean = false;
    private allowValidation: boolean = false;
    public stopType: string = InputAddressStopTypesStringEnum.EMPTY;
    private requestSent: boolean = false;

    private destroy$ = new Subject<void>();
    public addressForm!: UntypedFormGroup;

    constructor(
        @Self() public superControl: NgControl,
        private addressService: AddressService,
        private ref: ChangeDetectorRef
    ) {
        this.superControl.valueAccessor = this;
    }

    writeValue(_: any): void {}

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public onChange(_: any): void {}

    public registerOnTouched(_: any): void {}

    ngOnInit(): void {
        this.getSuperControl.valueChanges
            .pipe(
                distinctUntilChanged(),
                throttleTime(1),
                takeUntil(this.destroy$),
                filter((term: string) => {
                    if (!term) {
                        this.inputConfig = {
                            ...this.inputConfig,
                            loadingSpinner: {
                                ...this.inputConfig.loadingSpinner,
                                isLoading: false,
                            },
                        };
                        if (this.inputConfig.isDispatchLocationDropdown)
                            this.addressList = null;
                        else this.addressList = [];
                    } else if (
                        term != this.currentAddressData?.address.address &&
                        this.inputConfig.name == 'RoutingAddress'
                    ) {
                        this.currentAddressData = null;
                    }
                    if (
                        this.inputConfig.name != 'RoutingAddress' &&
                        this.allowValidation &&
                        this.inputDropdown.inputRef.focusInput
                    ) {
                        this.requestSent = false;
                        const addressData = {
                            address: {},
                            valid: false,
                            longLat: {},
                        };
                        this.selectedAddress.emit(addressData);
                    }
                    this.allowValidation = true;
                    return term?.length >= 3;
                }),
                switchMap((query) => {
                    this.inputConfig = {
                        ...this.inputConfig,
                        loadingSpinner: {
                            ...this.inputConfig.loadingSpinner,
                            isLoading: true,
                            size: 'small',
                            color: 'white',
                        },
                    };

                    return this.addressService.getAddresses(
                        query,
                        this.searchLayers,
                        this.closedBorder
                    );
                })
            )
            .subscribe((res) => {
                let isValid = true;
                if (
                    this.searchLayers[0] ===
                    InputAddressLayersStringEnum.ADDRESS
                ) {
                    isValid = this.checkAddressValidation(
                        this.activeAddress?.address
                    );
                }

                if (!this.activeAddress || !isValid) {
                    this.getSuperControl.setErrors({ invalid: true });
                } else {
                    this.getSuperControl.setErrors(null);
                }

                if (this.inputDropdown?.popoverRef?.isOpen()) {
                    this.activeAddress = null;
                    this.getSuperControl.setErrors({ invalid: true });
                }

                this.inputConfig = {
                    ...this.inputConfig,
                    loadingSpinner: {
                        ...this.inputConfig.loadingSpinner,
                        isLoading: false,
                    },
                };

                this.addressList = res.addresses.map((item, indx) => {
                    return {
                        name: item,
                        id: indx,
                    };
                });

                this.ref.detectChanges();
            });
    }

    get getSuperControl() {
        return this.superControl.control;
    }

    public onCloseDropdown(e: boolean): void {
        let isValid = true;
        setTimeout(() => {
            if (this.searchLayers[0] === InputAddressLayersStringEnum.ADDRESS) {
                isValid = this.checkAddressValidation(
                    this.activeAddress?.address
                );

                if (!isValid) this.getSuperControl.setErrors({ invalid: true });
            }
            if (!this.requestSent && isValid) {
                this.getSuperControl.setErrors({ invalid: true });
            }
            if (
                this.getSuperControl.value == this.activeAddress?.address &&
                isValid
            ) {
                this.getSuperControl.setErrors(null);
            }
        }, 200);
        this.closeDropdown.emit(e);
    }

    public getAddressData(address: string): void {
        this.requestSent = true;
        this.addressService.getAddressInfo(address).subscribe((res) => {
            this.currentAddressData = {
                address: res.address,
                valid: res.address && res.longLat ? true : false,
                longLat: res.longLat,
            };

            if (this.currentAddressData.valid) {
                this.getSuperControl.setErrors(null);
            }
            this.selectedAddress.emit(this.currentAddressData);
        });
    }

    public onSelectDropdown(event: AddressList, action: string): void {
        switch (action) {
            case 'address': {
                this.activeAddress = event
                    ? { ...event, address: event?.name }
                    : null;
                if (event?.name) {
                    if (
                        this.searchLayers[0] ===
                        InputAddressLayersStringEnum.ADDRESS
                    ) {
                        const isValid = this.checkAddressValidation(event.name);

                        if (isValid) {
                            this.getAddressData(event.name);
                            this.getSuperControl.setValue(event.name);
                            this.getSuperControl.setErrors(null);
                        } else {
                            this.getSuperControl.setErrors({
                                invalid: true,
                            });
                        }
                    } else {
                        this.getAddressData(event.name);
                        this.getSuperControl.setValue(event.name);
                        this.getSuperControl.setErrors(null);
                    }

                    this.chosenFromDropdown = true;
                } else {
                    this.onClearInputEvent();
                    this.currentAddressData = null;
                    this.addressList = [];
                }
                this.inputDropdown?.popoverRef?.close();
                break;
            }
            default: {
                break;
            }
        }
    }

    public onCommands(e: KeyboardEvent, type: EGeneralActions): void {
        e.preventDefault();
        e.stopPropagation();

        if (
            (type === EGeneralActions.CONFIRM && this.currentAddressData) ||
            type === EGeneralActions.CANCEL
        ) {
            this.currentAddressData.type = type;
            this.commandEvent.emit(this.currentAddressData ?? {});

            this.closeAddress();
            this.clearInput(e);
        }
    }

    public addressExpand(): void {
        if (!this.addressExpanded) this.addressExpanded = true;
    }

    public closeAddress(): void {
        this.addressExpanded = false;
    }

    public clearInput(e: KeyboardEvent): void {
        this.currentAddressData = null;
        this.addressList = [];
        this.getSuperControl.setValue(null);
        this.activeAddress = null;
        this.inputDropdown?.inputRef?.clearInput(e);
        this.chosenFromDropdown = false;
    }

    private checkSearchLayers(value: string): void {
        this.searchLayers =
            value === InputAddressTypeStringEnum.LONG_ADDRESS
                ? [InputAddressLayersStringEnum.ADDRESS]
                : value === InputAddressTypeStringEnum.SHORT_ADDRESS
                  ? [InputAddressLayersStringEnum.LOCALITY]
                  : [];
    }

    public changeStopType(): void {
        let flag = false;
        if (this.stopType === InputAddressStopTypesStringEnum.EMPTY) {
            this.stopType = InputAddressStopTypesStringEnum.LOADED;
            flag = true;
        } else {
            this.stopType = InputAddressStopTypesStringEnum.EMPTY;
        }

        this.changeFlag.emit(flag);

        if (!this.chosenFromDropdown) {
            this.inputDropdown?.inputRef?.input.nativeElement.focus();
            setTimeout(() => {
                this.inputDropdown.inputRef.focusInput = true;
            }, 500);
        }
    }

    public onIncorrectInput(event: boolean): void {
        this.incorrectEvent.emit(event);
    }

    public onClearInputEvent(): void {
        if (this.inputConfig.isRequired) {
            setTimeout(() => {
                this.getSuperControl.setErrors({ required: true });
            }, 300);
        }
        const addressData = {
            address: {},
            valid: false,
            longLat: {},
        };
        this.selectedAddress.emit(addressData);
    }

    private checkAddressValidation(address: string): boolean {
        const streetNum = /\d.*\d/;

        return streetNum.test(address) ? true : false;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
