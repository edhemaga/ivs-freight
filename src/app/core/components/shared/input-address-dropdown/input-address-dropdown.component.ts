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
import { AddressService } from 'src/app/core/services/shared/address.service';
import { AddressEntity } from 'appcoretruckassist';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    NgControl,
    ControlValueAccessor,
} from '@angular/forms';
import { ITaInput } from '../ta-input/ta-input.config';

@Component({
    selector: 'app-input-address-dropdown',
    templateUrl: './input-address-dropdown.component.html',
    styleUrls: [
        './input-address-dropdown.component.scss',
        '../ta-input/ta-input.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class InputAddressDropdownComponent
    implements OnInit, ControlValueAccessor, OnDestroy
{
    private destroy$ = new Subject<void>();
    public addressForm!: UntypedFormGroup;
    @ViewChild('inputDropdown') inputDropdown: any;
    @Input() activeAddress: any;
    addresList: any[] = [];
    currentAddress: any;
    searchLayers: any[] = [];
    currentAddressData: any;
    @Input() inputConfig: ITaInput;
    @Input() set placeholderType(value) {
        this.checkSearchLayers(value);
    }
    @Input() commandHandler: any;
    @Input() isRouting: boolean = false;
    @Input() closedBorder: boolean = false;
    @Input() incorrectValue: boolean;
    @Input() hideEmptyLoaded: boolean = false;
    addressExpanded: boolean = false;
    chosenFromDropdown: boolean = false;
    allowValidation: boolean = false;
    stopType: string = 'EMPTY';
    requestSent: boolean = false;
    @Output() selectedAddress: EventEmitter<{
        address: AddressEntity;
        valid: boolean;
        longLat: any;
    }> = new EventEmitter<{
        address: AddressEntity;
        valid: boolean;
        longLat: any;
    }>(null);

    @Output() closeDropdown: EventEmitter<boolean> = new EventEmitter<boolean>(
        null
    );

    @Output() commandEvent: EventEmitter<boolean> = new EventEmitter<boolean>(
        null
    );

    @Output() changeFlag: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output() incorrectEvent: EventEmitter<boolean> =
        new EventEmitter<boolean>();

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: any) {
        const key = event.keyCode;
        if (this.inputConfig.name == 'RoutingAddress') {
            if (key === 13) {
                if (this.currentAddressData) {
                    this.onCommands(event, 'confirm');
                }
            } else if (key === 27) {
                this.clearInput(event);
            }
        }
    }

    constructor(
        @Self() public superControl: NgControl,
        private addressService: AddressService,
        private formBuilder: UntypedFormBuilder,
        private ref: ChangeDetectorRef
    ) {
        this.superControl.valueAccessor = this;
    }

    writeValue(_: any): void {}

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public onChange(_: any): void {}

    registerOnTouched(_: any): void {}

    ngOnInit(): void {
        this.getSuperControl.valueChanges
            .pipe(
                distinctUntilChanged(),
                throttleTime(1),
                takeUntil(this.destroy$),
                filter((term: string) => {
                    if (!term) {
                        this.inputConfig.loadingSpinner = {
                            isLoading: false,
                        };
                        this.addresList = [];
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
                            longLat: [],
                        };
                        this.selectedAddress.emit(addressData);
                    }
                    this.allowValidation = true;
                    return term?.length >= 3;
                }),
                switchMap((query) => {
                    this.inputConfig.loadingSpinner = {
                        size: 'small',
                        color: 'white',
                        isLoading: true,
                    };

                    return this.addressService.getAddresses(
                        query,
                        this.searchLayers,
                        this.closedBorder
                    );
                })
            )
            .subscribe((res) => {
                if (
                    !this.activeAddress ||
                    this.activeAddress?.address != this.getSuperControl.value
                ) {
                    this.getSuperControl.setErrors({ invalid: true });
                } else {
                    this.getSuperControl.setErrors(null);
                }

                this.inputConfig.loadingSpinner = {
                    isLoading: false,
                };

                this.addresList = res.addresses.map((item, indx) => {
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

    public onCloseDropdown(e) {
        setTimeout(() => {
            if (!this.requestSent) {
                this.getSuperControl.setErrors({ invalid: true });
            }
            if (this.getSuperControl.value == this.activeAddress?.address) {
                this.getSuperControl.setErrors(null);
            }
        }, 200);
        this.closeDropdown.emit(e);
    }

    public getAddressData(address) {
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

    public onSelectDropdown(event: any, action: string) {
        switch (action) {
            case 'address': {
                this.activeAddress = event
                    ? { ...event, address: event?.name }
                    : null;
                if (event?.name) {
                    this.getAddressData(event.name);
                    this.getSuperControl.setValue(event.name);
                    this.getSuperControl.setErrors(null);

                    this.chosenFromDropdown = true;
                } else {
                    this.onClearInputEvent();
                    this.currentAddressData = null;
                    this.addresList = [];
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    onCommands(e, type) {
        e.preventDefault();
        e.stopPropagation();

        if (
            (type == 'confirm' && this.currentAddressData) ||
            type == 'cancel'
        ) {
            if ( !this.currentAddressData ) this.currentAddressData = {};
            this.currentAddressData.type = type;
            this.commandEvent.emit(this.currentAddressData);

            this.closeAddress();
            this.clearInput(e);
        }
    }

    addressExpand() {
        if (!this.addressExpanded) {
            this.addressExpanded = true;
        }
    }

    closeAddress() {
        this.addressExpanded = false;
    }

    clearInput(e) {
        this.currentAddressData = null;
        this.addresList = [];
        this.getSuperControl.setValue(null);
        this.activeAddress = null;
        this.inputDropdown?.inputRef?.clearInput(e);
        this.chosenFromDropdown = false;
    }

    checkSearchLayers(value) {
        this.searchLayers =
            value == 'longAddress'
                ? ['Address']
                : value == 'shortAddress'
                ? ['Locality']
                : [];
    }

    changeStopType() {
        let flag = false;
        if (this.stopType == 'EMPTY') {
            this.stopType = 'LOADED';
            flag = true;
        } else {
            this.stopType = 'EMPTY';
        }

        this.changeFlag.emit(flag);

        if (!this.chosenFromDropdown) {
            this.inputDropdown?.inputRef?.input.nativeElement.focus();
            setTimeout(() => {
                this.inputDropdown.inputRef.focusInput = true;
            }, 500);
        }
    }

    onIncorrectInput(event: boolean) {
        this.incorrectEvent.emit(event);
    }

    onClearInputEvent(e?: any) {
        if (this.inputConfig.isRequired) {
            setTimeout(() => {
                this.getSuperControl.setErrors({ required: true });
            }, 300);
        }
        const addressData = {
            address: {},
            valid: false,
            longLat: [],
        };
        this.selectedAddress.emit(addressData);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
