import { Subject, takeUntil } from 'rxjs';
import { NgbDropdownConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    QueryList,
    EventEmitter,
    Output,
    OnDestroy,
} from '@angular/core';
import {
    FormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    ReactiveFormsModule,
} from '@angular/forms';

import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { CommonModule } from '@angular/common';

// pipes
import { ThousandSeparatorPipe } from '@shared/pipes/thousand-separator.pipe';
import { TaSvgPipe } from '@shared/pipes/ta-svg.pipe';

// validators
import { addressValidation } from '@shared/components/ta-input/validators/ta-input.regex-validations';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaAutoclosePopoverComponent } from '@shared/components/ta-autoclose-popover/ta-autoclose-popover.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaProfileImagesComponent } from '@shared/components/ta-profile-images/ta-profile-images.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaNgxSliderComponent } from '@shared/components/ta-ngx-slider/ta-ngx-slider.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';

// services
import { FilterStateService } from '@shared/components/ta-filter/services/filter-state.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

// constants
import { DirectiveConstants } from '@shared/components/ta-filter/utils/constants/directive.constants';
import { FilterConfigConstants } from '@shared/components/ta-filter/utils/constants/filter-config.constants';

// animations
import { areaLeftSideAnimation } from '@shared/components/ta-filter/animations/area-left-side.animation';
import { areaRightSideAnimation } from '@shared/components/ta-filter/animations/area-right-side.animation';
import { closeForm } from '@shared/components/ta-filter/animations/close-form.animation';
import { inOutAnimation } from '@shared/components/ta-filter/animations/in-out.animation';
import { showAnimation } from '@shared/components/ta-filter/animations/show.animation';
import { stateHeader } from '@shared/components/ta-filter/animations/state-header.animation';

// models
import { ArrayStatus } from '@shared/components/ta-filter/models/array-status.model';

@Component({
    selector: 'app-ta-filter',
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        NgxSliderModule,

        // compoenents
        TaAutoclosePopoverComponent,
        TaAppTooltipV2Component,
        TaProfileImagesComponent,
        TaInputComponent,
        TaInputAddressDropdownComponent,
        TaNgxSliderComponent,
        TaTabSwitchComponent,

        // pipes
        TaSvgPipe,
    ],
    templateUrl: './ta-filter.component.html',
    styleUrls: ['./ta-filter.component.scss'],
    providers: [NgbDropdownConfig, ThousandSeparatorPipe, TaSvgPipe],
    encapsulation: ViewEncapsulation.None,
    animations: [
        closeForm('closeForm'),
        inOutAnimation('inOutAnimation'),
        stateHeader('stateHeader'),
        showAnimation('showAnimation'),
        areaRightSideAnimation('areaRightSideAnimation'),
        areaLeftSideAnimation('areaLeftSideAnimation'),
    ],
})
export class TaFilterComponent implements OnInit, OnDestroy {
    @ViewChild('t2') t2: any;
    @ViewChild('mainFilter') mainFilter: any;
    @ViewChild(TaAutoclosePopoverComponent)
    autoClose: TaAutoclosePopoverComponent;
    public hoverFilter: boolean = false;

    @Input() type: string = 'userFilter';
    @Input() icon: string = 'user';
    @Input() subType: string = 'pendingStatus';
    @Input() pmSubtype: string = '';
    @Input() searchState: boolean = false;
    @Input() filterTitle: any = '';
    @Input() defFilterHolder: boolean = false;
    @Input() noLeftIcon: boolean = false;
    @Input() leftSideIcon: boolean = false;
    @Input() largeLeftIcon: boolean = false;
    @Input() moneyFilter: boolean = false;
    @Input() fuelType: boolean = false;
    @Input() swipeFilter: boolean = false;
    @Input() locationDefType: boolean = false;
    @Input() legendView: boolean = false;
    @Input() repairFilter: boolean = false;
    @Input() toDoSubType: string = '';
    @Input() dataArray: any;
    @Input() areaFilter: boolean = false;

    @Output() setFilter = new EventEmitter<any>();

    private destroy$ = new Subject<void>();
    public autoCloseComponent: QueryList<TaAutoclosePopoverComponent>;

    public labelArray: ArrayStatus[] = DirectiveConstants.LABEL_ARRAY;
    public unselectedUser: ArrayStatus[] = DirectiveConstants.UNSELECTED_USER;
    public selectedUser: ArrayStatus[] = [];
    public unselectedDispatcher: ArrayStatus[] =
        DirectiveConstants.UNSELECTED_DISPATCHER;
    public departmentArray: ArrayStatus[] = DirectiveConstants.DEPARTMANT_ARRAY;
    public pendingStatusArray: ArrayStatus[] =
        DirectiveConstants.PENDING_STATUS_ARRAY;
    public activeStatusArray: ArrayStatus[] =
        DirectiveConstants.ACTIVE_STATUS_ARRAY;
    public closedStatusArray: ArrayStatus[] =
        DirectiveConstants.CLOSED_STATUS_ARRAY;
    public pmFilterArray: ArrayStatus[];
    public categoryFuelArray: ArrayStatus[] = JSON.parse(
        JSON.stringify(DirectiveConstants.CATEGORY_FUEL_ARRAY)
    );

    public categoryRepairArray: ArrayStatus[] = JSON.parse(
        JSON.stringify(DirectiveConstants.CATEGORY_REPAIR_ARRAY)
    );
    public truckArray: ArrayStatus[] = JSON.parse(
        JSON.stringify(DirectiveConstants.TRAILER_ARRAY)
    );
    public trailerArray: ArrayStatus[] = JSON.parse(
        JSON.stringify(DirectiveConstants.TRAILER_ARRAY)
    );

    public fuelStopArray: ArrayStatus[] = DirectiveConstants.FUEL_STOP_ARRAY;
    public brokerArray: ArrayStatus[] = DirectiveConstants.BROKER_ARRAY;
    public driverArray: ArrayStatus[] = DirectiveConstants.DRIVER_ARRAY;
    public truckTypeArray: ArrayStatus[] = DirectiveConstants.TRUCK_TYPE_ARRAY;
    public trailerTypeArray: ArrayStatus[] =
        DirectiveConstants.TRAILER_TYPE_ARRAY;
    public usaStates: ArrayStatus[] = DirectiveConstants.USA_STATES;
    public canadaStates: ArrayStatus[] = DirectiveConstants.CANADA_STATES;

    public selectedDispatcher: any[] = [];
    public selectedTimeValue: any = '';
    public expandSearch: boolean = false;
    public searchInputValue: any = '';
    public showPart1: any = true;
    public showPart2: any = true;
    public showPart3: any = true;
    public searchForm!: UntypedFormGroup;
    public moneyForm!: UntypedFormGroup;
    public locationForm!: UntypedFormGroup;
    public payForm!: UntypedFormGroup;
    public sliderForm!: UntypedFormGroup;
    public rangeForm!: UntypedFormGroup;
    public areaForm!: UntypedFormGroup;
    public searchTerm: string = '';

    public rangeValue: number = 0;
    public usaSelectedStates: any[] = [];
    public canadaSelectedStates: any[] = [];
    public locationState: string = '';
    public originState: string = '';
    public destinationState: string = '';
    public singleFormError: any = '';
    public multiFormFirstError: any = '';
    public multiFormSecondError: any = '';
    public multiFormThirdError: any = '';
    public moneyFilterStatus: boolean = false;
    public setButtonAvailable: boolean = false;
    public filterActiveArray: any[] = [];
    public filterUsaActiveArray: any[] = [];
    public filterCanadaActiveArray: any[] = [];
    public filterActiveTime: string = '';
    public swipeActiveRange: number = 0;
    public singleFromActive: number | string = 0;
    public singleToActive: number | string = 0;
    public multiFromFirstFromActive: number | string = 0;
    public multiFromFirstToActive: number | string = 0;
    public multiFormSecondFromActive: number | string = 0;
    public multiFormSecondToActive: number | string = 0;
    public multiFormThirdFromActive: any = 0;
    public multiFormThirdToActive: any = 0;
    public locationRange: number = 25;
    public hoverClose: any = false;
    public areaFilterSelected: any = 'Location';

