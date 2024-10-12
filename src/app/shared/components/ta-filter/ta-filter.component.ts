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
import { FilterTrailerColorPipe } from '@shared/components/ta-filter//pipes/filter-trailer-color.pipe';
import { FilterLoadStatusPipe } from '@shared/components/ta-filter/pipes/filter-load-status-color.pipe';
import { DropdownLoadStatusColorPipe } from '@shared/pipes/dropdown-load-status-color.pipe';

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
import { FilterIconRoutes } from '@shared/components/ta-filter/utils/constants/filter-icons-routes.constants';

// animations
import { areaLeftSideAnimation } from '@shared/components/ta-filter/animations/area-left-side.animation';
import { areaRightSideAnimation } from '@shared/components/ta-filter/animations/area-right-side.animation';
import { closeForm } from '@shared/components/ta-filter/animations/close-form.animation';
import { inOutAnimation } from '@shared/components/ta-filter/animations/in-out.animation';
import { showAnimation } from '@shared/components/ta-filter/animations/show.animation';
import { stateHeader } from '@shared/components/ta-filter/animations/state-header.animation';

// models
import { ArrayStatus } from '@shared/components/ta-filter/models/array-status.model';

// Enums
import { LoadFilterStringEnum } from '@pages/load/pages/load-table/enums/load-filter-string.enum';
import { LoadStatusEnum } from '@shared/enums/load-status.enum';
import { ToolbarFilterStringEnum } from '@shared/components/ta-filter/enums/toolbar-filter-string.enum';
import { AssignedLoadResponse } from 'appcoretruckassist';

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
        FilterTrailerColorPipe,
        FilterLoadStatusPipe,
        DropdownLoadStatusColorPipe,
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

    @Input() type: string = ToolbarFilterStringEnum.USER_FILTER;
    @Input() icon: string = 'user';
    @Input() subType: string = 'pendingStatus';
    @Input() pmSubtype: string =
        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
    @Input() searchState: boolean = false;
    @Input() filterTitle: any =
        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
    @Input() defFilterHolder: boolean = false;
    @Input() noLeftIcon: boolean = false;
    @Input() leftSideIcon: boolean = false;
    @Input() largeLeftIcon: boolean = false;
    @Input() moneyFilter: boolean = false;
    @Input() fuelType: boolean = false;
    @Input() loadType: boolean = false;
    @Input() swipeFilter: boolean = false;
    @Input() locationDefType: boolean = false;
    @Input() legendView: boolean = false;
    @Input() isRepairFilter: boolean = false;
    @Input() isDispatchFilter?: boolean = false;
    @Input() toDoSubType: string =
        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
    @Input() dataArray: any;
    @Input() areaFilter: boolean = false;

    @Output() setFilter = new EventEmitter<any>();
    @Input() isAssignLoadModal: boolean = false;

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

    public loadStatusOptionsArray = [];
    public loadParkingOptionsArray = [];

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
    public selectedTimeValue: any =
        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
    public selectedTimeYear: number = null;
    public expandSearch: boolean = false;
    public searchInputValue: any =
        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
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
    public searchTerm: string =
        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;

    public rangeValue: number = 0;
    public usaSelectedStates: any[] = [];
    public canadaSelectedStates: any[] = [];
    public locationState: string =
        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
    public originState: string =
        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
    public destinationState: string =
        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
    public singleFormError: any =
        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
    public multiFormFirstError: any =
        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
    public multiFormSecondError: any =
        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
    public multiFormThirdError: any =
        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
    public moneyFilterStatus: boolean = false;
    public setButtonAvailable: boolean = false;
    public filterActiveArray: any[] = [];
    public filterUsaActiveArray: any[] = [];
    public filterCanadaActiveArray: any[] = [];
    public filterActiveTime: string =
        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
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
    public loactionNameSet: string =
        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;

    public activeFormNum: number = 0;
    public lastYear: any = ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
    public last2Years: any = ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
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
    public isAscendingOrderCategoryRepair: boolean = true;
    public isAscendingOrderPm: boolean = true;
    public isAscendingOrderTrailer: boolean = true;
    public isAscendingOrderTruck: boolean = true;
    public isAscendingOrderStatus: boolean = true;
    public isAscendingOrderUser: boolean = true;

    public isAscendingSortOrder: boolean = true;

    public resizeObserver: ResizeObserver;

    public isAnimated: any = false;

    public loadStatusEnum = LoadStatusEnum;

    public unselectedVisibleCount: number = 0;

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

        this.watchLoadStatusFilterValueChanges();

        this.clearTruckFilters();
    }

    private clearTruckFilters() {
        this.filterService.updateTruckFilters.subscribe((truck) => {
            this.clearAll('clearAll', true);
        });
    }

    private createForm(): void {
        this.rangeForm = this.formBuilder.group({
            rangeFrom: '0',
            rangeTo:
                this.type === ToolbarFilterStringEnum.PAY_FILTER ||
                (this.type === ToolbarFilterStringEnum.MONEY_FILTER &&
                    this.isRepairFilter)
                    ? '20,000'
                    : '5,000',
        });

        this.searchForm = this.formBuilder.group({
            search: ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER,
        });

        this.sliderForm = this.formBuilder.group({
            sliderValue: 0,
        });

        this.moneyForm = this.formBuilder.group({
            singleFrom: ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER,
            singleTo: ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER,
            multiFromFirstFrom:
                ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER,
            multiFromFirstTo: ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER,
            multiFormSecondFrom:
                ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER,
            multiFormSecondTo: ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER,
            multiFormThirdFrom:
                ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER,
            multiFormThirdTo: ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER,
        });

        this.locationForm = this.formBuilder.group({
            address: [null, [...addressValidation]],
        });

        this.areaForm = this.formBuilder.group({
            origin: [null, [...addressValidation]],
            destination: [null, [...addressValidation]],
        });

        this.payForm = this.formBuilder.group({
            payFrom: ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER,
            payTo: ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER,
        });
    }

    private watchLocationFormValueChanges(): void {
        this.locationForm.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((changes) => {
                if (!changes.address)
                    this.locationState =
                        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
            });
    }

    public trackByIdentity(id: number): number {
        return id;
    }

    private watchAreaFormValueChanges(): void {
        this.areaForm.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((changes) => {
                if (!changes.origin)
                    this.originState =
                        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;

                if (!changes.destination)
                    this.destinationState =
                        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
            });
    }

    private timeAndPayFilter(): void {
        if (this.type === ToolbarFilterStringEnum.TIME_FILTER) {
            const date = new Date();
            const pastYear = date.getFullYear() - 1;
            const past2Year = date.getFullYear() - 2;

            this.lastYear = pastYear;
            this.last2Years = past2Year;
        }

        if (
            this.type === ToolbarFilterStringEnum.PAY_FILTER ||
            (this.type === ToolbarFilterStringEnum.MONEY_FILTER &&
                this.isRepairFilter)
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
                        this.maxValueRange.replace(
                            /,/g,
                            ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER
                        ),
                        10
                    );
                    let maxRangeNum = parseInt(
                        this.maxValueRange.replace(
                            /,/g,
                            ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER
                        ),
                        10
                    );

                    if (
                        changes.rangeFrom &&
                        typeof changes.rangeFrom === 'string'
                    ) {
                        rangeFromNum = parseInt(
                            changes.rangeFrom.replace(
                                /,/g,
                                ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER
                            ),
                            10
                        );
                    }
                    if (
                        changes.rangeTo &&
                        changes.rangeTo != null &&
                        typeof changes.rangeTo === 'string'
                    ) {
                        rangeToNum = parseInt(
                            changes.rangeTo.replace(
                                /,/g,
                                ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER
                            ),
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

                    if (this.type === ToolbarFilterStringEnum.USER_FILTER) {
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
                    } else if (
                        this.type === ToolbarFilterStringEnum.STATUS_FILTER
                    ) {
                        this.loadStatusOptionsArray.map((item) => {
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
                    } else if (
                        this.type === ToolbarFilterStringEnum.PARKING_FILTER
                    ) {
                        this.loadParkingOptionsArray.map((item) => {
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
                    } else if (
                        this.type === ToolbarFilterStringEnum.TRUCK_FILTER
                    ) {
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
                    } else if (
                        this.type === ToolbarFilterStringEnum.FUEL_STOP_FILTER
                    ) {
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
                    } else if (
                        this.type === ToolbarFilterStringEnum.TRAILER_FILTER
                    ) {
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
                    } else if (
                        this.type === ToolbarFilterStringEnum.BROKER_FILTER
                    ) {
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
                    } else if (
                        this.type === ToolbarFilterStringEnum.DRIVER_FILTER
                    ) {
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
                    } else if (
                        this.type === ToolbarFilterStringEnum.STATE_FILTER
                    ) {
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
                    if (this.type === ToolbarFilterStringEnum.USER_FILTER) {
                        this.unselectedUser.map((item) => {
                            item.hidden = false;
                        });
                    } else if (
                        this.type === ToolbarFilterStringEnum.STATUS_FILTER
                    ) {
                        this.loadStatusOptionsArray.map((item) => {
                            item.hidden = false;
                        });
                    } else if (
                        this.type === ToolbarFilterStringEnum.PARKING_FILTER
                    ) {
                        this.loadParkingOptionsArray.map((item) => {
                            item.hidden = false;
                        });
                    } else if (
                        this.type === ToolbarFilterStringEnum.TRUCK_FILTER
                    ) {
                        this.truckArray.map((item) => {
                            item.hidden = false;
                        });
                    } else if (
                        this.type === ToolbarFilterStringEnum.TRAILER_FILTER
                    ) {
                        this.trailerArray.map((item) => {
                            item.hidden = false;
                        });
                    } else if (
                        this.type === ToolbarFilterStringEnum.FUEL_STOP_FILTER
                    ) {
                        this.fuelStopArray.map((item) => {
                            item.hidden = false;
                        });
                    } else if (
                        this.type === ToolbarFilterStringEnum.BROKER_FILTER
                    ) {
                        this.brokerArray.map((item) => {
                            item.hidden = false;
                        });
                    } else if (
                        this.type === ToolbarFilterStringEnum.DRIVER_FILTER
                    ) {
                        this.driverArray.map((item) => {
                            item.hidden = false;
                        });
                    } else if (
                        this.type === ToolbarFilterStringEnum.STATE_FILTER
                    ) {
                        this.usaStates.map((item) => {
                            item.hidden = false;
                        });

                        this.canadaStates.map((item) => {
                            item.hidden = false;
                        });
                    }

                    this.searchInputValue =
                        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
                }
            });
    }

    private createTrailerTypeGroups(
        loadRequirements: AssignedLoadResponse[]
    ): { name: string; logo: string; count: number }[] {
        if (!loadRequirements) return [];

        const trailerTypeGroups: {
            [key: string]: {
                name: string;
                logo: string;
                count: number;
                id: number;
                trailerType: {
                    id: number;
                };
            };
        } = {};

        loadRequirements.forEach((requirement) => {
            const trailerType = requirement?.loadRequirements?.trailerType;
            if (trailerType && trailerType.name) {
                const trailerName = trailerType.name;
                const id = trailerType.id;
                const logo = trailerType.logoName
                    ? `${FilterIconRoutes.trailerSVG}${trailerType.logoName}`
                    : '';

                // If the trailer type is already in the group, increment its count
                if (trailerTypeGroups[trailerName]) {
                    trailerTypeGroups[trailerName].count += 1;
                } else {
                    // Otherwise, initialize the trailer type with count 1
                    trailerTypeGroups[trailerName] = {
                        name: trailerName,
                        logo: logo,
                        count: 1,
                        id,
                        trailerType: {
                            id,
                        },
                    };
                }
            }
        });
        return Object.values(trailerTypeGroups);
    }

    private createTruckTypeGroups(
        loadRequirements: AssignedLoadResponse[]
    ): { name: string; logo: string; count: number }[] {
        if (!loadRequirements) return [];

        const truckTypeGroups: {
            [key: string]: {
                name: string;
                logo: string;
                count: number;
                id: number;
                truckType: {
                    id: number;
                };
            };
        } = {};

        loadRequirements.forEach((requirement) => {
            const truckType = requirement?.loadRequirements?.truckType;
            if (truckType && truckType.name) {
                const truckName = truckType.name;
                const id = truckType.id;
                const logo = truckType.logoName
                    ? `${FilterIconRoutes.truckSVG}${truckType.logoName}`
                    : '';
                // If the truck type is already in the group, increment its count
                if (truckTypeGroups[truckName]) {
                    truckTypeGroups[truckName].count += 1;
                } else {
                    // Otherwise, initialize the truck type with count 1
                    truckTypeGroups[truckName] = {
                        name: truckName,
                        logo: logo,
                        count: 1,
                        id,
                        truckType: { id },
                    };
                }
            }
        });
        return Object.values(truckTypeGroups);
    }

    private watchTableServiceValueChanges(): void {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (this.type === ToolbarFilterStringEnum.TRUCK_TYPE_FILTER) {
                    if (res?.animation === 'truck-type-update') {
                        const newData = res.data.map((type: any) => {
                            type['icon'] =
                                FilterIconRoutes.truckSVG + type.logoName;
                            return type;
                        });

                        this.truckTypeArray = newData;
                    }
                } else if (
                    this.type === ToolbarFilterStringEnum.TRAILER_TYPE_FILTER
                ) {
                    if (res?.animation === 'trailer-type-update') {
                        const newData = res.data.map((type: any) => {
                            type['icon'] =
                                FilterIconRoutes.trailerSVG + type.logoName;
                            return type;
                        });
                        this.trailerTypeArray = newData;
                    }
                } else if (
                    this.type === ToolbarFilterStringEnum.CATEGORY_REPAIR_FILTER
                ) {
                    if (res?.animation === 'repair-category-update') {
                        const newData = res.data.map((type: any) => {
                            type['icon'] =
                                FilterIconRoutes.categorySVG + type.logo;
                            return type;
                        });
                        this.categoryRepairArray = newData;
                    }
                } else if (
                    this.type === ToolbarFilterStringEnum.CATEGORY_FUEL_FILTER
                ) {
                    if (res?.animation === 'fuel-category-update') {
                        this.categoryFuelArray = res.data;
                    }
                } else if (this.type === ToolbarFilterStringEnum.STATE_FILTER) {
                    if (res?.animation === 'state-data-update') {
                        const usaArray = [];
                        const canadaArray = [];

                        res.data.map((state) => {
                            if (
                                state.countryType.name ==
                                ToolbarFilterStringEnum.CANADA_2
                            ) {
                                canadaArray.push(state);
                            } else {
                                usaArray.push(state);
                            }
                        });

                        this.usaStates = usaArray;
                        this.canadaStates = canadaArray;
                    }
                } else if (
                    this.type === ToolbarFilterStringEnum.DEPARTMENT_FILTER
                ) {
                    if (res?.animation === 'department-data-update') {
                        this.departmentArray = res.data;
                    }
                } else if (
                    this.type === ToolbarFilterStringEnum.PM_FILTER &&
                    this.pmSubtype === 'truck'
                ) {
                    if (res?.animation === 'pm-truck-data-update') {
                        if (res.data.pmTrucks?.length) {
                            const newData = res.data.pmTrucks.map(
                                (type: any) => {
                                    type['icon'] =
                                        FilterIconRoutes.repairPmSVG +
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
                    this.type === ToolbarFilterStringEnum.STATUS_FILTER &&
                    this.isDispatchFilter
                ) {
                    if (res?.animation === 'list-update') {
                        this.loadStatusOptionsArray = res.data.statuses;
                    }
                } else if (
                    this.type === ToolbarFilterStringEnum.PARKING_FILTER
                ) {
                    if (res?.animation === 'list-update') {
                        this.loadParkingOptionsArray = res.data.parkings;
                    }
                } else if (
                    this.type === ToolbarFilterStringEnum.PM_FILTER &&
                    this.pmSubtype === 'trailer'
                ) {
                    if (res?.animation === 'pm-trailer-data-update') {
                        if (res.data.pmTrailer?.length) {
                            const newData = res.data.pmTrailer.map(
                                (type: any) => {
                                    type['icon'] =
                                        FilterIconRoutes.repairPmSVG +
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
                } else if (this.type === ToolbarFilterStringEnum.USER_FILTER) {
                    if (res?.animation === 'dispatch-data-update') {
                        const newData = res.data.map((type: any) => {
                            type['name'] =
                                type?.fullName ??
                                `${type?.driver?.firstName} ${type?.driver?.lastName}`;
                            type['count'] = type.loadCount;
                            return type;
                        });

                        this.unselectedUser = newData;
                    }
                } else if (this.type === ToolbarFilterStringEnum.TRUCK_FILTER) {
                    if (res?.animation === 'truck-list-update') {
                        let newData;
                        if (this.isRepairFilter) {
                            newData = res.data.map((type: any) => {
                                type['name'] = type.truckNumber;
                                return type;
                            });
                        } else {
                            newData = res.data?.map((type: any) => {
                                type['name'] = type.truckType.name;
                                type['logo'] =
                                    FilterIconRoutes.truckSVG +
                                    type.truckType.logoName;
                                return type;
                            });
                        }
                        this.truckArray = newData;
                    } else if (res?.animation === 'list-update') {
                        if (this.isDispatchFilter) {
                            this.truckArray = res.data.truckTypes.map(
                                (type: any) => {
                                    type['name'] = type.truckType.name;
                                    type['logo'] =
                                        FilterIconRoutes.truckSVG +
                                        type.truckType.logoName;
                                    return type;
                                }
                            );
                        }
                    } else if (res?.animation === 'load-list-update') {
                        if (this.isAssignLoadModal)
                            this.truckArray = this.createTruckTypeGroups(
                                res.data
                            );
                    }
                } else if (
                    this.type === ToolbarFilterStringEnum.TRAILER_FILTER
                ) {
                    if (res?.animation === 'trailer-list-update') {
                        let newData;
                        if (this.isRepairFilter) {
                            newData = res.data.map((type: any) => {
                                type['name'] = type.trailerNumber;
                                return type;
                            });
                        } else {
                            newData = res.data?.map((type: any) => {
                                type['name'] = type.trailerType.name;
                                type['logo'] =
                                    FilterIconRoutes.trailerSVG +
                                    type.trailerType.logoName;
                                return type;
                            });
                        }
                        this.trailerArray = newData;
                    } else if (res?.animation === 'list-update') {
                        if (this.isDispatchFilter) {
                            this.trailerArray = res.data.trailerTypes.map(
                                (type: any) => {
                                    type['name'] = type.trailerType.name;
                                    type['logo'] =
                                        FilterIconRoutes.trailerSVG +
                                        type.trailerType.logoName;
                                    return type;
                                }
                            );
                        }
                    } else if (res?.animation === 'load-list-update') {
                        if (this.isAssignLoadModal)
                            this.trailerArray = this.createTrailerTypeGroups(
                                res.data
                            );
                    }
                }
            });
    }

    private watchLoadStatusFilterValueChanges(): void {
        this.tableService.currentLoadStatusFilterOptions
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res && this.type === LoadFilterStringEnum.STATUS_FILTER) {
                    this.loadStatusOptionsArray = res.options;
                }
            });
    }

    public checkForType(): void {
        if (this.type === ToolbarFilterStringEnum.PM_FILTER) {
            this.getBackendData(this.type, this.pmSubtype);
        } else {
            this.getBackendData(this.type);
        }
    }

    public addToSelectedUser(item, indx, subType?): void {
        const mainArray = this.getMainArray(subType);

        mainArray[indx].isSelected = true;

        this.unselectedVisibleCount = mainArray.filter(
            (item2) => !item2.isSelected
        )?.length;

        if (this.type === ToolbarFilterStringEnum.STATE_FILTER) {
            if (subType === ToolbarFilterStringEnum.CANADA) {
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

        if (this.type === ToolbarFilterStringEnum.STATE_FILTER) {
            if (subType === ToolbarFilterStringEnum.CANADA) {
                this.canadaSelectedStates.splice(indx, 1);
            } else {
                this.usaSelectedStates.splice(indx, 1);
            }
        }

        const id = item.id;

        const mainArray = this.getMainArray(subType);

        mainArray.map((item2) => {
            if (
                this.type === ToolbarFilterStringEnum.TRUCK_FILTER ||
                this.type === ToolbarFilterStringEnum.TRAILER_FILTER
            ) {
                if (this.type === ToolbarFilterStringEnum.TRUCK_FILTER) {
                    if (this.isRepairFilter) {
                        if (item2.truckNumber === item.truckNumber) {
                            item2.isSelected = false;
                        }
                    } else {
                        if (item2.truckType.id === item?.truckType.id) {
                            item2.isSelected = false;
                        }
                    }
                } else if (
                    this.type === ToolbarFilterStringEnum.TRAILER_FILTER
                ) {
                    if (this.isRepairFilter) {
                        if (item2.trailerNumber === item.trailerNumber) {
                            item2.isSelected = false;
                        }
                    } else {
                        if (item2.trailerType.id === item?.trailerType.id) {
                            item2.isSelected = false;
                        }
                    }
                }
            } else {
                if (item2.id === id) {
                    item2.isSelected = false;
                }
            }
        });

        this.unselectedVisibleCount = mainArray.filter(
            (item2) => !item2.isSelected
        )?.length;

        this.checkFilterActiveValue();
    }

    public clearAll(event?, mod?): void {
        // if (event) event.stopPropagation();

        // if (mod) this.hoverClose = false;

        // if (event) {
        //     const element = event.target;
        //     if (
        //         !element.classList.contains(ToolbarFilterStringEnum.ACTIVE) &&
        //         !mod
        //     )
        //         false;
        // }

        if (this.type === ToolbarFilterStringEnum.TIME_FILTER) {
            this.selectedTimeValue =
                ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
            this.filterActiveTime =
                ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
        } else {
            this.unselectedUser = [
                ...this.unselectedUser,
                ...this.selectedUser,
            ];

            this.unselectedUser = this.unselectedUser.filter(
                (value, index, self) =>
                    index === self.findIndex((user) => user.id === value.id)
            );

            this.selectedUser = [];
            this.usaSelectedStates = [];
            this.canadaSelectedStates = [];

            switch (this.type) {
                case ToolbarFilterStringEnum.DEPARTMENT_FILTER:
                    this.departmentArray.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });
                    break;
                case ToolbarFilterStringEnum.STATUS_FILTER:
                    this.loadStatusOptionsArray.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });

                    break;
                case ToolbarFilterStringEnum.PARKING_FILTER:
                    this.loadParkingOptionsArray.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });

                    break;
                case ToolbarFilterStringEnum.PM_FILTER:
                    this.pmFilterArray.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });
                    break;
                case ToolbarFilterStringEnum.CATEGORY_FUEL_FILTER:
                    this.categoryFuelArray.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });
                    break;
                case ToolbarFilterStringEnum.CATEGORY_REPAIR_FILTER:
                    this.categoryRepairArray.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });
                    break;
                case ToolbarFilterStringEnum.TRUCK_FILTER:
                    this.truckArray.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });
                    break;
                case ToolbarFilterStringEnum.TRAILER_FILTER:
                    this.trailerArray.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });
                    break;
                case ToolbarFilterStringEnum.BROKER_FILTER:
                    this.brokerArray.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });
                    break;
                case ToolbarFilterStringEnum.DRIVER_FILTER:
                    this.driverArray.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });
                    break;
                case ToolbarFilterStringEnum.TRUCK_TYPE_FILTER:
                    this.truckTypeArray.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });
                    break;
                case ToolbarFilterStringEnum.USER_FILTER:
                    this.unselectedUser.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });
                    break;
                case ToolbarFilterStringEnum.STATE_FILTER:
                    this.usaStates.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });

                    this.canadaStates.map((item) => {
                        item.isSelected = false;
                        item.currentSet = false;
                    });
                    break;
                case ToolbarFilterStringEnum.INJURY_FILTER:
                case ToolbarFilterStringEnum.FATALITY_FILTER:
                case ToolbarFilterStringEnum.VIOLATION_FILTER:
                    this.rangeValue = 0;
                    break;
                case ToolbarFilterStringEnum.LOCATION_FILTER:
                    this.locationForm.setValue({
                        address:
                            ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER,
                    });
                    this.areaForm.setValue({
                        origin: ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER,
                        destination:
                            ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER,
                    });
                    this.locationRange = 25;
                    this.locationState =
                        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
                    this.longVal = 0;
                    this.latVal = 0;
                    this.originLongVal = 0;
                    this.originLatVal = 0;
                    this.destLongVal = 0;
                    this.destLatVal = 0;
                    this.loactionNameSet =
                        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;

                    this.longValueSet = this.longVal;
                    this.latValSet = this.latVal;
                    this.originLongValSet = this.originLongVal;
                    this.originLatValSet = this.originLatVal;
                    this.destLatValSet = this.destLongVal;
                    this.destLongValSet = this.destLongVal;
                    this.locationRangeSet = this.locationRange;
                    break;
                case ToolbarFilterStringEnum.MONEY_FILTER:
                    if (!this.isRepairFilter) {
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
                case ToolbarFilterStringEnum.MILES_FILTER:
                case ToolbarFilterStringEnum.PAY_FILTER:
                case ToolbarFilterStringEnum.MONEY_FILTER:
                    if (
                        this.type === ToolbarFilterStringEnum.MONEY_FILTER &&
                        !this.isRepairFilter
                    ) {
                        break;
                    }
                    const maxNum = this.thousandSeparator.transform(
                        this.maxValueRange
                    );
                    this.rangeForm.get('rangeFrom')?.setValue('0');
                    this.rangeForm.get('rangeTo')?.setValue(maxNum);

                    this.maxValueSet = maxNum;
                    this.minValueSet = this.minValueRange;
                    break;
                default:
                    break;
            }
        }

        this.setButtonAvailable = true;
        this.moneyFilterStatus = false;
        this.filterActiveArray = [];
        this.swipeActiveRange = 0;
        this.autoClose?.tooltip?.close();
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

    public setTimeValue(mod: string, year?: number): void {
        if (this.selectedTimeValue === mod) {
            this.selectedTimeValue =
                ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
        } else {
            this.selectedTimeValue = mod;
        }

        if (year) {
            if (this.selectedTimeYear === year) this.selectedTimeYear = null;
            else this.selectedTimeYear = year;
        } else {
            this.selectedTimeYear = null;
        }

        if (this.filterActiveTime === mod) {
            this.setButtonAvailable = false;
        } else {
            this.setButtonAvailable = true;
        }
    }

    public removeTimeValue(event): void {
        event.stopPropagation();
        this.selectedTimeValue =
            ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
        this.selectedTimeYear = null;
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
        if (this.type != ToolbarFilterStringEnum.LOCATION_FILTER) {
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
                this.moneyForm
                    .get('singleFrom')
                    ?.setValue(
                        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER
                    );
                this.moneyForm
                    .get('singleTo')
                    ?.setValue(
                        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER
                    );
                this.singleFormError = false;
                this.moneyFilterStatus = false;
                this.singleToActive = 0;
                this.singleFromActive = 0;
                this.setButtonAvailable = false;
                break;
            case 'multiFromFirst':
                this.moneyForm
                    .get('multiFromFirstFrom')
                    ?.setValue(
                        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER
                    );
                this.moneyForm
                    .get('multiFromFirstTo')
                    ?.setValue(
                        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER
                    );
                this.multiFormFirstError = false;
                break;
            case 'multiFormSecond':
                this.moneyForm
                    .get('multiFormSecondFrom')
                    ?.setValue(
                        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER
                    );
                this.moneyForm
                    .get('multiFormSecondTo')
                    ?.setValue(
                        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER
                    );
                this.multiFormSecondError = false;
                break;
            case 'multiFormThird':
                this.moneyForm
                    .get('multiFormThirdFrom')
                    ?.setValue(
                        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER
                    );
                this.moneyForm
                    .get('multiFormThirdTo')
                    ?.setValue(
                        ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER
                    );
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
        if (element.classList.contains(ToolbarFilterStringEnum.ACTIVE)) {
            let queryParams = {};
            let subType =
                ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER.toString();

            this.setButtonAvailable = false;

            if (this.type === ToolbarFilterStringEnum.TIME_FILTER) {
                this.filterActiveTime = this.selectedTimeValue;

                if (!this.selectedTimeValue) {
                    this.clearAll(event);
                    return false;
                }

                if (this.selectedTimeYear) {
                    queryParams = {
                        timeSelected: this.filterActiveTime,
                        year: this.selectedTimeYear,
                    };
                } else {
                    queryParams = {
                        timeSelected: this.filterActiveTime,
                    };
                }
            } else if (this.swipeFilter) {
                this.swipeActiveRange = this.rangeValue;
            } else if (this.type === ToolbarFilterStringEnum.STATE_FILTER) {
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
            } else if (
                this.type === ToolbarFilterStringEnum.MONEY_FILTER &&
                !this.isRepairFilter
            ) {
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
                        firstFormTo:
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
                            : ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER,
                        singleTo: this.moneyForm.get('singleTo')?.value
                            ? parseInt(this.moneyForm.get('singleTo')?.value)
                            : ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER,
                    };
                }
            } else if (
                this.type === ToolbarFilterStringEnum.MILES_FILTER ||
                this.type === ToolbarFilterStringEnum.PAY_FILTER ||
                (this.type === ToolbarFilterStringEnum.MONEY_FILTER &&
                    this.isRepairFilter)
            ) {
                this.maxValueSet = this.rangeForm.get('rangeTo')?.value;
                this.minValueSet = this.rangeForm.get('rangeFrom')?.value;

                this.singleFormActive = true;
                queryParams = {
                    singleTo: parseInt(
                        this.rangeForm
                            .get('rangeTo')
                            ?.value.replace(
                                ',',
                                ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER
                            )
                    ),
                    singleFrom: parseInt(
                        this.rangeForm
                            .get('rangeFrom')
                            ?.value.replace(
                                ',',
                                ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER
                            )
                    ),
                };
            } else if (this.type === ToolbarFilterStringEnum.LOCATION_FILTER) {
                if (this.areaFilterSelected != 'Location') {
                    queryParams = {
                        originLatValue: this.originLatVal,
                        originLongValue: this.originLongVal,
                        destinationLatValue: this.destLatVal,
                        destinationLongValue: this.destLongVal,
                        rangeValue: this.locationRange,
                    };

                    this.locationRangeSet = this.locationRange;
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
                    case ToolbarFilterStringEnum.DEPARTMENT_FILTER:
                        mainArray = this.departmentArray;
                        break;
                    case ToolbarFilterStringEnum.PM_FILTER:
                        mainArray = this.pmFilterArray;
                        break;
                    case ToolbarFilterStringEnum.CATEGORY_FUEL_FILTER:
                        mainArray = this.categoryFuelArray;
                        break;
                    case ToolbarFilterStringEnum.CATEGORY_REPAIR_FILTER:
                        mainArray = this.categoryRepairArray;
                        break;
                    case ToolbarFilterStringEnum.TRUCK_FILTER:
                        mainArray = this.truckArray;
                        break;
                    case ToolbarFilterStringEnum.TRAILER_FILTER:
                        mainArray = this.trailerArray;
                        break;
                    case ToolbarFilterStringEnum.BROKER_FILTER:
                        mainArray = this.brokerArray;
                        break;
                    case ToolbarFilterStringEnum.DRIVER_FILTER:
                        mainArray = this.driverArray;
                        break;
                    case ToolbarFilterStringEnum.TRUCK_TYPE_FILTER:
                        mainArray = this.truckTypeArray;
                        break;
                    case ToolbarFilterStringEnum.TRAILER_TYPE_FILTER:
                        mainArray = this.trailerTypeArray;
                        break;
                    case ToolbarFilterStringEnum.USER_FILTER:
                        mainArray = this.unselectedUser;
                        break;
                    case ToolbarFilterStringEnum.STATUS_FILTER:
                        mainArray = this.loadStatusOptionsArray;
                        break;
                    case ToolbarFilterStringEnum.PARKING_FILTER:
                        mainArray = this.loadParkingOptionsArray;
                        break;
                }

                mainArray.map((item) => {
                    if (item.isSelected) {
                        item['currentSet'] = true;
                    } else {
                        item['currentSet'] = false;
                    }
                });

                if (
                    this.type === ToolbarFilterStringEnum.PM_FILTER ||
                    this.isRepairFilter
                ) {
                    this.filterActiveArray.map((data) => {
                        selectedUsersIdArray.push(data.name);
                    });
                } else if (this.type === ToolbarFilterStringEnum.TRUCK_FILTER) {
                    this.filterActiveArray.map((data) => {
                        selectedUsersIdArray.push(data.truckType?.id);
                    });
                } else if (
                    this.type === ToolbarFilterStringEnum.TRAILER_FILTER
                ) {
                    this.filterActiveArray.map((data) => {
                        selectedUsersIdArray.push(data.trailerType?.id);
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
                subType =
                    this.toDoSubType ??
                    ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER.toString();
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
        if (this.type === ToolbarFilterStringEnum.STATE_FILTER) {
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

        if (this.type === ToolbarFilterStringEnum.TIME_FILTER) {
            mainElementHolder = document.querySelector('.time-filter-holder');
        } else {
            mainElementHolder = document.querySelector('.filter-holder');
        }

        mainElementHolder?.classList.add('closeFilterAnimation');
        if (
            this.defFilterHolder &&
            this.type != ToolbarFilterStringEnum.STATE_FILTER
        ) {
            const mainArray = this.getMainArray();

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
        } else if (this.type === ToolbarFilterStringEnum.TIME_FILTER) {
            this.selectedTimeValue = this.filterActiveTime;
        } else if (
            this.type === ToolbarFilterStringEnum.MONEY_FILTER &&
            !this.isRepairFilter
        ) {
            if (this.subType != 'all') {
                const setFromValue =
                    this.singleFromActive != 'null' && this.singleFromActive
                        ? this.singleFromActive
                        : ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
                this.moneyForm.get('singleFrom')?.setValue(setFromValue);

                const setToValue =
                    this.singleToActive != 'null' && this.singleToActive
                        ? this.singleToActive
                        : ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
                this.moneyForm.get('singleTo')?.setValue(setToValue);
                if (!setFromValue) {
                    this.setButtonAvailable = false;
                }
            } else {
                const firstFromActive =
                    this.multiFromFirstFromActive &&
                    this.multiFromFirstFromActive != 'null'
                        ? this.multiFromFirstFromActive
                        : ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
                const firstToActive =
                    this.multiFromFirstToActive &&
                    this.multiFromFirstToActive != 'null'
                        ? this.multiFromFirstToActive
                        : ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;

                this.moneyForm.get('multiFromFirstTo')?.setValue(firstToActive);
                this.moneyForm
                    .get('multiFromFirstFrom')
                    ?.setValue(firstFromActive);

                const secFromActive =
                    this.multiFormSecondFromActive &&
                    this.multiFormSecondFromActive != 'null'
                        ? this.multiFormSecondFromActive
                        : ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
                const secToActive =
                    this.multiFormSecondToActive &&
                    this.multiFormSecondToActive != 'null'
                        ? this.multiFormSecondToActive
                        : ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;

                this.moneyForm
                    .get('multiFormSecondFrom')
                    ?.setValue(secFromActive);
                this.moneyForm.get('multiFormSecondTo')?.setValue(secToActive);

                const thirdFromActive =
                    this.multiFormThirdFromActive &&
                    this.multiFormThirdFromActive != 'null'
                        ? this.multiFormThirdFromActive
                        : ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;
                const thirdToActive =
                    this.multiFormThirdToActive &&
                    this.multiFormThirdToActive != 'null'
                        ? this.multiFormThirdToActive
                        : ToolbarFilterStringEnum.EMPTY_STRING_PLACEHOLDER;

                this.moneyForm
                    .get('multiFormThirdFrom')
                    ?.setValue(thirdFromActive);
                this.moneyForm.get('multiFormThirdTo')?.setValue(thirdToActive);
            }
        } else if (this.type === ToolbarFilterStringEnum.LOCATION_FILTER) {
            this.locationForm.setValue({ address: this.loactionNameSet });
            this.longVal = this.longValueSet;
            this.latVal = this.latValSet;
            this.locationRange = this.locationRangeSet;
        } else if (this.type === ToolbarFilterStringEnum.STATE_FILTER) {
            this.usaSelectedStates = [...this.filterUsaActiveArray];
            this.canadaSelectedStates = [...this.filterCanadaActiveArray];
            this.setButtonAvailable = false;
        } else if (this.swipeFilter) {
            this.rangeValue = this.swipeActiveRange;
        } else if (this.type === ToolbarFilterStringEnum.VACATION_FILTER) {
            this.setFilter.emit({
                action: 'Clear',
                filterType: ToolbarFilterStringEnum.VACATION_FILTER,
                vacation: false,
            });
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
        if (this.type === ToolbarFilterStringEnum.VACATION_FILTER) {
            this.setFilter.emit({
                action: 'Set',
                filterType: ToolbarFilterStringEnum.VACATION_FILTER,
                vacation: true,
            });
        }
    }

    public onTabChange(event: any): void {
        this.sideAnimation = true;
        this.areaFilterSelected = event.name;
    }

    public getBackendData(type: any, subType?: string): void {
        if (this.isAssignLoadModal) return;
        switch (this.type) {
            case ToolbarFilterStringEnum.TRUCK_TYPE_FILTER: {
                this.filterService.getTruckType();
                break;
            }
            case ToolbarFilterStringEnum.TRAILER_TYPE_FILTER: {
                this.filterService.getTrailerType();
                break;
            }
            case ToolbarFilterStringEnum.CATEGORY_REPAIR_FILTER: {
                this.filterService.getRepairCategory();
                break;
            }
            case ToolbarFilterStringEnum.CATEGORY_FUEL_FILTER: {
                this.filterService.getFuelCategory();
                break;
            }
            case ToolbarFilterStringEnum.STATE_FILTER: {
                this.filterService.getStateData();
            }
            case ToolbarFilterStringEnum.PARKING_FILTER: {
                this.filterService.getDispatchFilterData();
            }
            case ToolbarFilterStringEnum.DEPARTMENT_FILTER: {
                this.filterService.getDepartmentData();
                break;
            }
            case ToolbarFilterStringEnum.USER_FILTER: {
                //this.filterService.getDispatchData(); - Disable for now
                break;
            }
            case ToolbarFilterStringEnum.TRUCK_FILTER: {
                if (this.isRepairFilter) {
                    this.filterService.getRepairTruckData();
                    this.filterService.getPmData('truck');
                } else if (!this.isDispatchFilter) {
                    // This is called only on load for truck page,
                    this.filterService.getTruckData();
                }
                break;
            }
            case ToolbarFilterStringEnum.TRAILER_FILTER: {
                if (this.isRepairFilter) {
                    this.filterService.getRepairTrailerData();
                    this.filterService.getPmData('trailer');
                } else if (!this.isDispatchFilter) {
                    this.filterService.getTrailerData();
                }
                break;
            }
            case ToolbarFilterStringEnum.PM_FILTER: {
                this.filterService.getPmData(subType);
                break;
            }
        }
    }

    public sortItems(): void {
        switch (this.type) {
            case ToolbarFilterStringEnum.CATEGORY_REPAIR_FILTER:
                this.categoryRepairArray.sort((a, b) => {
                    if (this.isAscendingSortOrder) {
                        return a.name.localeCompare(b.name);
                    } else {
                        return b.name.localeCompare(a.name);
                    }
                });
                this.isAscendingSortOrder = !this.isAscendingSortOrder;
                break;

            case ToolbarFilterStringEnum.TRUCK_FILTER:
                this.truckArray.sort((a, b) => {
                    if (this.isDispatchFilter) {
                        if (this.isAscendingSortOrder) {
                            return a.count - b.count;
                        } else {
                            return b.count - a.count;
                        }
                    } else {
                        if (this.isAscendingSortOrder) {
                            return a.name.localeCompare(b.name);
                        } else {
                            return b.name.localeCompare(a.name);
                        }
                    }
                });
                this.isAscendingSortOrder = !this.isAscendingSortOrder;
                break;

            case ToolbarFilterStringEnum.TRAILER_FILTER:
                this.trailerArray.sort((a, b) => {
                    if (this.isDispatchFilter) {
                        if (this.isAscendingSortOrder) {
                            return a.count - b.count;
                        } else {
                            return b.count - a.count;
                        }
                    } else {
                        if (this.isAscendingSortOrder) {
                            return a.name.localeCompare(b.name);
                        } else {
                            return b.name.localeCompare(a.name);
                        }
                    }
                });

                this.isAscendingSortOrder = !this.isAscendingSortOrder;
                break;

            case ToolbarFilterStringEnum.PM_FILTER:
                this.pmFilterArray.sort((a, b) => {
                    if (this.isAscendingSortOrder) {
                        return a.name.localeCompare(b.name);
                    } else {
                        return b.name.localeCompare(a.name);
                    }
                });
                this.isAscendingSortOrder = !this.isAscendingSortOrder;
                break;

            case ToolbarFilterStringEnum.STATUS_FILTER:
                this.loadStatusOptionsArray.sort((a, b) => {
                    if (this.isAscendingSortOrder) {
                        return a.count - b.count;
                    } else {
                        return b.count - a.count;
                    }
                });

                this.isAscendingSortOrder = !this.isAscendingSortOrder;
                break;

            case ToolbarFilterStringEnum.USER_FILTER:
                this.unselectedUser.sort((a, b) => {
                    if (this.isAscendingSortOrder) {
                        return a.count - b.count;
                    } else {
                        return b.count - a.count;
                    }
                });

                this.selectedUser.sort((a, b) => {
                    if (this.isAscendingSortOrder) {
                        return a.count - b.count;
                    } else {
                        return b.count - a.count;
                    }
                });

                this.isAscendingSortOrder = !this.isAscendingSortOrder;
                break;

            case ToolbarFilterStringEnum.PARKING_FILTER:
                this.loadParkingOptionsArray.sort((a, b) => {
                    if (this.isAscendingSortOrder) {
                        return a.count - b.count;
                    } else {
                        return b.count - a.count;
                    }
                });
                this.isAscendingSortOrder = !this.isAscendingSortOrder;
                break;

            default:
                break;
        }
    }

    private sortComparison(a: number, b: number, ascending: boolean): number {
        return ascending ? a - b : b - a;
    }

    private getMainArray(subType?: string): any[] {
        let mainArray = [];

        switch (this.type) {
            case ToolbarFilterStringEnum.DEPARTMENT_FILTER:
                mainArray = this.departmentArray;
                break;
            case ToolbarFilterStringEnum.STATUS_FILTER:
                mainArray = this.loadStatusOptionsArray;
                break;
            case ToolbarFilterStringEnum.PARKING_FILTER:
                mainArray = this.loadParkingOptionsArray;
                break;
            case ToolbarFilterStringEnum.PM_FILTER:
                mainArray = this.pmFilterArray;
                break;
            case ToolbarFilterStringEnum.CATEGORY_FUEL_FILTER:
                mainArray = this.categoryFuelArray;
                break;
            case ToolbarFilterStringEnum.CATEGORY_REPAIR_FILTER:
                mainArray = this.categoryRepairArray;
                break;
            case ToolbarFilterStringEnum.TRUCK_FILTER:
                mainArray = this.truckArray;
                break;
            case ToolbarFilterStringEnum.TRAILER_FILTER:
                mainArray = this.trailerArray;
                break;
            case ToolbarFilterStringEnum.FUEL_STOP_FILTER:
                mainArray = this.fuelStopArray;
                break;
            case ToolbarFilterStringEnum.BROKER_FILTER:
                mainArray = this.brokerArray;
                break;
            case ToolbarFilterStringEnum.DRIVER_FILTER:
                mainArray = this.driverArray;
                break;
            case ToolbarFilterStringEnum.TRUCK_TYPE_FILTER:
                mainArray = this.truckTypeArray;
                break;
            case ToolbarFilterStringEnum.TRAILER_TYPE_FILTER:
                mainArray = this.trailerTypeArray;
                break;
            case ToolbarFilterStringEnum.USER_FILTER:
                mainArray = this.unselectedUser;
                break;
            case ToolbarFilterStringEnum.STATE_FILTER:
                if (subType === ToolbarFilterStringEnum.CANADA) {
                    mainArray = this.canadaStates;
                } else {
                    mainArray = this.usaStates;
                }
                break;
            case ToolbarFilterStringEnum.LABEL_FILTER:
                mainArray = this.labelArray;
                break;
            default:
                break;
        }
        return mainArray;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
