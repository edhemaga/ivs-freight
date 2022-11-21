import { Subject, takeUntil } from 'rxjs';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import {
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    ElementRef,
    ChangeDetectorRef,
    QueryList,
    AfterViewInit,
    EventEmitter,
    Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Options } from '@angular-slider/ngx-slider';
import { addressValidation } from '../ta-input/ta-input.regex-validations';
import { TaThousandSeparatorPipe } from '../../../pipes/taThousandSeparator.pipe';
import { AutoclosePopoverComponent } from '../autoclose-popover/autoclose-popover.component';
import {
    animate,
    style,
    transition,
    trigger,
    state,
    keyframes,
} from '@angular/animations';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss'],
    providers: [NgbDropdownConfig, TaThousandSeparatorPipe],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('closeForm', [
            state(
                'true',
                style({
                    height: '*',
                    overflow: 'visible',
                    opacity: 1,
                })
            ),
            state(
                'false',
                style({
                    height: '0px',
                    overflow: 'hidden',
                    'margin-top': '0px',
                    opacity: 0,
                })
            ),
            state(
                'null',
                style({
                    height: '*',
                })
            ),
            transition('false <=> true', [animate('.1s linear')]),
            transition('true <=> false', [animate('.1s ease-in-out')]),
        ]),
        trigger('inOutAnimation', [
            state('in', style({ opacity: 1, scale: 1, height: '28px' })),
            transition(':enter', [
                animate(
                    100,
                    keyframes([
                        style({
                            opacity: 0,
                            offset: 0,
                            scale: 0.6,
                            height: '0px',
                        }),
                        style({
                            opacity: 0.25,
                            offset: 0.25,
                            scale: 0.7,
                            height: '10px',
                        }),
                        style({
                            opacity: 0.5,
                            offset: 0.5,
                            scale: 0.8,
                            height: '15px',
                        }),
                        style({
                            opacity: 0.75,
                            offset: 0.75,
                            scale: 0.9,
                            height: '20px',
                        }),
                        style({
                            opacity: 1,
                            offset: 1,
                            scale: 1,
                            height: '28px',
                        }),
                    ])
                ),
            ]),
            transition(':leave', [
                animate(
                    100,
                    keyframes([
                        style({
                            opacity: 1,
                            offset: 0,
                            scale: 1,
                            height: '28px',
                        }),
                        style({
                            opacity: 1,
                            offset: 0.25,
                            scale: 0.9,
                            height: '20px',
                        }),
                        style({
                            opacity: 0.75,
                            offset: 0.5,
                            scale: 0.8,
                            height: '15px',
                        }),
                        style({
                            opacity: 0.25,
                            offset: 0.75,
                            scale: 0.7,
                            height: '10px',
                        }),
                        style({
                            opacity: 0,
                            offset: 1,
                            scale: 0.6,
                            height: '0px',
                        }),
                    ])
                ),
            ]),
        ]),
        trigger('stateHeader', [
            state('in', style({ opacity: 1, height: '*' })),
            transition(':enter', [
                animate(
                    100,
                    keyframes([
                        style({ opacity: 0, offset: 0, height: '0px' }),
                        style({ opacity: 1, offset: 1, height: '*' }),
                    ])
                ),
            ]),
            transition(':leave', [
                animate(
                    100,
                    keyframes([
                        style({ opacity: 1, offset: 0 }),
                        style({ opacity: 0, offset: 1, height: '0px' }),
                    ])
                ),
            ]),
        ]),
        trigger('showAnimation', [
            state(
                'true',
                style({
                    height: '*',
                    overflow: 'auto',
                    opacity: 1,
                })
            ),
            state(
                'false',
                style({
                    height: '10px',
                    overflow: 'hidden',
                    opacity: '0.5',
                })
            ),
            state(
                'null',
                style({
                    height: '0px',
                    overflow: 'hidden',
                })
            ),
            transition('false <=> true', [
                animate('200ms cubic-bezier(0, 0, 0.60, 1.99)'),
            ]),
            transition('true <=> false', [animate('200ms ease')]),
        ]),
    ],
})
export class FilterComponent implements OnInit, AfterViewInit {
    private destroy$ = new Subject<void>();
    autoCloseComponent: QueryList<AutoclosePopoverComponent>;

    @ViewChild(AutoclosePopoverComponent)
    autoClose: AutoclosePopoverComponent;

    @ViewChild('t2') t2: any;
    @ViewChild('mainFilter') mainFilter: any;

    unselectedUser: any[] = [
        {
            name: 'Aleksandar Djordjevic',
            id: 1,
            avatar: 'https://www.gradprijepolje.com/wp-content/uploads/2021/09/Divac.jpg',
        },
        {
            name: 'Denis Rodman',
            id: 2,
        },
        {
            name: 'Eric Halpert',
            id: 3,
        },
        {
            name: 'Jacob Forman',
            id: 4,
        },
        {
            name: 'James Robertson',
            id: 5,
        },
        {
            name: 'Kevin Malone',
            id: 6,
        },
        {
            name: 'Michael Tollbert',
            id: 7,
        },
        {
            name: 'Michael Rodman',
            id: 8,
        },
        {
            name: 'James Halpert',
            id: 9,
        },
        {
            name: 'Anna Beasley',
            id: 10,
        },
        {
            name: 'Denis Halpert',
            id: 11,
        },
        {
            name: 'Eric James',
            id: 12,
        },
        {
            name: 'Michael Forman',
            id: 13,
        },
        {
            name: 'James Lopez',
            id: 14,
        },
    ];

    selectedUser: any[] = [];

    unselectedDispatcher: any[] = [
        {
            name: 'Angelo Trotter',
        },
        {
            name: 'Aleksandra Djordjevic',
        },
        {
            name: 'Alex Midleman',
        },
        {
            name: 'Ban Dover',
        },
        {
            name: 'Carlos Huanito',
        },
        {
            name: 'Chirs Griffin',
        },
        {
            name: 'Eric Forman',
        },
        {
            name: 'Glan Danzig',
        },
        {
            name: 'Denis Rodman',
        },
        {
            name: 'Michael Scott',
        },
        {
            name: 'Marko Martinovic',
        },
    ];