    public sliderData: Options = FilterConfigConstants.SLIDER_DATA;

    public locationSliderData: Options =
        FilterConfigConstants.LOACTION_SLIDER_DATA;

    public paySliderData: Options = FilterConfigConstants.PAY_SLIDER_DATA;

    public milesSliderData: Options = FilterConfigConstants.MILES_SLIDER_DATA;

    public minValueRange: string = '0';
    public maxValueRange: string = '5,000';

    public minValueSet: string = '0';
    public maxValueSet: string = '5,000';

    public minValueDragged: number = 0;
    public maxValueDragged: number = 20000;

    public rangeDiffNum: number = 0;

    public activeFilter: boolean = false;
    public longVal: number = 0;
    public latVal: number = 0;

    public originLongVal: number = 0;
    public originLatVal: number = 0;

    public destLongVal: number = 0;
    public destLatVal: number = 0;

    public longValueSet: number = 0;
    public latValSet: number = 0;

    public originLongValSet: number = 0;
    public originLatValSet: number = 0;

    public destLongValSet: number = 0;
    public destLatValSet: number = 0;

    public locationRangeSet: number = 25;
    public loactionNameSet: string = '';

    public activeFormNum: number = 0;
    public lastYear: any = '';
    public last2Years: any = '';
    public totalFiltersNum: number = 0;
    public singleFormActive: boolean = false;
    public sideAnimation: boolean = false;

    public areBoxTab: any[] = [
        {
            id: 1,
            name: 'Location',
            checked: true,
        },
        {
            id: 2,
            name: 'Route',
        },
    ];
    ascendingOrderCategoryRepair: boolean = true;
    ascendingOrderPm: boolean = true;
    ascendingOrderTrailer: boolean = true;
    ascendingOrderTruck: boolean = true;
    public resizeObserver: ResizeObserver;

    public isAnimated: any = false;

    constructor(
        private formBuilder: UntypedFormBuilder,

        // pipes
        private thousandSeparator: ThousandSeparatorPipe,

        // services
        private filterService: FilterStateService,
        private tableService: TruckassistTableService
    ) {}

    ngOnInit(): void {
        this.checkForType();

        this.createForm();

        this.timeAndPayFilter();

        this.watchLocationFormValueChanges();

        this.watchAreaFormValueChanges();

        this.watchRangeFormValueChanges();

        this.watchMoneyFormValueChanges();

        this.watchSearchFormValueChanges();

        this.watchTableServiceValueChanges();
    }

    private createForm(): void {
        this.rangeForm = this.formBuilder.group({
            rangeFrom: '0',
            rangeTo:
                this.type === 'payFilter' ||
                (this.type === 'moneyFilter' && this.repairFilter)
                    ? '20,000'
                    : '5,000',
        });

        this.searchForm = this.formBuilder.group({
            search: '',
        });

        this.sliderForm = this.formBuilder.group({
            sliderValue: 0,
        });

        this.moneyForm = this.formBuilder.group({
            singleFrom: '',
            singleTo: '',
            multiFromFirstFrom: '',
            multiFromFirstTo: '',
            multiFormSecondFrom: '',
            multiFormSecondTo: '',
            multiFormThirdFrom: '',
            multiFormThirdTo: '',
        });

        this.locationForm = this.formBuilder.group({
            address: [null, [...addressValidation]],
        });

        this.areaForm = this.formBuilder.group({
            origin: [null, [...addressValidation]],
            destination: [null, [...addressValidation]],
        });

        this.payForm = this.formBuilder.group({
            payFrom: '',
            payTo: '',
        });
    }

    private watchLocationFormValueChanges(): void {
        this.locationForm.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((changes) => {
                if (!changes.address) this.locationState = '';
            });
    }

    private watchAreaFormValueChanges(): void {
        this.areaForm.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((changes) => {
                if (!changes.origin) this.originState = '';

                if (!changes.destination) this.destinationState = '';
            });
    }

    private timeAndPayFilter(): void {
        if (this.type === 'timeFilter') {
            const date = new Date();
            const pastYear = date.getFullYear() - 1;
            const past2Year = date.getFullYear() - 2;

            this.lastYear = pastYear;
            this.last2Years = past2Year;
        }

        if (
            this.type === 'payFilter' ||
            (this.type === 'moneyFilter' && this.repairFilter)
        ) {
            this.maxValueRange = '20,000';
            this.maxValueSet = '20,000';
        }
    }

    private watchRangeFormValueChanges(): void {
        this.rangeForm.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((changes) => {
                if (changes) {
                    let rangeFromNum = 0;
                    let rangeToNum = parseInt(
                        this.maxValueRange.replace(/,/g, ''),
                        10
                    );
                    let maxRangeNum = parseInt(
                        this.maxValueRange.replace(/,/g, ''),
                        10
                    );

                    if (
                        changes.rangeFrom &&
                        typeof changes.rangeFrom === 'string'
                    ) {
                        rangeFromNum = parseInt(
                            changes.rangeFrom.replace(/,/g, ''),
                            10
                        );
                    }
                    if (
                        changes.rangeTo &&
                        changes.rangeTo != null &&
                        typeof changes.rangeTo === 'string'
                    ) {
                        rangeToNum = parseInt(
                            changes.rangeTo.replace(/,/g, ''),
                            10
                        );
                    }

                    if (!changes.rangeTo || rangeToNum > maxRangeNum) {
                        this.rangeForm
                            ?.get('rangeTo')
                            ?.setValue(this.maxValueRange);
                    }

                    if (rangeFromNum > maxRangeNum - 1) {
                        this.rangeForm
                            ?.get('rangeFrom')
                            ?.setValue(maxRangeNum - 1);
                    } else if (!changes.rangeTo) {
                        this.rangeForm?.get('rangeFrom')?.setValue('0');
                    }

                    this.minValueDragged = rangeFromNum;
                    this.maxValueDragged = rangeToNum;

                    this.rangeDiffNum =
                        this.maxValueDragged - this.minValueDragged;
                }
            });
    }