    departmentArray: any[] = [
        {
            name: 'Accounting',
            id: 1,
        },
        {
            name: 'Dispatch',
            id: 2,
        },
        {
            name: 'Recruitment',
            id: 3,
        },
        {
            name: 'Repair',
            id: 4,
        },
        {
            name: 'Safety',
            id: 5,
        },
        {
            name: 'Other',
            id: 6,
        },
    ];

    pendingStatusArray: any[] = [
        {
            id: 1,
            name: 'BOOKED',
            color: '#C1C1C1',
        },
        {
            id: 2,
            name: 'UNASSIGNED',
            color: '#C1C1C1',
        },
        {
            id: 3,
            name: 'ASSIGNED',
            color: '#9F9F9F',
        },
    ];

    activeStatusArray: any[] = [
        {
            id: 1,
            name: 'LOADED',
            color: '#74BF97',
        },
        {
            id: 2,
            name: 'DISPATCHED',
            color: '#7FA2E6',
        },
    ];

    closedStatusArray: any[] = [
        {
            id: 1,
            name: 'CANCELED',
            color: '#E27579',
        },
        {
            id: 2,
            name: 'CANCELED - LOADED',
            color: '#E27579',
        },
        {
            id: 3,
            name: 'DELIVERED',
            color: '#FFCB86',
        },
        {
            id: 4,
            name: 'HOLD',
            color: '#D6D6D6',
        },
        {
            id: 5,
            name: 'HOLD - INVOICED',
            color: '#D6D6D6',
        },
        {
            id: 6,
            name: 'INVOICED',
            color: '#D2CBA6',
        },
        {
            id: 7,
            name: 'PAID',
            color: '#BCB8A2',
        },
        {
            id: 8,
            name: 'SHORT-PAID',
            color: '#A6A293',
        },
    ];

    pmFilterArray: any[] = [
        {
            id: 1,
            name: 'Engine Oil & Filter',
            icon: 'assets/svg/common/repair-pm/ic_oil_pump.svg',
        },
        {
            id: 2,
            name: 'Air Filter',
            icon: 'assets/svg/common/repair-pm/ic_air_filter.svg',
        },
        {
            id: 3,
            name: 'Belts',
            icon: 'assets/svg/common/repair-pm/ic_fuel_pump.svg',
        },
        {
            id: 4,
            name: 'Transmission Fluid',
            icon: 'assets/svg/common/repair-pm/ic_air_compressor.svg',
        },
        {
            id: 5,
            name: 'Engine Tune-Up',
            icon: 'assets/svg/common/repair-pm/ic_ac_compressor.svg',
        },
        {
            id: 6,
            name: 'Alignment',
            icon: 'assets/svg/common/repair-pm/ic_alignment.svg',
        },
        {
            id: 7,
            name: 'Battery',
            icon: 'assets/svg/common/repair-pm/ic_battery.svg',
        },
        {
            id: 8,
            name: 'Brake Chamber',
            icon: 'assets/svg/common/repair-pm/ic_brake_filter.svg',
        },
        {
            id: 9,
            name: 'Engine Oil & Filter',
            icon: 'assets/svg/common/repair-pm/ic_oil_pump.svg',
        },
    ];

    categoryFuelArray: any[] = [
        {
            name: 'Diesel',
            id: 1,
        },
        {
            name: 'Reefer',
            id: 2,
        },
        {
            name: 'DEF',
            id: 3,
        },
        {
            name: 'Scale Ticket',
            id: 4,
        },
        {
            name: 'Oil',
            id: 5,
        },
        {
            name: 'Truckwash',
            id: 6,
        },
        {
            name: 'Parking',
            id: 7,
        },
        {
            name: 'Other',
            id: 8,
        },
    ];

    categoryRepairArray: any[] = [
        {
            id: 1,
            name: 'Mobile',
            icon: 'assets/svg/common/repair-services/ic_mobile.svg',
        },
        {
            id: 2,
            name: 'Shop',
            icon: 'assets/svg/common/repair-services/ic_shop.svg',
            activeIcon: 'assets/svg/common/ic_shop_cart.svg',
        },
        {
            id: 3,
            name: 'Towing',
            icon: 'assets/svg/common/ic_towing.svg',
        },
        {
            id: 4,
            name: 'Parts',
            icon: 'assets/svg/common/repair-services/ic_parts.svg',
        },
        {
            id: 5,
            name: 'Tire',
            icon: 'assets/svg/common/repair-services/ic_tire.svg',
        },
        {
            id: 6,
            name: 'Dealer',
            icon: 'assets/svg/common/repair-services/ic_dealer.svg',
        },
    ];

    truckArray: any[] = [
        {
            id: 1,
            name: '12345',
        },
        {
            id: 2,
            name: '231C1',
        },
        {
            id: 3,
            name: '111A2',
        },
        {
            id: 4,
            name: '245A5',
        },
        {
            id: 5,
            name: '5AC21',
        },
        {
            id: 6,
            name: '44A56',
        },
        {
            id: 7,
            name: '625C1',
        },
        {
            id: 8,
            name: '441C1',
        },
        {
            id: 9,
            name: '1231C',
        },
    ];

    trailerArray: any[] = [
        {
            id: 1,
            name: 'TRAILER',
        },
        {
            id: 2,
            name: 'TRAILER1',
        },
        {
            id: 3,
            name: 'TRAILER2',
        },
        {
            id: 4,
            name: 'TRAILER2',
        },
        {
            id: 5,
            name: 'TRAILER3',
        },
        {
            id: 6,
            name: 'TRAILER4',
        },
        {
            id: 7,
            name: 'TRAILER',
        },
        {
            id: 8,
            name: 'TRAILER',
        },
        {
            id: 9,
            name: 'TRAILER',
        },
    ];

    fuelStopArray: any[] = [
        {
            id: 1,
            name: '7-11 Store',
        },
        {
            id: 2,
            name: 'Pilot Travel Stop',
        },
        {
            id: 3,
            name: 'RR HICKORY HILLS',
        },
        {
            id: 4,
            name: 'Sheetz',
        },
        {
            id: 5,
            name: 'QUIK TRIP',
        },
        {
            id: 6,
            name: 'Corner Store Gas',
        },
        {
            id: 7,
            name: 'Fuel Proposition',
        },
        {
            id: 8,
            name: 'Behemoth Gas Station',
        },
    ];

    brokerArray: any[] = [
        {
            id: 1,
            name: 'R2 Logistics',
        },
        {
            id: 2,
            name: 'Webiz Conference',
        },
        {
            id: 3,
            name: 'Anthym Logistics, LLC',
        },
        {
            id: 4,
            name: 'LOGY Supply chain',
        },
        {
            id: 5,
            name: 'Everyone on time safelyaaaasdasd asdsad asdadaaa',
        },
        {
            id: 6,
            name: 'R2 Logistics',
        },
        {
            id: 7,
            name: 'LOGY Supply chain',
        },
        {
            id: 8,
            name: 'LOGY Supply chain 2',
        },
    ];

    driverArray: any[] = [
        {
            id: 1,
            name: 'Angelo Trotter',
            image: '',
        },
        {
            id: 2,
            name: 'Aleksandra Djordjevic',
            image: '',
        },
        {
            id: 3,
            name: 'Alex Midleman',
            image: '',
        },
        {
            id: 4,
            name: 'Ben Dover',
            image: '',
        },
        {
            id: 5,
            name: 'Carlos Huanito',
            image: '',
        },
        {
            id: 6,
            name: 'Chirs Griffin',
            image: '',
        },
        {
            id: 7,
            name: 'Erica Forman',
            image: '',
        },
        {
            id: 8,
            name: 'Glan Danzig',
            image: '',
        },
    ];

    truckTypeArray: any[] = [
        {
            id: 1,
            name: 'Semi Truck',
            icon: 'assets/svg/common/trucks/ic_truck_semi-truck.svg',
        },
        {
            id: 2,
            name: 'Semi Sleeper',
            icon: 'assets/svg/common/trucks/ic_truck_semi-wSleeper.svg',
        },
        {
            id: 3,
            name: 'Box Truck',
            icon: 'assets/svg/common/trucks/ic_truck_box-truck.svg',
        },
        {
            id: 4,
            name: 'Cargo Van',
            icon: 'assets/svg/common/trucks/ic_truck_cargo-van.svg',
        },
        {
            id: 5,
            name: 'Tow Truck',
            icon: 'assets/svg/common/trucks/ic_truck_tow-truck.svg',
        },
        {
            id: 6,
            name: 'Car Hauler',
            icon: 'assets/svg/common/trucks/ic_truck_car-hauler.svg',
        },
        {
            id: 7,
            name: 'Spotter',
            icon: 'assets/svg/common/trucks/ic_truck_spotter.svg',
        },
    ];

    trailerTypeArray: any[] = [
        {
            id: 1,
            name: 'Reefer',
            icon: 'assets/svg/common/trailers/ic_trailer_reefer.svg',
        },
        {
            id: 2,
            name: 'Dry Van',
            icon: 'assets/svg/common/trailers/ic_trailer_dryvan.svg',
        },
        {
            id: 3,
            name: 'Side Kit',
            icon: 'assets/svg/common/trailers/ic_trailer_side-kit.svg',
        },
        {
            id: 4,
            name: 'Conestoga',
            icon: 'assets/svg/common/trailers/ic_trailer_conestoga.svg',
        },
        {
            id: 5,
            name: 'Dumper',
            icon: 'assets/svg/common/trailers/ic_trailer_dumper.svg',
        },
        {
            id: 6,
            name: 'Container',
            icon: 'assets/svg/common/trailers/ic_trailer_container.svg',
        },
        {
            id: 7,
            name: 'Tanker',
            icon: 'assets/svg/common/trailers/ic_trailer_tanker-liquid.svg',
        },
        {
            id: 8,
            name: 'Car Hauler',
            icon: 'assets/svg/common/trailers/ic_trailer_carhauler.svg',
        },
        {
            id: 9,
            name: 'Flat Bed',
            icon: 'assets/svg/common/trailers/ic_trailer_flatbed.svg',
        },
        {
            id: 10,
            name: 'Low Boy/RGN',
            icon: 'assets/svg/common/trailers/ic_trailer_low-boy.svg',
        },
        {
            id: 11,
            name: 'Chassis',
            icon: 'assets/svg/common/trailers/ic_trailer_chassis.svg',
        },
        {
            id: 12,
            name: 'Step Deck',
            icon: 'assets/svg/common/trailers/ic_trailer_step-deck.svg',
        },
    ];