    private watchMoneyFormValueChanges(): void {
        this.moneyForm.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((changes) => {
                if (changes.singleFrom || changes.singleTo) {
                    if (changes.singleTo) {
                        const to = parseInt(changes.singleTo);
                        const from = parseInt(changes.singleFrom);
                        if (from > to || from === to) {
                            this.singleFormError = true;
                        } else {
                            this.singleFormError = false;
                        }
                    } else {
                        this.singleFormError = false;
                    }
                } else {
                    this.singleFormError = false;
                }

                if (changes.multiFromFirstFrom || changes.multiFromFirstTo) {
                    if (changes.multiFromFirstTo) {
                        const to = parseInt(changes.multiFromFirstTo);
                        const from = parseInt(changes.multiFromFirstFrom);

                        if (from > to || from === to) {
                            this.multiFormFirstError = true;
                        } else {
                            this.multiFormFirstError = false;
                        }
                    } else {
                        this.multiFormFirstError = false;
                    }
                } else {
                    this.multiFormFirstError = false;
                }

                if (changes.multiFormSecondFrom || changes.multiFormSecondTo) {
                    if (changes.multiFormSecondTo) {
                        const to = parseInt(changes.multiFormSecondTo);
                        const from = parseInt(changes.multiFormSecondFrom);

                        if (from > to || from === to) {
                            this.multiFormSecondError = true;
                        } else {
                            this.multiFormSecondError = false;
                        }
                    } else {
                        this.multiFormSecondError = false;
                    }
                }

                if (changes.multiFormThirdFrom || changes.multiFormThirdTo) {
                    if (changes.multiFormThirdTo) {
                        const to = parseInt(changes.multiFormThirdTo);
                        const from = parseInt(changes.multiFormThirdFrom);
                        if (from > to || from === to) {
                            this.multiFormThirdError = true;
                        } else {
                            this.multiFormThirdError = false;
                        }
                    } else {
                        this.multiFormThirdError = false;
                    }
                }

                if (this.subType != 'all') {
                    let toValueChanged = true;
                    let fromValueChanged = true;

                    const fromActive =
                        this.singleFromActive && this.singleFromActive != 'null'
                            ? this.singleFromActive
                            : 0;
                    const toActive =
                        this.singleToActive && this.singleToActive != 'null'
                            ? this.singleToActive
                            : 0;

                    let to = 0;
                    if (changes.singleTo) {
                        to = parseInt(changes.singleTo);
                    }

                    let from = 0;
                    if (changes.singleFrom) {
                        from = parseInt(changes.singleFrom);
                    }

                    if (toActive === to) {
                        toValueChanged = false;
                    }

                    if (fromActive === from) {
                        fromValueChanged = false;
                    }

                    if (toValueChanged || fromValueChanged) {
                        this.setButtonAvailable = true;
                        this.moneyFilterStatus = true;
                    } else {
                        this.setButtonAvailable = false;
                        if (!to && !from) {
                            this.moneyFilterStatus = false;
                        }
                    }
                } else {
                    if (
                        !this.multiFormFirstError &&
                        !this.multiFormSecondError &&
                        !this.multiFormThirdError
                    ) {
                        this.moneyFilterStatus = true;
                        this.checkMoneyMultiForm(changes);
                    } else {
                        this.setButtonAvailable = false;
                    }

                    if (
                        this.multiFormFirstError ||
                        this.multiFormSecondError ||
                        this.multiFormThirdError
                    ) {
                        this.setButtonAvailable = false;
                    }
                }

                if (this.singleFormError) {
                    this.moneyForm
                        .get('singleTo')
                        ?.setErrors({ invalid: true });
                } else {
                    this.moneyForm.get('singleTo')?.setErrors(null);
                }

                if (this.multiFormFirstError) {
                    this.moneyForm
                        .get('multiFromFirstTo')
                        ?.setErrors({ invalid: true });
                } else {
                    this.moneyForm.get('multiFromFirstTo')?.setErrors(null);
                }

                if (this.multiFormSecondError) {
                    this.moneyForm
                        .get('multiFormSecondTo')
                        ?.setErrors({ invalid: true });
                } else {
                    this.moneyForm.get('multiFormSecondTo')?.setErrors(null);
                }

                if (this.multiFormThirdError) {
                    this.moneyForm
                        .get('multiFormThirdTo')
                        ?.setErrors({ invalid: true });
                } else {
                    this.moneyForm.get('multiFormThirdTo')?.setErrors(null);
                }

                if (this.moneyFilterStatus) {
                }
            });
    }

    private watchSearchFormValueChanges(): void {
        this.searchForm.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((changes) => {
                if (changes.search) {
                    const inputValue = changes.search;
                    this.searchInputValue = inputValue;

                    if (this.type === 'userFilter') {
                        this.unselectedUser.map((item) => {
                            item.hidden = true;
                            if (
                                item.name
                                    .toLowerCase()
                                    .includes(inputValue.toLowerCase())
                            ) {
                                item.hidden = false;
                            }
                            return item;
                        });
                    } else if (this.type === 'statusFilter') {
                        this.pendingStatusArray.map((item) => {
                            item.hidden = true;
                            if (
                                item.name
                                    .toLowerCase()
                                    .includes(inputValue.toLowerCase())
                            ) {
                                item.hidden = false;
                            }
                            return item;
                        });

                        this.activeStatusArray.map((item) => {
                            item.hidden = true;
                            if (
                                item.name
                                    .toLowerCase()
                                    .includes(inputValue.toLowerCase())
                            ) {
                                item.hidden = false;
                            }
                            return item;
                        });

                        this.closedStatusArray.map((item) => {
                            item.hidden = true;
                            if (
                                item.name
                                    .toLowerCase()
                                    .includes(inputValue.toLowerCase())
                            ) {
                                item.hidden = false;
                            }
                            return item;
                        });
                    } else if (this.type === 'truckFilter') {
                        this.truckArray.map((item) => {
                            item.hidden = true;
                            if (
                                item.name
                                    .toLowerCase()
                                    .includes(inputValue.toLowerCase())
                            ) {
                                item.hidden = false;
                            }
                            return item;
                        });
                    } else if (this.type === 'fuelStopFilter') {
                        this.fuelStopArray.map((item) => {
                            item.hidden = true;
                            if (
                                item.name
                                    .toLowerCase()
                                    .includes(inputValue.toLowerCase())
                            ) {
                                item.hidden = false;
                            }
                            return item;
                        });
                    } else if (this.type === 'trailerFilter') {
                        this.trailerArray.map((item) => {
                            item.hidden = true;
                            if (
                                item.name
                                    .toLowerCase()
                                    .includes(inputValue.toLowerCase())
                            ) {
                                item.hidden = false;
                            }
                            return item;
                        });
                    } else if (this.type === 'brokerFilter') {
                        this.brokerArray.map((item) => {
                            item.hidden = true;
                            if (
                                item.name
                                    .toLowerCase()
                                    .includes(inputValue.toLowerCase())
                            ) {
                                item.hidden = false;
                            }
                            return item;
                        });
                    } else if (this.type === 'driverFilter') {
                        this.driverArray.map((item) => {
                            item.hidden = true;
                            if (
                                item.name
                                    .toLowerCase()
                                    .includes(inputValue.toLowerCase())
                            ) {
                                item.hidden = false;
                            }
                            return item;
                        });
                    } else if (this.type === 'stateFilter') {
                        this.usaStates.map((item) => {
                            item.hidden = true;
                            if (
                                item.name
                                    .toLowerCase()
                                    .includes(inputValue.toLowerCase())
                            ) {
                                item.hidden = false;
                            }
                            return item;
                        });

                        this.canadaStates.map((item) => {
                            item.hidden = true;
                            if (
                                item.name
                                    .toLowerCase()
                                    .includes(inputValue.toLowerCase())
                            ) {
                                item.hidden = false;
                            }
                            return item;
                        });
                    }
                } else {
                    if (this.type === 'userFilter') {
                        this.unselectedUser.map((item) => {
                            item.hidden = false;
                        });
                    } else if (this.type === 'statusFilter') {
                        this.pendingStatusArray.map((item) => {
                            item.hidden = false;
                        });

                        this.activeStatusArray.map((item) => {
                            item.hidden = false;
                        });

                        this.closedStatusArray.map((item) => {
                            item.hidden = false;
                        });
                    } else if (this.type === 'truckFilter') {
                        this.truckArray.map((item) => {
                            item.hidden = false;
                        });
                    } else if (this.type === 'trailerFilter') {
                        this.trailerArray.map((item) => {
                            item.hidden = false;
                        });
                    } else if (this.type === 'fuelStopFilter') {
                        this.fuelStopArray.map((item) => {
                            item.hidden = false;
                        });
                    } else if (this.type === 'brokerFilter') {
                        this.brokerArray.map((item) => {
                            item.hidden = false;
                        });
                    } else if (this.type === 'driverFilter') {
                        this.driverArray.map((item) => {
                            item.hidden = false;
                        });
                    } else if (this.type === 'stateFilter') {
                        this.usaStates.map((item) => {
                            item.hidden = false;
                        });

                        this.canadaStates.map((item) => {
                            item.hidden = false;
                        });
                    }

                    this.searchInputValue = '';
                }
            });
    }