    usaStates: any[] = [
        {
            id: 1,
            name: 'Alabama',
            short: 'AL',
        },
        {
            id: 2,
            name: 'Alaska',
            short: 'AK',
        },
        {
            id: 3,
            name: 'American Samoa',
            short: 'AS',
        },
        {
            id: 4,
            name: 'Arizona',
            short: 'AZ',
        },
        {
            id: 5,
            name: 'Arkansas',
            short: 'AR',
        },
        {
            id: 6,
            name: 'California',
            short: 'CA',
        },
        {
            id: 7,
            name: 'Colorado',
            short: 'CO',
        },
        {
            id: 8,
            name: 'Connecticut',
            short: 'CT',
        },
        {
            id: 9,
            name: 'Delaware',
            short: 'DE',
        },
        {
            id: 10,
            name: 'District Of Columbia',
            short: 'DC',
        },
        {
            id: 11,
            name: 'Federated States Of Micronesia',
            short: 'FM',
        },
        {
            id: 12,
            name: 'Florida',
            short: 'FL',
        },
        {
            id: 13,
            name: 'Georgia',
            short: 'GA',
        },
        {
            id: 14,
            name: 'Guam',
            short: 'GU',
        },
        {
            id: 15,
            name: 'Hawaii',
            short: 'HI',
        },

        {
            id: 16,
            name: 'Idaho',
            short: 'ID',
        },
        {
            id: 17,
            name: 'Illinois',
            short: 'IL',
        },
        {
            id: 18,
            name: 'Indiana',
            short: 'IN',
        },
        {
            id: 19,
            name: 'Iowa',
            short: 'IA',
        },
        {
            id: 20,
            name: 'Kansas',
            short: 'KS',
        },
        {
            id: 21,
            name: 'Kentucky',
            short: 'KY',
        },
        {
            id: 22,
            name: 'Louisiana',
            short: 'LA',
        },
        {
            id: 23,
            name: 'Maine',
            short: 'ME',
        },
        {
            id: 24,
            name: 'Marshall Islands',
            short: 'MH',
        },
        {
            id: 25,
            name: 'Maryland',
            short: 'MD',
        },
        {
            id: 26,
            name: 'Massachusetts',
            short: 'MA',
        },
        {
            id: 27,
            name: 'Michigan',
            short: 'MI',
        },
        {
            id: 28,
            name: 'Minnesota',
            short: 'MN',
        },
        {
            id: 29,
            name: 'Mississippi',
            short: 'MS',
        },
        {
            id: 30,
            name: 'Missouri',
            short: 'MO',
        },
        {
            id: 31,
            name: 'Montana',
            short: 'MT',
        },
        {
            id: 32,
            name: 'Nebraska',
            short: 'NE',
        },
        {
            id: 33,
            name: 'Nevada',
            short: 'NV',
        },
        {
            id: 34,
            name: 'New Hampshire',
            short: 'NH',
        },
        {
            id: 35,
            name: 'New Jersey',
            short: 'NJ',
        },
        {
            id: 36,
            name: 'New Mexico',
            short: 'NM',
        },
        {
            id: 37,
            name: 'New York',
            short: 'NY',
        },
        {
            id: 38,
            name: 'North Carolina',
            short: 'NC',
        },
        {
            id: 39,
            name: 'North Dakota',
            short: 'ND',
        },
        {
            id: 40,
            name: 'Mississippi',
            short: 'MS',
        },
        {
            id: 41,
            name: 'Northern Mariana Islands',
            short: 'MP',
        },
        {
            id: 42,
            name: 'Ohio',
            short: 'OH',
        },
        {
            id: 43,
            name: 'Oklahoma',
            short: 'OK',
        },
        {
            id: 44,
            name: 'Oregon',
            short: 'OR',
        },
        {
            id: 45,
            name: 'Palau',
            short: 'PW',
        },
        {
            id: 46,
            name: 'Pennsylvania',
            short: 'PA',
        },
        {
            id: 47,
            name: 'Puerto Rico',
            short: 'PR',
        },
        {
            id: 48,
            name: 'Rhode Island',
            short: 'RI',
        },
        {
            id: 49,
            name: 'South Carolina',
            short: 'SC',
        },
        {
            id: 50,
            name: 'South Dakota',
            short: 'SD',
        },
        {
            id: 51,
            name: 'Tennessee',
            short: 'TN',
        },
        {
            id: 52,
            name: 'Texas',
            short: 'TX',
        },
        {
            id: 53,
            name: 'Utah',
            short: 'UT',
        },
        {
            id: 54,
            name: 'Vermont',
            short: 'VT',
        },
        {
            id: 55,
            name: 'Virgin Islands',
            short: 'VI',
        },
        {
            id: 56,
            name: 'Virginia',
            short: 'VA',
        },
        {
            id: 57,
            name: 'Washington',
            short: 'WA',
        },
        {
            id: 58,
            name: 'West Virginia',
            short: 'WV',
        },
        {
            id: 59,
            name: 'Wisconsin',
            short: 'WI',
        },
        {
            id: 60,
            name: 'Wyoming',
            short: 'WY',
        },
    ];

    canadaStates: any[] = [
        {
            id: 1,
            name: 'British Columbia',
            short: 'BC',
        },
        {
            id: 2,
            name: 'State 1',
            short: 'S1',
        },
        {
            id: 3,
            name: 'STATE 2',
            short: 'S2',
        },
    ];

    selectedDispatcher: any[] = [];
    selectedTimeValue: any = '';
    expandSearch: boolean = false;
    searchInputValue: any = '';
    showPart1: any = true;
    showPart2: any = true;
    showPart3: any = true;
    public searchForm!: FormGroup;
    public moneyForm!: FormGroup;
    public locationForm!: FormGroup;
    public payForm!: FormGroup;
    public sliderForm!: FormGroup;
    public rangeForm!: FormGroup;

    rangeValue: any = 0;
    usaSelectedStates: any[] = [];
    canadaSelectedStates: any[] = [];
    locationState: any = '';
    singleFormError: any = '';
    multiFormFirstError: any = '';
    multiFormSecondError: any = '';
    multiFormThirdError: any = '';
    moneyFilterStatus: any = false;
    setButtonAvailable: boolean = false;
    filterActiveArray: any[] = [];
    filterUsaActiveArray: any[] = [];
    filterCanadaActiveArray: any[] = [];
    filterActiveTime: any = '';
    swipeActiveRange: any = 0;
    singleFromActive: any = 0;
    singleToActive: any = 0;
    multiFromFirstFromActive: any = 0;
    multiFromFirstToActive: any = 0;
    multiFormSecondFromActive: any = 0;
    multiFormSecondToActive: any = 0;
    multiFormThirdFromActive: any = 0;
    multiFormThirdToActive: any = 0;
    locationRange: any = 50;
    hoverClose: any = false;

    public sliderData: Options = {
        floor: 0,
        ceil: 10,
        step: 0,
        showSelectionBar: true,
        hideLimitLabels: true,
    };

    public locationSliderData: Options = {
        floor: 50,
        ceil: 350,
        step: 5,
        showSelectionBar: true,
        hideLimitLabels: true,
    };

    public paySliderData: Options = {
        floor: 0,
        ceil: 20000,
        step: 1,
        showSelectionBar: true,
        hideLimitLabels: true,
        noSwitching: true,
        pushRange: true,
        minRange: 2000,
    };

    public milesSliderData: Options = {
        floor: 0,
        ceil: 5000,
        step: 1,
        showSelectionBar: true,
        hideLimitLabels: true,
        noSwitching: true,
        pushRange: true,
        minRange: 10,
    };

    minValueRange: any = '0';
    maxValueRange: any = '5,000';

    minValueSet: any = '0';
    maxValueSet: any = '5,000';

    minValueDragged: number = 0;
    maxValueDragged: number = 20000;

    rangeDiffNum: number = 0;

    activeFilter: boolean = false;
    longVal: any = 0;
    latVal: any = 0;

    longValueSet: any = 0;
    latValSet: any = 0;
    locationRangeSet: any = 50;
    loactionNameSet: any = '';

    activeFormNum: any = 0;
    lastYear: any = '';
    last2Years: any = '';
    totalFiltersNum: any = 0;
    singleFormActive: any = false;

    @Input() type: string = 'userFilter';
    @Input() icon: string = 'user';
    @Input() subType: string = 'pendingStatus';
    @Input() searchState: boolean = false;
    @Input() filterTitle: string = '';
    @Input() defFilterHolder: boolean = false;
    @Input() noLeftIcon: boolean = false;
    @Input() leftSideIcon: boolean = false;
    @Input() largeLeftIcon: boolean = false;
    @Input() moneyFilter: boolean = false;
    @Input() fuelType: boolean = false;
    @Input() swipeFilter: boolean = false;
    @Input() locationDefType: boolean = false;
    @Input() legendView: boolean = false;
    @Input() toDoSubType: string = '';
    @Input() dataArray: any;

    @Output() setFilter = new EventEmitter<any>();

    resizeObserver: ResizeObserver;

    isAnimated: any = false;

    constructor(
        private formBuilder: FormBuilder,
        private thousandSeparator: TaThousandSeparatorPipe,
        private elementRef: ElementRef,
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        if (this.type == 'timeFilter') {
            var d = new Date();
            var pastYear = d.getFullYear() - 1;
            var past2Year = d.getFullYear() - 2;

            this.lastYear = pastYear;
            this.last2Years = past2Year;
        }

        if (this.type == 'payFilter') {
            this.maxValueRange = '20,000';
            this.maxValueSet = '20,000';
        }

        this.rangeForm = this.formBuilder.group({
            rangeFrom: '0',
            rangeTo: this.type == 'payFilter' ? '20,000' : '5,000',
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

        this.payForm = this.formBuilder.group({
            payFrom: '',
            payTo: '',
        });

        this.locationForm.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((changes) => {
                if (changes.address == null) {
                    this.locationState = '';
                }
            });

        this.rangeForm.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((changes) => {
                if (changes) {
                    var rangeFromNum = 0;
                    var rangeToNum = parseInt(
                        this.maxValueRange.replace(/,/g, ''),
                        10
                    );
                    var maxRangeNum = parseInt(
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

                    if (changes.rangeTo == null || rangeToNum > maxRangeNum) {
                        this.rangeForm
                            ?.get('rangeTo')
                            ?.setValue(this.maxValueRange);
                    }

                    if (rangeFromNum > maxRangeNum - 1) {
                        this.rangeForm
                            ?.get('rangeFrom')
                            ?.setValue(maxRangeNum - 1);
                    } else if (changes.rangeFrom == null) {
                        this.rangeForm?.get('rangeFrom')?.setValue('0');
                    }

                    this.minValueDragged = rangeFromNum;
                    this.maxValueDragged = rangeToNum;

                    this.rangeDiffNum =
                        this.maxValueDragged - this.minValueDragged;
                }
            });

        this.moneyForm.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((changes) => {
                if (changes.singleFrom || changes.singleTo) {
                    if (changes.singleTo) {
                        let to = parseInt(changes.singleTo);
                        let from = parseInt(changes.singleFrom);
                        if (from > to || from == to) {
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
                        let to = parseInt(changes.multiFromFirstTo);
                        let from = parseInt(changes.multiFromFirstFrom);

                        if (from > to || from == to) {
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
                        let to = parseInt(changes.multiFormSecondTo);
                        let from = parseInt(changes.multiFormSecondFrom);

                        if (from > to || from == to) {
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
                        let to = parseInt(changes.multiFormThirdTo);
                        let from = parseInt(changes.multiFormThirdFrom);
                        if (from > to || from == to) {
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

                    let fromActive =
                        this.singleFromActive && this.singleFromActive != 'null'
                            ? this.singleFromActive
                            : 0;
                    let toActive =
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

                    if (toActive == to) {
                        toValueChanged = false;
                    }

                    if (fromActive == from) {
                        fromValueChanged = false;
                    }

                    if (toValueChanged || fromValueChanged) {
                        this.setButtonAvailable = true;
                        this.moneyFilterStatus = true;
                    } else {
                        this.setButtonAvailable = false;
                        if (to == 0 && from == 0) {
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

        this.searchForm.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((changes) => {
                if (changes.search) {
                    let inputValue = changes.search;
                    this.searchInputValue = inputValue;

                    if (this.type == 'userFilter') {
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
                    } else if (this.type == 'statusFilter') {
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
                    } else if (this.type == 'truckFilter') {
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
                    } else if (this.type == 'fuelStopFilter') {
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
                    } else if (this.type == 'trailerFilter') {
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
                    } else if (this.type == 'brokerFilter') {
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
                    } else if (this.type == 'driverFilter') {
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
                    } else if (this.type == 'stateFilter') {
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
                    if (this.type == 'userFilter') {
                        this.unselectedUser.map((item) => {
                            item.hidden = false;
                        });
                    } else if (this.type == 'statusFilter') {
                        this.pendingStatusArray.map((item) => {
                            item.hidden = false;
                        });

                        this.activeStatusArray.map((item) => {
                            item.hidden = false;
                        });

                        this.closedStatusArray.map((item) => {
                            item.hidden = false;
                        });
                    } else if (this.type == 'truckFilter') {
                        this.truckArray.map((item) => {
                            item.hidden = false;
                        });
                    } else if (this.type == 'trailerFilter') {
                        this.trailerArray.map((item) => {
                            item.hidden = false;
                        });
                    } else if (this.type == 'fuelStopFilter') {
                        this.fuelStopArray.map((item) => {
                            item.hidden = false;
                        });
                    } else if (this.type == 'brokerFilter') {
                        this.brokerArray.map((item) => {
                            item.hidden = false;
                        });
                    } else if (this.type == 'driverFilter') {
                        this.driverArray.map((item) => {
                            item.hidden = false;
                        });
                    } else if (this.type == 'stateFilter') {
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

    ngAfterViewInit(): void {}

    addToSelectedUser(item, indx, subType?) {
        let mainArray: any[] = [];
        if (this.type == 'departmentFilter') {
            mainArray = this.departmentArray;
        } else if (this.type == 'statusFilter') {
            if (subType == 'pending') {
                mainArray = this.pendingStatusArray;
            } else if (subType == 'active') {
                mainArray = this.activeStatusArray;
            } else {
                mainArray = this.closedStatusArray;
            }
        } else if (this.type == 'pmFilter') {
            mainArray = this.pmFilterArray;
        } else if (this.type == 'categoryFuelFilter') {
            mainArray = this.categoryFuelArray;
        } else if (this.type == 'categoryRepairFilter') {
            mainArray = this.categoryRepairArray;
        } else if (this.type == 'truckFilter') {
            mainArray = this.truckArray;
        } else if (this.type == 'trailerFilter') {
            mainArray = this.trailerArray;
        } else if (this.type == 'fuelStopFilter') {
            mainArray = this.fuelStopArray;
        } else if (this.type == 'brokerFilter') {
            mainArray = this.brokerArray;
        } else if (this.type == 'driverFilter') {
            mainArray = this.driverArray;
        } else if (this.type == 'truckTypeFilter') {
            mainArray = this.truckTypeArray;
        } else if (this.type == 'userFilter') {
            mainArray = this.unselectedUser;
        } else if (this.type == 'trailerTypeFilter') {
            mainArray = this.trailerTypeArray;
        } else if (this.type == 'stateFilter') {
            if (subType == 'canada') {
                mainArray = this.canadaStates;
            } else {
                mainArray = this.usaStates;
            }
        }

        mainArray[indx].isSelected = true;

        if (this.type == 'stateFilter') {
            if (subType == 'canada') {
                this.canadaSelectedStates.push(item);
            } else {
                this.usaSelectedStates.push(item);
            }
        } else {
            this.selectedUser.push(item);
        }
        this.checkFilterActiveValue();
    }

    removeFromSelectedUser(item, indx, subType?) {
        this.selectedUser.splice(indx, 1);

        if (this.type == 'stateFilter') {
            if (subType == 'canada') {
                this.canadaSelectedStates.splice(indx, 1);
            } else {
                this.usaSelectedStates.splice(indx, 1);
            }
        }

        let id = item.id;

        if (this.type == 'departmentFilter') {
            this.departmentArray.map((item) => {
                if (item.id == id) {
                    item.isSelected = false;
                }
            });
        } else if (this.type == 'statusFilter') {
            let checkActiveStatusArray = this.activeStatusArray.indexOf(item);
            let checkPendingStatusArray = this.pendingStatusArray.indexOf(item);

            let mainArray: any[] = [];

            if (checkActiveStatusArray > -1) {
                mainArray = this.activeStatusArray;
            } else if (checkPendingStatusArray > -1) {
                mainArray = this.pendingStatusArray;
            } else {
                mainArray = this.closedStatusArray;
            }

            mainArray.map((item) => {
                if (item.id == id) {
                    item.isSelected = false;
                }
            });
        } else if (this.type == 'pmFilter') {
            this.pmFilterArray.map((item) => {
                if (item.id == id) {
                    item.isSelected = false;
                }
            });
        } else if (this.type == 'categoryFuelFilter') {
            this.categoryFuelArray.map((item) => {
                if (item.id == id) {
                    item.isSelected = false;
                }
            });
        } else if (this.type == 'categoryRepairFilter') {
            this.categoryRepairArray.map((item) => {
                if (item.id == id) {
                    item.isSelected = false;
                }
            });
        } else if (this.type == 'truckFilter') {
            this.truckArray.map((item) => {
                if (item.id == id) {
                    item.isSelected = false;
                }
            });
        } else if (this.type == 'trailerFilter') {
            this.trailerArray.map((item) => {
                if (item.id == id) {
                    item.isSelected = false;
                }
            });
        } else if (this.type == 'fuelStopFilter') {
            this.fuelStopArray.map((item) => {
                if (item.id == id) {
                    item.isSelected = false;
                }
            });
        } else if (this.type == 'brokerFilter') {
            this.brokerArray.map((item) => {
                if (item.id == id) {
                    item.isSelected = false;
                }
            });
        } else if (this.type == 'driverFilter') {
            this.driverArray.map((item) => {
                if (item.id == id) {
                    item.isSelected = false;
                }
            });
        } else if (this.type == 'truckTypeFilter') {
            this.truckTypeArray.map((item) => {
                if (item.id == id) {
                    item.isSelected = false;
                }
            });
        } else if (this.type == 'trailerTypeFilter') {
            this.trailerTypeArray.map((item) => {
                if (item.id == id) {
                    item.isSelected = false;
                }
            });
        } else if (this.type == 'userFilter') {
            this.unselectedUser.map((item) => {
                if (item.id == id) {
                    item.isSelected = false;
                }
            });
        } else if (this.type == 'stateFilter') {
            if (subType == 'canada') {
                this.canadaStates.map((item) => {
                    if (item.id == id) {
                        item.isSelected = false;
                    }
                });
            } else {
                this.usaStates.map((item) => {
                    if (item.id == id) {
                        item.isSelected = false;
                    }
                });
            }
        }
        this.checkFilterActiveValue();
    }

    clearAll(e?, mod?) {
        if (e) {
            e.stopPropagation();
        }

        if (mod) {
            this.hoverClose = false;
        }

        const element = e.target;
        if (!element.classList.contains('active') && !mod) {
            return false;
        }

        if (this.type == 'timeFilter') {
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
                    this.locationRange = 50;
                    this.locationState = '';
                    this.longVal = 0;
                    this.latVal = 0;
                    this.loactionNameSet = '';

                    this.longValueSet = this.longVal;
                    this.latValSet = this.latVal;
                    this.locationRangeSet = this.locationRange;
                    break;
                case 'moneyFilter':
                    if (this.subType != 'all') {
                        this.clearForm('singleForm');
                    } else {
                        this.clearForm('clearAll');
                    }
                    this.activeFormNum = 0;
                    break;
                case 'milesFilter':
                case 'payFilter':
                    //this.rangeForm.reset();
                    let maxNum = this.thousandSeparator.transform(
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
        let data = {
            action: 'Clear',
            type: this.type,
        };

        if (this.setFilter) {
            this.setFilter.emit(data);
        }
    }

    filterUser(e: any) {
        const inputValue = e.target.value;
        this.unselectedUser.filter((item) => {
            item.hidden = true;
            if (item.name.toLowerCase().includes(inputValue.toLowerCase())) {
                item.hidden = false;
            }
            return item;
        });
    }

    setTimeValue(mod) {
        if (this.selectedTimeValue == mod) {
            this.selectedTimeValue = '';
        } else {
            this.selectedTimeValue = mod;
        }

        if (this.filterActiveTime == mod) {
            this.setButtonAvailable = false;
        } else {
            this.setButtonAvailable = true;
        }
    }

    removeTimeValue(e) {
        e.stopPropagation();
        this.selectedTimeValue = '';
    }

    showSearch(mod?) {
        let filterSearchHead = document.querySelector('.search-input-header');
        let filterTextHead = document.querySelector('.filter-text-part');

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

    hideFormPart(mod) {
        if (mod == 'part1') {
            this.showPart1 = !this.showPart1;
        } else if (mod == 'part2') {
            this.showPart2 = !this.showPart2;
        } else {
            this.showPart3 = !this.showPart3;
        }
    }

    setRangeValue(mod) {
        if (this.type != 'locationFilter') {
            this.rangeValue = mod;
        } else {
            this.locationRange = mod;
        }
    }

    handleInputSelect(e) {
        if (e?.address?.address) {
            this.locationState = e.address.address;
        }

        if (e?.longLat) {
            this.longVal = e?.longLat?.longitude;
            this.latVal = e?.longLat?.latitude;
        }
    }

    clearForm(mod) {
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

    public setFilterValue(e) {
        const element = e.target;
        if (element.classList.contains('active')) {
            let queryParams = {};
            let subType = '';

            this.setButtonAvailable = false;

            if (this.type == 'timeFilter') {
                this.filterActiveTime = this.selectedTimeValue;

                if (!this.selectedTimeValue) {
                    this.clearAll(e);
                    return false;
                }

                queryParams = {
                    timeSelected: this.filterActiveTime,
                };
            } else if (this.swipeFilter) {
                this.swipeActiveRange = this.rangeValue;
            } else if (this.type == 'stateFilter') {
                this.filterUsaActiveArray = [...this.usaSelectedStates];
                this.filterCanadaActiveArray = [...this.canadaSelectedStates];

                let totalStatesSelected =
                    this.filterUsaActiveArray.length +
                    this.filterCanadaActiveArray.length;
                this.totalFiltersNum = totalStatesSelected;
            } else if (this.type == 'moneyFilter') {
                if (this.subType == 'all') {
                    let formActive = 0;

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
                        this.clearAll(e);
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
            } else if (this.type == 'milesFilter' || this.type == 'payFilter') {
                this.maxValueSet = this.rangeForm.get('rangeTo')?.value;
                this.minValueSet = this.rangeForm.get('rangeFrom')?.value;
            } else if (this.type == 'locationFilter') {
                queryParams = {
                    longValue: this.longVal,
                    latValue: this.latVal,
                    rangeValue: this.locationRange,
                };

                this.longValueSet = this.longVal;
                this.latValSet = this.latVal;
                this.locationRangeSet = this.locationRange;
                this.loactionNameSet = this.locationForm.get('address')?.value;
            } else {
                this.filterActiveArray = [...this.selectedUser];
                let selectedUsersIdArray: any = [];
                this.totalFiltersNum = this.filterActiveArray.length;

                console.log('---this.type', this.type);
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

                if (this.type == 'pmFilter') {
                    this.filterActiveArray.map((data) => {
                        selectedUsersIdArray.push(data.name);
                    });
                } else {
                    this.filterActiveArray.map((data) => {
                        selectedUsersIdArray.push(data.id);
                    });
                }

                if (selectedUsersIdArray.length == 0) {
                    this.clearAll(e);
                    return false;
                }

                queryParams = selectedUsersIdArray;
                subType = this.toDoSubType ? this.toDoSubType : '';
            }

            let data = {
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

    checkFilterActiveValue() {
        if (this.type == 'stateFilter') {
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

            let usaStringfy = JSON.stringify(arrayUsaSelected);
            let usaActiveStringify = JSON.stringify(arrayUsaActive);
            let canadaStringfy = JSON.stringify(arrayCanadaSelected);
            let canadaActiveStringify = JSON.stringify(arrayCanadaActive);

            if (usaStringfy == usaActiveStringify) {
                usaArrayChanged = false;
            } else {
                usaArrayChanged = true;
            }

            if (canadaStringfy == canadaActiveStringify) {
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
            let array1 = [...this.selectedUser];
            let array2 = [...this.filterActiveArray];

            array1.sort((a, b) => {
                return a.id - b.id;
            });

            array2.sort((a, b) => {
                return a.id - b.id;
            });

            let stringfy1 = JSON.stringify(array1);
            let stringfy2 = JSON.stringify(array2);

            if (stringfy1 == stringfy2) {
                this.setButtonAvailable = false;
            } else {
                this.setButtonAvailable = true;
            }
        }
    }

    checkMoneyMultiForm(data) {
        let firstFormChanged = 'none';
        let secondFormChanged = 'none';
        let thirdFormChanged = 'none';

        let firstFromActive =
            this.multiFromFirstFromActive &&
            this.multiFromFirstFromActive != 'null'
                ? this.multiFromFirstFromActive
                : 0;
        let firstToActive =
            this.multiFromFirstToActive && this.multiFromFirstToActive != 'null'
                ? this.multiFromFirstToActive
                : 0;

        let secFromActive =
            this.multiFormSecondFromActive &&
            this.multiFormSecondFromActive != 'null'
                ? this.multiFormSecondFromActive
                : 0;
        let secToActive =
            this.multiFormSecondToActive &&
            this.multiFormSecondToActive != 'null'
                ? this.multiFormSecondToActive
                : 0;

        let thirdFromActive =
            this.multiFormThirdFromActive &&
            this.multiFormThirdFromActive != 'null'
                ? this.multiFormThirdFromActive
                : 0;
        let thirdToActive =
            this.multiFormThirdToActive && this.multiFormThirdToActive != 'null'
                ? this.multiFormThirdToActive
                : 0;

        let firstFrom =
            data.multiFromFirstFrom && data.multiFromFirstFrom != 'null'
                ? parseInt(data.multiFromFirstFrom)
                : 0;
        let firstTo =
            data.multiFromFirstTo && data.multiFromFirstTo != 'null'
                ? parseInt(data.multiFromFirstTo)
                : 0;

        let secFrom =
            data.multiFormSecondFrom && data.multiFormSecondFrom != 'null'
                ? parseInt(data.multiFormSecondFrom)
                : 0;
        let secTo =
            data.multiFormSecondTo && data.multiFormSecondTo != 'null'
                ? parseInt(data.multiFormSecondTo)
                : 0;

        let thirdFrom =
            data.multiFormThirdFrom && data.multiFormThirdFrom != 'null'
                ? parseInt(data.multiFormThirdFrom)
                : 0;
        let thirdTo =
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
            firstFormChanged == 'changed' ||
            secondFormChanged == 'changed' ||
            thirdFormChanged == 'changed'
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

    setRangeSliderValue(mod) {
        let fromValue = this.thousandSeparator.transform(mod.value);
        let toValue = this.thousandSeparator.transform(mod.highValue);
        this.rangeForm?.get('rangeFrom')?.setValue(fromValue);
        this.rangeForm?.get('rangeTo')?.setValue(toValue);
    }

    setMinValueRange(mod) {
        let fromValue = this.thousandSeparator.transform(mod);
        this.rangeForm?.get('rangeFrom')?.setValue(fromValue);
    }

    setMaxValueRange(mod) {
        let toValue = this.thousandSeparator.transform(mod);
        this.rangeForm?.get('rangeTo')?.setValue(toValue);
    }

    onFilterClose() {
        if (!this.activeFilter) {
            return false;
        }

        if (this.isAnimated) {
            this.isAnimated = true;
            this.cdRef.detectChanges();
            this.autoClose.tooltip.open();
        }

        this.activeFilter = false;

        let mainElementHolder;

        if (this.type == 'timeFilter') {
            mainElementHolder = document.querySelector('.time-filter-holder');
        } else {
            mainElementHolder = document.querySelector('.filter-holder');
        }

        mainElementHolder?.classList.add('closeFilterAnimation');

        setTimeout(() => {
            this.isAnimated = false;
            this.autoClose.tooltip.close();
            mainElementHolder?.classList.remove('closeFilterAnimation');
        }, 190);

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
                    let indexNum = this.selectedUser.indexOf(item);
                    if (indexNum > -1) {
                        this.removeFromSelectedUser(item, indexNum);
                    } else {
                        let inactiveIndexNum = mainArray.indexOf(item);
                        this.addToSelectedUser(item, inactiveIndexNum);
                    }
                }
            });
        } else if (this.type == 'timeFilter') {
            this.selectedTimeValue = this.filterActiveTime;
        } else if (this.type == 'moneyFilter') {
            if (this.subType != 'all') {
                let setFromValue =
                    this.singleFromActive != 'null' && this.singleFromActive
                        ? this.singleFromActive
                        : '';
                this.moneyForm.get('singleFrom')?.setValue(setFromValue);

                let setToValue =
                    this.singleToActive != 'null' && this.singleToActive
                        ? this.singleToActive
                        : '';
                this.moneyForm.get('singleTo')?.setValue(setToValue);
                if (!setFromValue) {
                    this.setButtonAvailable = false;
                }
            } else {
                let firstFromActive =
                    this.multiFromFirstFromActive &&
                    this.multiFromFirstFromActive != 'null'
                        ? this.multiFromFirstFromActive
                        : '';
                let firstToActive =
                    this.multiFromFirstToActive &&
                    this.multiFromFirstToActive != 'null'
                        ? this.multiFromFirstToActive
                        : '';

                this.moneyForm.get('multiFromFirstTo')?.setValue(firstToActive);
                this.moneyForm
                    .get('multiFromFirstFrom')
                    ?.setValue(firstFromActive);

                let secFromActive =
                    this.multiFormSecondFromActive &&
                    this.multiFormSecondFromActive != 'null'
                        ? this.multiFormSecondFromActive
                        : '';
                let secToActive =
                    this.multiFormSecondToActive &&
                    this.multiFormSecondToActive != 'null'
                        ? this.multiFormSecondToActive
                        : '';

                this.moneyForm
                    .get('multiFormSecondFrom')
                    ?.setValue(secFromActive);
                this.moneyForm.get('multiFormSecondTo')?.setValue(secToActive);

                let thirdFromActive =
                    this.multiFormThirdFromActive &&
                    this.multiFormThirdFromActive != 'null'
                        ? this.multiFormThirdFromActive
                        : '';
                let thirdToActive =
                    this.multiFormThirdToActive &&
                    this.multiFormThirdToActive != 'null'
                        ? this.multiFormThirdToActive
                        : '';

                this.moneyForm
                    .get('multiFormThirdFrom')
                    ?.setValue(thirdFromActive);
                this.moneyForm.get('multiFormThirdTo')?.setValue(thirdToActive);
            }
        } else if (this.type == 'locationFilter') {
            this.locationForm.setValue({ address: this.loactionNameSet });
            this.longVal = this.longValueSet;
            this.latVal = this.latValSet;
            this.locationRange = this.locationRangeSet;
        } else if (this.type == 'stateFilter') {
            this.usaSelectedStates = [...this.filterUsaActiveArray];
            this.canadaSelectedStates = [...this.filterCanadaActiveArray];
            this.setButtonAvailable = false;
        } else if (this.swipeFilter) {
            this.rangeValue = this.swipeActiveRange;
        }
    }

    onFilterShown() {
        this.activeFilter = true;
        this.isAnimated = true;
        let filterSearchHead = document.querySelector('.search-input-header');
        let filterTextHead = document.querySelector('.filter-text-part');
        filterSearchHead?.classList.remove('activeSearch');
        filterSearchHead?.classList.remove('inactiveSearch');

        filterTextHead?.classList.remove('activeHeader');
        filterTextHead?.classList.remove('inactiveHeader');
    }
}