    private watchTableServiceValueChanges(): void {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (this.type === 'truckTypeFilter') {
                    if (res?.animation === 'truck-type-update') {
                        const newData = res.data.map((type: any) => {
                            type['icon'] =
                                'assets/svg/common/trucks/' + type.logoName;
                            return type;
                        });

                        this.truckTypeArray = newData;
                    }
                } else if (this.type === 'trailerTypeFilter') {
                    if (res?.animation === 'trailer-type-update') {
                        const newData = res.data.map((type: any) => {
                            type['icon'] =
                                'assets/svg/common/trailers/' + type.logoName;
                            return type;
                        });
                        this.trailerTypeArray = newData;
                    }
                } else if (this.type === 'categoryRepairFilter') {
                    if (res?.animation === 'repair-category-update') {
                        const newData = res.data.map((type: any) => {
                            type['icon'] =
                                'assets/svg/common/category/' + type.logo;
                            return type;
                        });
                        this.categoryRepairArray = newData;
                    }
                } else if (this.type === 'categoryFuelFilter') {
                    if (res?.animation === 'fuel-category-update') {
                        this.categoryFuelArray = res.data;
                    }
                } else if (this.type === 'stateFilter') {
                    if (res?.animation === 'state-data-update') {
                        const usaArray = [];
                        const canadaArray = [];

                        res.data.map((state: any) => {
                            if (state.countryType.name == 'Canada') {
                                canadaArray.push(state);
                            } else {
                                usaArray.push(state);
                            }
                        });

                        this.usaStates = usaArray;
                        this.canadaStates = canadaArray;
                    }
                } else if (this.type === 'departmentFilter') {
                    if (res?.animation === 'department-data-update') {
                        this.departmentArray = res.data;
                    }
                } else if (
                    this.type === 'pmFilter' &&
                    this.pmSubtype === 'truck'
                ) {
                    if (res?.animation === 'pm-truck-data-update') {
                        if (res.data.pmTrucks?.length) {
                            const newData = res.data.pmTrucks.map(
                                (type: any) => {
                                    type['icon'] =
                                        'assets/svg/common/repair-pm/' +
                                        type.logoName;
                                    type['name'] = type.title;

                                    return type;
                                }
                            );

                            this.pmFilterArray = newData;
                        } else {
                            this.pmFilterArray = [];
                        }
                    }
                } else if (
                    this.type === 'pmFilter' &&
                    this.pmSubtype === 'trailer'
                ) {
                    if (res?.animation === 'pm-trailer-data-update') {
                        if (res.data.pmTrailer?.length) {
                            const newData = res.data.pmTrailer.map(
                                (type: any) => {
                                    type['icon'] =
                                        'assets/svg/common/repair-pm/' +
                                        type.logoName;
                                    type['name'] = type.title;

                                    return type;
                                }
                            );

                            this.pmFilterArray = newData;
                        } else {
                            this.pmFilterArray = [];
                        }
                    }
                } else if (this.type === 'userFilter') {
                    if (res?.animation === 'dispatch-data-update') {
                        const newData = res.data.pagination.data.map(
                            (type: any) => {
                                type['name'] = type.fullName;
                                return type;
                            }
                        );

                        this.unselectedUser = newData;
                    }
                } else if (this.type === 'truckFilter') {
                    if (res?.animation === 'truck-list-update') {
                        let newData;
                        if (this.repairFilter) {
                            newData = res.data.map((type: any) => {
                                type['name'] = type.truckNumber;
                                return type;
                            });
                        } else {
                            newData = res.data?.pagination?.data.map(
                                (type: any) => {
                                    type['name'] = type.truckNumber;
                                    return type;
                                }
                            );
                        }
                        this.truckArray = newData;
                    }
                } else if (this.type === 'trailerFilter') {
                    if (res?.animation === 'trailer-list-update') {
                        let newData;
                        if (this.repairFilter) {
                            newData = res.data.map((type: any) => {
                                type['name'] = type.trailerNumber;
                                return type;
                            });
                        } else {
                            newData = res.data?.pagination?.data.map(
                                (type: any) => {
                                    type['name'] = type.trailerNumber;
                                    return type;
                                }
                            );
                        }
                        this.trailerArray = newData;
                    }
                }
            });
    }

    public checkForType(): void {
        switch (this.type) {
            case 'truckTypeFilter':
                this.getBackendData(this.type);
                break;

            case 'trailerTypeFilter':
                this.getBackendData(this.type);
                break;

            case 'categoryRepairFilter':
                this.getBackendData(this.type);
                break;

            case 'categoryFuelFilter':
                this.getBackendData(this.type);
                break;

            case 'stateFilter':
                this.getBackendData(this.type);
                break;

            case 'departmentFilter':
                this.getBackendData(this.type);
                break;

            case 'userFilter':
                this.getBackendData(this.type);
                break;

            case 'pmFilter':
                this.getBackendData(this.type, this.pmSubtype);
                break;

            case 'truckFilter':
                this.getBackendData(this.type);
                break;

            case 'trailerFilter':
                this.getBackendData(this.type);
                break;
        }
    }

    public addToSelectedUser(item, indx, subType?): void {
        let mainArray: any[] = [];
        if (this.type === 'departmentFilter') {
            mainArray = this.departmentArray;
        } else if (this.type === 'statusFilter') {
            if (subType === 'pending') {
                mainArray = this.pendingStatusArray;
            } else if (subType === 'active') {
                mainArray = this.activeStatusArray;
            } else {
                mainArray = this.closedStatusArray;
            }
        } else if (this.type === 'pmFilter') {
            mainArray = this.pmFilterArray;
        } else if (this.type === 'categoryFuelFilter') {
            mainArray = this.categoryFuelArray;
        } else if (this.type === 'categoryRepairFilter') {
            mainArray = this.categoryRepairArray;
        } else if (this.type === 'truckFilter') {
            mainArray = this.truckArray;
        } else if (this.type === 'trailerFilter') {
            mainArray = this.trailerArray;
        } else if (this.type === 'fuelStopFilter') {
            mainArray = this.fuelStopArray;
        } else if (this.type === 'brokerFilter') {
            mainArray = this.brokerArray;
        } else if (this.type === 'driverFilter') {
            mainArray = this.driverArray;
        } else if (this.type === 'truckTypeFilter') {
            mainArray = this.truckTypeArray;
        } else if (this.type === 'userFilter') {
            mainArray = this.unselectedUser;
        } else if (this.type === 'trailerTypeFilter') {
            mainArray = this.trailerTypeArray;
        } else if (this.type === 'stateFilter') {
            if (subType === 'canada') {
                mainArray = this.canadaStates;
            } else {
                mainArray = this.usaStates;
            }
        } else if (this.type === 'labelFilter') {
            mainArray = this.labelArray;
        }

        mainArray[indx].isSelected = true;

        if (this.type === 'stateFilter') {
            if (subType === 'canada') {
                this.canadaSelectedStates.push(item);
            } else {
                this.usaSelectedStates.push(item);
            }
        } else {
            this.selectedUser.push(item);
        }
        this.checkFilterActiveValue();
    }

    public removeFromSelectedUser(item, indx, subType?): void {
        this.selectedUser.splice(indx, 1);

        if (this.type === 'stateFilter') {
            if (subType === 'canada') {
                this.canadaSelectedStates.splice(indx, 1);
            } else {
                this.usaSelectedStates.splice(indx, 1);
            }
        }

        const id = item.id;

        if (this.type === 'departmentFilter') {
            this.departmentArray.map((item) => {
                if (item.id === id) {
                    item.isSelected = false;
                }
            });
        } else if (this.type === 'statusFilter') {
            const checkActiveStatusArray = this.activeStatusArray.indexOf(item);
            const checkPendingStatusArray =
                this.pendingStatusArray.indexOf(item);

            let mainArray: any[] = [];

            if (checkActiveStatusArray > -1) {
                mainArray = this.activeStatusArray;
            } else if (checkPendingStatusArray > -1) {
                mainArray = this.pendingStatusArray;
            } else {
                mainArray = this.closedStatusArray;
            }

            mainArray.map((item) => {
                if (item.id === id) {
                    item.isSelected = false;
                }
            });
        } else if (this.type === 'pmFilter') {
            this.pmFilterArray.map((item) => {
                if (item.id === id) {
                    item.isSelected = false;
                }
            });
        } else if (this.type === 'categoryFuelFilter') {
            this.categoryFuelArray.map((item) => {
                if (item.id === id) {
                    item.isSelected = false;
                }
            });
        } else if (this.type === 'categoryRepairFilter') {
            this.categoryRepairArray.map((item) => {
                if (item.id === id) {
                    item.isSelected = false;
                }
            });
        } else if (this.type === 'truckFilter') {
            if (this.repairFilter) {
                this.truckArray.map((truck) => {
                    if (truck.truckNumber === item.truckNumber) {
                        truck.isSelected = false;
                    }
                });
            } else {
                this.truckArray.map((item) => {
                    if (item.id === id) {
                        item.isSelected = false;
                    }
                });
            }
        } else if (this.type === 'trailerFilter') {
            if (this.repairFilter) {
                this.trailerArray.map((trailer) => {
                    if (trailer.trailerNumber === item.trailerNumber) {
                        trailer.isSelected = false;
                    }
                });
            } else {
                this.trailerArray.map((item) => {
                    if (item.id === id) {
                        item.isSelected = false;
                    }
                });
            }
        } else if (this.type === 'fuelStopFilter') {
            this.fuelStopArray.map((item) => {
                if (item.id === id) {
                    item.isSelected = false;
                }
            });
        } else if (this.type === 'brokerFilter') {
            this.brokerArray.map((item) => {
                if (item.id === id) {
                    item.isSelected = false;
                }
            });
        } else if (this.type === 'driverFilter') {
            this.driverArray.map((item) => {
                if (item.id === id) {
                    item.isSelected = false;
                }
            });
        } else if (this.type === 'truckTypeFilter') {
            this.truckTypeArray.map((item) => {
                if (item.id === id) {
                    item.isSelected = false;
                }
            });
        } else if (this.type === 'trailerTypeFilter') {
            this.trailerTypeArray.map((item) => {
                if (item.id === id) {
                    item.isSelected = false;
                }
            });
        } else if (this.type === 'userFilter') {
            this.unselectedUser.map((item) => {
                if (item.id === id) {
                    item.isSelected = false;
                }
            });
        } else if (this.type === 'stateFilter') {
            if (subType === 'canada') {
                this.canadaStates.map((item) => {
                    if (item.id === id) {
                        item.isSelected = false;
                    }
                });
            } else {
                this.usaStates.map((item) => {
                    if (item.id === id) {
                        item.isSelected = false;
                    }
                });
            }
        } else if (this.type === 'labelFilter') {
            this.labelArray.map((item) => {
                if (item.id === id) {
                    item.isSelected = false;
                }
            });
        }
        this.checkFilterActiveValue();
    }

    public clearAll(event?, mod?): void {
        if (event) event.stopPropagation();

        if (mod) this.hoverClose = false;

        const element = event.target;
        if (!element.classList.contains('active') && !mod) false;

        if (this.type === 'timeFilter') {
            this.selectedTimeValue = '';
            this.filterActiveTime = '';
        } else {
            this.unselectedUser = [
                ...this.unselectedUser,
                ...this.selectedUser,
            ];
            this.selectedUser = [];
            this.usaSelectedStates = [];
            this.canadaSelectedStates = [];

            switch (this.type) {
                case 'departmentFilter':
                    this.departmentArray.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });
                    break;
                case 'statusFilter':
                    this.pendingStatusArray.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });

                    this.activeStatusArray.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });

                    this.closedStatusArray.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });
                    break;
                case 'pmFilter':
                    this.pmFilterArray.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });
                    break;
                case 'categoryFuelFilter':
                    this.categoryFuelArray.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });
                    break;
                case 'categoryRepairFilter':
                    this.categoryRepairArray.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });
                    break;
                case 'truckFilter':
                    this.truckArray.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });
                    break;
                case 'trailerFilter':
                    this.trailerArray.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });
                    break;
                case 'brokerFilter':
                    this.brokerArray.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });
                    break;
                case 'driverFilter':
                    this.driverArray.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });
                    break;
                case 'truckTypeFilter':
                    this.truckTypeArray.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });
                    break;
                case 'userFilter':
                    this.unselectedUser.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });
                    break;
                case 'stateFilter':
                    this.usaStates.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });

                    this.canadaStates.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });
                    break;
                case 'injuryFilter':
                case 'fatalityFilter':
                case 'violationFilter':
                    this.rangeValue = 0;
                    break;
                case 'locationFilter':
                    this.locationForm.setValue({
                        address: '',
                    });
                    this.areaForm.setValue({
                        origin: '',
                        destination: '',
                    });
                    this.locationRange = 25;
                    this.locationState = '';
                    this.longVal = 0;
                    this.latVal = 0;
                    this.originLongVal = 0;
                    this.originLatVal = 0;
                    this.destLongVal = 0;
                    this.destLatVal = 0;
                    this.loactionNameSet = '';

                    this.longValueSet = this.longVal;
                    this.latValSet = this.latVal;
                    this.originLongValSet = this.originLongVal;
                    this.originLatValSet = this.originLatVal;
                    this.destLatValSet = this.destLongVal;
                    this.destLongValSet = this.destLongVal;
                    this.locationRangeSet = this.locationRange;
                    break;
                case 'moneyFilter':
                    if (!this.repairFilter) {
                        if (this.subType != 'all') {
                            this.clearForm('singleForm');
                        } else {
                            this.clearForm('clearAll');
                        }
                    } else {
                        const maxNum = this.thousandSeparator.transform(
                            this.maxValueRange
                        );
                        this.rangeForm.get('rangeFrom')?.setValue(0);
                        this.rangeForm.get('rangeTo')?.setValue(maxNum);

                        this.maxValueSet = maxNum;
                        this.minValueSet = this.minValueRange;
                    }
                    this.activeFormNum = 0;
                    break;
                case 'milesFilter':
                case 'payFilter' ||
                    (this.type === 'moneyFilter' && this.repairFilter):
                    const maxNum = this.thousandSeparator.transform(
                        this.maxValueRange
                    );
                    this.rangeForm.get('rangeFrom')?.setValue('0');
                    this.rangeForm.get('rangeTo')?.setValue(maxNum);

                    this.maxValueSet = maxNum;
                    this.minValueSet = this.minValueRange;
                    break;
            }
        }

        this.setButtonAvailable = true;
        this.moneyFilterStatus = false;
        this.filterActiveArray = [];
        this.swipeActiveRange = 0;
        this.autoClose.tooltip.close();
        this.totalFiltersNum = 0;
        this.singleFormActive = false;
        const data = {
            action: 'Clear',
            type: this.type,
            filterType: this.type,
        };

        if (this.setFilter) {
            this.setFilter.emit(data);
        }
    }

    public filterUser(event: any): void {
        const inputValue = event.target.value;
        this.unselectedUser.filter((item) => {
            item.hidden = true;
            if (item.name.toLowerCase().includes(inputValue.toLowerCase())) {
                item.hidden = false;
            }
            return item;
        });
    }

    public setTimeValue(mod): void {
        if (this.selectedTimeValue === mod) {
            this.selectedTimeValue = '';
        } else {
            this.selectedTimeValue = mod;
        }

        if (this.filterActiveTime === mod) {
            this.setButtonAvailable = false;
        } else {
            this.setButtonAvailable = true;
        }
    }

    public removeTimeValue(event): void {
        event.stopPropagation();
        this.selectedTimeValue = '';
    }

    public showSearch(mod?): void {
        const filterSearchHead = document.querySelector('.search-input-header');
        const filterTextHead = document.querySelector('.filter-text-part');

        if (mod) {
            this.expandSearch = false;
            filterSearchHead?.classList.remove('activeSearch');
            filterSearchHead?.classList.add('inactiveSearch');

            filterTextHead?.classList.add('activeHeader');
            filterTextHead?.classList.remove('inactiveHeader');
        } else {
            filterSearchHead?.classList.add('activeSearch');
            filterSearchHead?.classList.remove('inactiveSearch');

            filterTextHead?.classList.remove('activeHeader');
            filterTextHead?.classList.add('inactiveHeader');
            this.expandSearch = true;
        }
    }

    public hideFormPart(mod): void {
        if (mod === 'part1') {
            this.showPart1 = !this.showPart1;
        } else if (mod === 'part2') {
            this.showPart2 = !this.showPart2;
        } else {
            this.showPart3 = !this.showPart3;
        }
    }

    public setRangeValue(mod): void {
        if (this.type != 'locationFilter') {
            this.rangeValue = mod;
        } else {
            this.locationRange = mod;
        }
    }

    public handleInputSelect(event): void {
        if (event?.address?.address) {
            this.locationState = event.address.address;
        }

        if (event?.longLat) {
            this.longVal = event?.longLat?.longitude;
            this.latVal = event?.longLat?.latitude;
        }
    }

    public handleOriginSelect(event): void {
        if (event?.address?.address) this.originState = event.address.address;

        if (event?.longLat && event?.longLat?.latitude) {
            this.originLongVal = event?.longLat?.longitude;
            this.originLatVal = event?.longLat?.latitude;
        }
    }

    public handleDestinationSelect(event): void {
        if (event?.address?.address)
            this.destinationState = event.address.address;

        if (event?.longLat && event?.longLat?.latitude) {
            this.destLongVal = event?.longLat?.longitude;
            this.destLatVal = event?.longLat?.latitude;
        }
    }

    public clearForm(mod): void {
        switch (mod) {
            case 'singleForm':
                this.moneyForm.get('singleFrom')?.setValue('');
                this.moneyForm.get('singleTo')?.setValue('');
                this.singleFormError = false;
                this.moneyFilterStatus = false;
                this.singleToActive = 0;
                this.singleFromActive = 0;
                this.setButtonAvailable = false;
                break;
            case 'multiFromFirst':
                this.moneyForm.get('multiFromFirstFrom')?.setValue('');
                this.moneyForm.get('multiFromFirstTo')?.setValue('');
                this.multiFormFirstError = false;
                break;
            case 'multiFormSecond':
                this.moneyForm.get('multiFormSecondFrom')?.setValue('');
                this.moneyForm.get('multiFormSecondTo')?.setValue('');
                this.multiFormSecondError = false;
                break;
            case 'multiFormThird':
                this.moneyForm.get('multiFormThirdFrom')?.setValue('');
                this.moneyForm.get('multiFormThirdTo')?.setValue('');
                this.multiFormThirdError = false;
                break;
            case 'clearAll':
                this.multiFromFirstFromActive = 0;
                this.multiFromFirstToActive = 0;
                this.multiFormSecondFromActive = 0;
                this.multiFormSecondToActive = 0;
                this.multiFormThirdFromActive = 0;
                this.multiFormThirdToActive = 0;
                this.moneyForm.reset();
                this.multiFormFirstError = false;
                this.multiFormSecondError = false;
                this.multiFormThirdError = false;
                break;
        }
    }

    public setFilterValue(event): boolean {
        const element = event.target;
        if (element.classList.contains('active')) {
            let queryParams = {};
            let subType = '';

            this.setButtonAvailable = false;

            if (this.type === 'timeFilter') {
                this.filterActiveTime = this.selectedTimeValue;

                if (!this.selectedTimeValue) {
                    this.clearAll(event);
                    return false;
                }

                queryParams = {
                    timeSelected: this.filterActiveTime,
                };
            } else if (this.swipeFilter) {
                this.swipeActiveRange = this.rangeValue;
            } else if (this.type === 'stateFilter') {
                this.filterUsaActiveArray = [...this.usaSelectedStates];
                this.filterCanadaActiveArray = [...this.canadaSelectedStates];

                const totalStatesSelected =
                    this.filterUsaActiveArray.length +
                    this.filterCanadaActiveArray.length;
                this.totalFiltersNum = totalStatesSelected;

                queryParams = {
                    usaArray: this.filterUsaActiveArray,
                    canadaArray: this.filterCanadaActiveArray,
                };
            } else if (this.type === 'moneyFilter' && !this.repairFilter) {
                if (this.subType === 'all') {
                    this.multiFromFirstFromActive = (
                        ' ' + this.moneyForm.get('multiFromFirstFrom')?.value
                    ).slice(1);
                    this.multiFromFirstToActive = (
                        ' ' + this.moneyForm.get('multiFromFirstTo')?.value
                    ).slice(1);
                    this.multiFormSecondFromActive = (
                        ' ' + this.moneyForm.get('multiFormSecondFrom')?.value
                    ).slice(1);
                    this.multiFormSecondToActive = (
                        ' ' + this.moneyForm.get('multiFormSecondTo')?.value
                    ).slice(1);
                    this.multiFormThirdFromActive = (
                        ' ' + this.moneyForm.get('multiFormThirdFrom')?.value
                    ).slice(1);
                    this.multiFormThirdToActive = (
                        ' ' + this.moneyForm.get('multiFormThirdTo')?.value
                    ).slice(1);

                    queryParams = {
                        firstFormFrom:
                            this.moneyForm.get('multiFromFirstFrom')?.value,
                        firstFormFTo:
                            this.moneyForm.get('multiFromFirstTo')?.value,
                        secondFormFrom: this.moneyForm.get(
                            'multiFormSecondFrom'
                        )?.value,
                        secondFormTo:
                            this.moneyForm.get('multiFormSecondTo')?.value,
                        thirdFormFrom:
                            this.moneyForm.get('multiFormThirdFrom')?.value,
                        thirdFormTo:
                            this.moneyForm.get('multiFormThirdTo')?.value,
                    };

                    let formsActive = 0;

                    if (
                        this.moneyForm.get('multiFromFirstFrom')?.value ||
                        this.moneyForm.get('multiFromFirstTo')?.value
                    ) {
                        formsActive = formsActive + 1;
                    }

                    if (
                        this.moneyForm.get('multiFormSecondFrom')?.value ||
                        this.moneyForm.get('multiFormSecondTo')?.value
                    ) {
                        formsActive = formsActive + 1;
                    }

                    if (
                        this.moneyForm.get('multiFormThirdFrom')?.value ||
                        this.moneyForm.get('multiFormThirdTo')?.value
                    ) {
                        formsActive = formsActive + 1;
                    }

                    this.activeFormNum = formsActive;
                    this.totalFiltersNum = formsActive;
                } else {
                    this.singleFromActive = (
                        ' ' + this.moneyForm.get('singleFrom')?.value
                    ).slice(1);
                    this.singleToActive = (
                        ' ' + this.moneyForm.get('singleTo')?.value
                    ).slice(1);

                    if (
                        !this.moneyForm.get('singleFrom')?.value &&
                        !this.moneyForm.get('singleTo')?.value
                    ) {
                        this.clearAll(event);
                        return false;
                    }

                    this.singleFormActive = true;
                    queryParams = {
                        singleFrom: this.moneyForm.get('singleFrom')?.value
                            ? parseInt(this.moneyForm.get('singleFrom')?.value)
                            : '',
                        singleTo: this.moneyForm.get('singleTo')?.value
                            ? parseInt(this.moneyForm.get('singleTo')?.value)
                            : '',
                    };
                }
            } else if (
                this.type === 'milesFilter' ||
                this.type === 'payFilter' ||
                (this.type === 'moneyFilter' && this.repairFilter)
            ) {
                this.maxValueSet = this.rangeForm.get('rangeTo')?.value;
                this.minValueSet = this.rangeForm.get('rangeFrom')?.value;

                this.singleFormActive = true;
                queryParams = {
                    singleTo: parseInt(
                        this.rangeForm.get('rangeTo')?.value.replace(',', '')
                    ),
                    singleFrom: parseInt(
                        this.rangeForm.get('rangeFrom')?.value.replace(',', '')
                    ),
                };
            } else if (this.type === 'locationFilter') {
                if (this.areaFilterSelected != 'Location') {
                    queryParams = {
                        originLatValue: this.originLatVal,
                        originLongValue: this.originLongVal,
                        destinationLatValue: this.destLatVal,
                        destinationLongValue: this.destLongVal,
                    };

                    this.originLatValSet = this.originLatVal;
                    this.originLongValSet = this.originLongVal;
                    this.destLongValSet = this.destLongVal;
                    this.destLatValSet = this.destLatVal;
                } else {
                    queryParams = {
                        longValue: this.longVal,
                        latValue: this.latVal,
                        rangeValue: this.locationRange,
                    };

                    this.longValueSet = this.longVal;
                    this.latValSet = this.latVal;
                    this.locationRangeSet = this.locationRange;
                    this.loactionNameSet =
                        this.locationForm.get('address')?.value;
                }
            } else {
                this.filterActiveArray = [...this.selectedUser];
                const selectedUsersIdArray: any = [];
                this.totalFiltersNum = this.filterActiveArray.length;

                let mainArray: any[] = [];
                switch (this.type) {
                    case 'departmentFilter':
                        mainArray = this.departmentArray;
                        break;
                    case 'pmFilter':
                        mainArray = this.pmFilterArray;
                        break;
                    case 'categoryFuelFilter':
                        mainArray = this.categoryFuelArray;
                        break;
                    case 'categoryRepairFilter':
                        mainArray = this.categoryRepairArray;
                        break;
                    case 'truckFilter':
                        mainArray = this.truckArray;
                        break;
                    case 'trailerFilter':
                        mainArray = this.trailerArray;
                        break;
                    case 'brokerFilter':
                        mainArray = this.brokerArray;
                        break;
                    case 'driverFilter':
                        mainArray = this.driverArray;
                        break;
                    case 'truckTypeFilter':
                        mainArray = this.truckTypeArray;
                        break;
                    case 'trailerTypeFilter':
                        mainArray = this.trailerTypeArray;
                        break;
                    case 'userFilter':
                        mainArray = this.unselectedUser;
                        break;
                }

                mainArray.map((item) => {
                    if (item.isSelected) {
                        item['currentSet'] = true;
                    } else {
                        item['currentSet'] = false;
                    }
                });

                if (this.type === 'pmFilter' || this.repairFilter) {
                    this.filterActiveArray.map((data) => {
                        selectedUsersIdArray.push(data.name);
                    });
                } else {
                    this.filterActiveArray.map((data) => {
                        selectedUsersIdArray.push(data.id);
                    });
                }

                if (selectedUsersIdArray.length === 0) {
                    this.clearAll(event);
                    return false;
                }

                queryParams = selectedUsersIdArray;
                subType = this.toDoSubType ? this.toDoSubType : '';
            }

            const data = {
                filterType: this.type,
                action: 'Set',
                queryParams: queryParams,
                subType: subType,
            };

            if (this.setFilter) {
                this.setFilter.emit(data);
            }
            this.autoClose.tooltip.close();
        } else {
            return false;
        }
    }

    public checkFilterActiveValue(): void {
        if (this.type === 'stateFilter') {
            let usaArrayChanged = false;
            let canadaArrayChanged = false;

            let arrayUsaSelected = [...this.usaSelectedStates];
            let arrayUsaActive = [...this.filterUsaActiveArray];
            let arrayCanadaSelected = [...this.canadaSelectedStates];
            let arrayCanadaActive = [...this.filterCanadaActiveArray];

            arrayUsaSelected.sort((a, b) => {
                return a.id - b.id;
            });

            arrayUsaActive.sort((a, b) => {
                return a.id - b.id;
            });

            arrayCanadaSelected.sort((a, b) => {
                return a.id - b.id;
            });

            arrayCanadaActive.sort((a, b) => {
                return a.id - b.id;
            });

            const usaStringfy = JSON.stringify(arrayUsaSelected);
            const usaActiveStringify = JSON.stringify(arrayUsaActive);
            const canadaStringfy = JSON.stringify(arrayCanadaSelected);
            const canadaActiveStringify = JSON.stringify(arrayCanadaActive);

            if (usaStringfy === usaActiveStringify) {
                usaArrayChanged = false;
            } else {
                usaArrayChanged = true;
            }

            if (canadaStringfy === canadaActiveStringify) {
                canadaArrayChanged = false;
            } else {
                canadaArrayChanged = true;
            }

            if (usaArrayChanged || canadaArrayChanged) {
                this.setButtonAvailable = true;
            } else {
                this.setButtonAvailable = false;
            }
        } else {
            const array1 = [...this.selectedUser];
            const array2 = [...this.filterActiveArray];

            array1.sort((a, b) => {
                return a.id - b.id;
            });

            array2.sort((a, b) => {
                return a.id - b.id;
            });

            const stringfy1 = JSON.stringify(array1);
            const stringfy2 = JSON.stringify(array2);

            if (stringfy1 === stringfy2) {
                this.setButtonAvailable = false;
            } else {
                this.setButtonAvailable = true;
            }
        }
    }

    public checkMoneyMultiForm(data): void {
        let firstFormChanged = 'none';
        let secondFormChanged = 'none';
        let thirdFormChanged = 'none';

        const firstFromActive =
            this.multiFromFirstFromActive &&
            this.multiFromFirstFromActive != 'null'
                ? this.multiFromFirstFromActive
                : 0;
        const firstToActive =
            this.multiFromFirstToActive && this.multiFromFirstToActive != 'null'
                ? this.multiFromFirstToActive
                : 0;

        const secFromActive =
            this.multiFormSecondFromActive &&
            this.multiFormSecondFromActive != 'null'
                ? this.multiFormSecondFromActive
                : 0;
        const secToActive =
            this.multiFormSecondToActive &&
            this.multiFormSecondToActive != 'null'
                ? this.multiFormSecondToActive
                : 0;

        const thirdFromActive =
            this.multiFormThirdFromActive &&
            this.multiFormThirdFromActive != 'null'
                ? this.multiFormThirdFromActive
                : 0;
        const thirdToActive =
            this.multiFormThirdToActive && this.multiFormThirdToActive != 'null'
                ? this.multiFormThirdToActive
                : 0;

        const firstFrom =
            data.multiFromFirstFrom && data.multiFromFirstFrom != 'null'
                ? parseInt(data.multiFromFirstFrom)
                : 0;
        const firstTo =
            data.multiFromFirstTo && data.multiFromFirstTo != 'null'
                ? parseInt(data.multiFromFirstTo)
                : 0;

        const secFrom =
            data.multiFormSecondFrom && data.multiFormSecondFrom != 'null'
                ? parseInt(data.multiFormSecondFrom)
                : 0;
        const secTo =
            data.multiFormSecondTo && data.multiFormSecondTo != 'null'
                ? parseInt(data.multiFormSecondTo)
                : 0;

        const thirdFrom =
            data.multiFormThirdFrom && data.multiFormThirdFrom != 'null'
                ? parseInt(data.multiFormThirdFrom)
                : 0;
        const thirdTo =
            data.multiFormThirdTo && data.multiFormThirdTo != 'null'
                ? parseInt(data.multiFormThirdTo)
                : 0;

        if (firstFrom != firstFromActive || firstTo != firstToActive) {
            firstFormChanged = 'changed';
        }

        if (secFrom != secFromActive || secTo != secToActive) {
            secondFormChanged = 'changed';
        }

        if (thirdFrom != thirdFromActive || thirdTo != thirdToActive) {
            thirdFormChanged = 'changed';
        }

        if (
            firstFormChanged === 'changed' ||
            secondFormChanged === 'changed' ||
            thirdFormChanged === 'changed'
        ) {
            this.setButtonAvailable = true;
        } else {
            this.setButtonAvailable = false;
            if (
                firstFrom ||
                firstTo ||
                secFrom ||
                secTo ||
                thirdFrom ||
                thirdTo
            ) {
                this.moneyFilterStatus = true;
            } else {
                this.moneyFilterStatus = false;
            }
        }
    }

    public setRangeSliderValue(mod): void {
        const fromValue = this.thousandSeparator.transform(mod.value);
        const toValue = this.thousandSeparator.transform(mod.highValue);
        this.rangeForm?.get('rangeFrom')?.setValue(fromValue);
        this.rangeForm?.get('rangeTo')?.setValue(toValue);
    }

    public setMinValueRange(mod): void {
        const fromValue = this.thousandSeparator.transform(mod);
        this.rangeForm?.get('rangeFrom')?.setValue(fromValue);
    }

    public setMaxValueRange(mod): void {
        const toValue = this.thousandSeparator.transform(mod);
        this.rangeForm?.get('rangeTo')?.setValue(toValue);
    }

    public onFilterClose(): void {
        if (!this.activeFilter) false;
        this.activeFilter = false;

        let mainElementHolder;

        if (this.type === 'timeFilter') {
            mainElementHolder = document.querySelector('.time-filter-holder');
        } else {
            mainElementHolder = document.querySelector('.filter-holder');
        }

        mainElementHolder?.classList.add('closeFilterAnimation');
        if (this.defFilterHolder && this.type != 'stateFilter') {
            let mainArray: any[] = [];
            switch (this.type) {
                case 'departmentFilter':
                    mainArray = this.departmentArray;
                    break;
                case 'pmFilter':
                    mainArray = this.pmFilterArray;
                    break;
                case 'categoryFuelFilter':
                    mainArray = this.categoryFuelArray;
                    break;
                case 'categoryRepairFilter':
                    mainArray = this.categoryRepairArray;
                    break;
                case 'truckFilter':
                    mainArray = this.truckArray;
                    break;
                case 'trailerFilter':
                    mainArray = this.trailerArray;
                    break;
                case 'brokerFilter':
                    mainArray = this.brokerArray;
                    break;
                case 'driverFilter':
                    mainArray = this.driverArray;
                    break;
                case 'truckTypeFilter':
                    mainArray = this.truckTypeArray;
                    break;
                case 'trailerTypeFilter':
                    mainArray = this.trailerTypeArray;
                    break;
                case 'userFilter':
                    mainArray = this.unselectedUser;
                    break;
            }

            mainArray.map((item) => {
                if (
                    (item.isSelected && !item.currentSet) ||
                    (!item.isSelected && item.currentSet)
                ) {
                    const indexNum = this.selectedUser.indexOf(item);
                    if (indexNum > -1) {
                        this.removeFromSelectedUser(item, indexNum);
                    } else {
                        const inactiveIndexNum = mainArray.indexOf(item);
                        this.addToSelectedUser(item, inactiveIndexNum);
                    }
                }
            });
        } else if (this.type === 'timeFilter') {
            this.selectedTimeValue = this.filterActiveTime;
        } else if (this.type === 'moneyFilter' && !this.repairFilter) {
            if (this.subType != 'all') {
                const setFromValue =
                    this.singleFromActive != 'null' && this.singleFromActive
                        ? this.singleFromActive
                        : '';
                this.moneyForm.get('singleFrom')?.setValue(setFromValue);

                const setToValue =
                    this.singleToActive != 'null' && this.singleToActive
                        ? this.singleToActive
                        : '';
                this.moneyForm.get('singleTo')?.setValue(setToValue);
                if (!setFromValue) {
                    this.setButtonAvailable = false;
                }
            } else {
                const firstFromActive =
                    this.multiFromFirstFromActive &&
                    this.multiFromFirstFromActive != 'null'
                        ? this.multiFromFirstFromActive
                        : '';
                const firstToActive =
                    this.multiFromFirstToActive &&
                    this.multiFromFirstToActive != 'null'
                        ? this.multiFromFirstToActive
                        : '';

                this.moneyForm.get('multiFromFirstTo')?.setValue(firstToActive);
                this.moneyForm
                    .get('multiFromFirstFrom')
                    ?.setValue(firstFromActive);

                const secFromActive =
                    this.multiFormSecondFromActive &&
                    this.multiFormSecondFromActive != 'null'
                        ? this.multiFormSecondFromActive
                        : '';
                const secToActive =
                    this.multiFormSecondToActive &&
                    this.multiFormSecondToActive != 'null'
                        ? this.multiFormSecondToActive
                        : '';

                this.moneyForm
                    .get('multiFormSecondFrom')
                    ?.setValue(secFromActive);
                this.moneyForm.get('multiFormSecondTo')?.setValue(secToActive);

                const thirdFromActive =
                    this.multiFormThirdFromActive &&
                    this.multiFormThirdFromActive != 'null'
                        ? this.multiFormThirdFromActive
                        : '';
                const thirdToActive =
                    this.multiFormThirdToActive &&
                    this.multiFormThirdToActive != 'null'
                        ? this.multiFormThirdToActive
                        : '';

                this.moneyForm
                    .get('multiFormThirdFrom')
                    ?.setValue(thirdFromActive);
                this.moneyForm.get('multiFormThirdTo')?.setValue(thirdToActive);
            }
        } else if (this.type === 'locationFilter') {
            this.locationForm.setValue({ address: this.loactionNameSet });
            this.longVal = this.longValueSet;
            this.latVal = this.latValSet;
            this.locationRange = this.locationRangeSet;
        } else if (this.type === 'stateFilter') {
            this.usaSelectedStates = [...this.filterUsaActiveArray];
            this.canadaSelectedStates = [...this.filterCanadaActiveArray];
            this.setButtonAvailable = false;
        } else if (this.swipeFilter) {
            this.rangeValue = this.swipeActiveRange;
        }
    }

    public onFilterShown(): void {
        this.activeFilter = true;
        this.isAnimated = true;
        const filterSearchHead = document.querySelector('.search-input-header');
        const filterTextHead = document.querySelector('.filter-text-part');
        filterSearchHead?.classList.remove('activeSearch');
        filterSearchHead?.classList.remove('inactiveSearch');

        filterTextHead?.classList.remove('activeHeader');
        filterTextHead?.classList.remove('inactiveHeader');
    }

    public onTabChange(event: any): void {
        this.sideAnimation = true;
        this.areaFilterSelected = event.name;
    }

    public getBackendData(type: any, subType?: string): void {
        switch (this.type) {
            case 'truckTypeFilter': {
                this.filterService.getTruckType();
                break;
            }
            case 'trailerTypeFilter': {
                this.filterService.getTrailerType();
                break;
            }
            case 'categoryRepairFilter': {
                this.filterService.getRepairCategory();
                break;
            }
            case 'categoryFuelFilter': {
                this.filterService.getFuelCategory();
                break;
            }
            case 'stateFilter': {
                this.filterService.getStateData();
            }
            case 'departmentFilter': {
                this.filterService.getDepartmentData();
                break;
            }
            case 'userFilter': {
                this.filterService.getDispatchData();
                break;
            }
            case 'truckFilter': {
                if (this.repairFilter) {
                    this.filterService.getRepairTruckData();
                    this.filterService.getPmData('truck');
                } else {
                    this.filterService.getTruckData();
                }
                break;
            }
            case 'trailerFilter': {
                if (this.repairFilter) {
                    this.filterService.getRepairTrailerData();
                    this.filterService.getPmData('trailer');
                } else {
                    this.filterService.getTrailerData();
                }
                break;
            }
            case 'pmFilter': {
                this.filterService.getPmData(subType);
                break;
            }
        }
    }
    sortItems() {
        switch (this.type) {
            case 'categoryRepairFilter': {
                this.categoryRepairArray.sort((a, b) => {
                    if (this.ascendingOrderCategoryRepair) {
                        return a.name.localeCompare(b.name);
                    } else {
                        return b.name.localeCompare(a.name);
                    }
                });
                this.ascendingOrderCategoryRepair =
                    !this.ascendingOrderCategoryRepair;
                break;
            }
            case 'truckFilter': {
                this.truckArray.sort((a, b) =>
                    this.sortComparison(
                        a.count,
                        b.count,
                        this.ascendingOrderTruck
                    )
                );
                this.ascendingOrderTruck = !this.ascendingOrderTruck;
                break;
            }
            case 'trailerFilter': {
                this.trailerArray.sort((a, b) =>
                    this.sortComparison(
                        a.count,
                        b.count,
                        this.ascendingOrderTrailer
                    )
                );
                this.ascendingOrderTrailer = !this.ascendingOrderTrailer;
                break;
            }
            case 'pmFilter': {
                this.pmFilterArray.sort((a, b) => {
                    if (this.ascendingOrderPm) {
                        return a.name.localeCompare(b.name);
                    } else {
                        return b.name.localeCompare(a.name);
                    }
                });
                this.ascendingOrderPm = !this.ascendingOrderPm;
                break;
            }
        }
        return this.getSortOrder();
    }
    sortComparison(a: number, b: number, ascending: boolean): number {
        return ascending ? a - b : b - a;
    }
    getSortOrder(): boolean {
        switch (this.type) {
            case 'categoryRepairFilter':
                return this.ascendingOrderCategoryRepair;
            case 'truckFilter':
                return this.ascendingOrderTruck;
            case 'trailerFilter':
                return this.ascendingOrderTrailer;
            case 'pmFilter':
                return this.ascendingOrderPm;
            default:
                return false;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
