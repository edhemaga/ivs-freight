import { filter } from 'rxjs';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Options } from '@angular-slider/ngx-slider';
import { addressValidation } from '../ta-input/ta-input.regex-validations';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  providers: [NgbDropdownConfig],
  encapsulation: ViewEncapsulation.None,
})
export class FilterComponent implements OnInit {
  @ViewChild('t2') t2: any;

  unselectedUser: any[] = [
    {
      name: 'Aleksandar Djordjevic',
      id: 1,
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
      icon: 'assets/svg/truckassist-table/repair/ic_shop.svg',
    },
    {
      id: 3,
      name: 'Towing',
      icon: 'assets/svg/truckassist-table/repair/ic_towing.svg',
    },
    {
      id: 4,
      name: 'Parts',
      icon: 'assets/svg/truckassist-table/repair/active-shop-types/Parts.svg',
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
      icon: 'assets/svg/common/semi-truck.svg',
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
      icon: 'assets/svg/truckassist-table/trailer/low-boy-RGN.svg',
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
  filterActiveTime: any = '';
  swipeActiveRange: any = 0;

  public sliderData: Options = {
    floor: 0,
    ceil: 10,
    step: 0,
    showSelectionBar: true,
    hideLimitLabels: true,
  };

  public locationSliderData: Options = {
    floor: 0,
    ceil: 10000,
    step: 0,
    showSelectionBar: true,
    hideLimitLabels: true,
  };

  public paySliderData: Options = {
    floor: 0,
    ceil: 10000,
    step: 0,
    showSelectionBar: true,
    hideLimitLabels: false,
  };

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

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
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

    this.locationForm.valueChanges.subscribe((changes) => {
      if (changes.address == null) {
        this.locationState = '';
        this.rangeValue = 0;
      }
    });

    this.moneyForm.valueChanges.subscribe((changes) => {
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
        if (changes.singleFrom && changes.singleTo && !this.singleFormError) {
          this.moneyFilterStatus = true;
        } else {
          this.moneyFilterStatus = false;
        }
      } else {
        if (
          changes.multiFromFirstFrom &&
          changes.multiFromFirstTo &&
          !this.multiFormFirstError
        ) {
          this.moneyFilterStatus = true;
        } else if (
          changes.multiFormSecondFrom &&
          changes.multiFormSecondTo &&
          !this.multiFormSecondError
        ) {
          this.moneyFilterStatus = true;
        } else if (
          changes.multiFormThirdFrom &&
          changes.multiFormThirdTo &&
          !this.multiFormThirdError
        ) {
          this.moneyFilterStatus = true;
        } else {
          this.moneyFilterStatus = false;
        }

        if (this.multiFormFirstError) {
          this.moneyFilterStatus = false;
        }

        if (this.multiFormSecondError) {
          this.moneyFilterStatus = false;
        }

        if (this.multiFormThirdError) {
          this.moneyFilterStatus = false;
        }
      }
    });

    this.searchForm.valueChanges.subscribe((changes) => {
      if (changes.search) {
        let inputValue = changes.search;
        this.searchInputValue = inputValue;

        if (this.type == 'userFilter') {
          this.unselectedUser.map((item) => {
            item.hidden = true;
            if (item.name.toLowerCase().includes(inputValue.toLowerCase())) {
              item.hidden = false;
            }
            return item;
          });
        } else if (this.type == 'statusFilter') {
          this.pendingStatusArray.map((item) => {
            item.hidden = true;
            if (item.name.toLowerCase().includes(inputValue.toLowerCase())) {
              item.hidden = false;
            }
            return item;
          });

          this.activeStatusArray.map((item) => {
            item.hidden = true;
            if (item.name.toLowerCase().includes(inputValue.toLowerCase())) {
              item.hidden = false;
            }
            return item;
          });

          this.closedStatusArray.map((item) => {
            item.hidden = true;
            if (item.name.toLowerCase().includes(inputValue.toLowerCase())) {
              item.hidden = false;
            }
            return item;
          });
        } else if (this.type == 'truckFilter') {

          this.truckArray.map((item) => {
            item.hidden = true;
            if (item.name.toLowerCase().includes(inputValue.toLowerCase())) {
              item.hidden = false;
            }
            return item;
          });
        } else if (this.type == 'fuelStopFilter') {

          this.fuelStopArray.map((item) => {
            item.hidden = true;
            if (item.name.toLowerCase().includes(inputValue.toLowerCase())) {
              item.hidden = false;
            }
            return item;
          });
        } else if (this.type == 'trailerFilter') {
            this.trailerArray.map((item) => {
            item.hidden = true;
            if (item.name.toLowerCase().includes(inputValue.toLowerCase())) {
              item.hidden = false;
            }
            return item;
          });
        } else if (this.type == 'brokerFilter') {
          this.brokerArray.map((item) => {
            item.hidden = true;
            if (item.name.toLowerCase().includes(inputValue.toLowerCase())) {
              item.hidden = false;
            }
            return item;
          });
        } else if (this.type == 'driverFilter') {
          this.driverArray.map((item) => {
            item.hidden = true;
            if (item.name.toLowerCase().includes(inputValue.toLowerCase())) {
              item.hidden = false;
            }
            return item;
          });
        } else if (this.type == 'stateFilter') {
          this.usaStates.map((item) => {
            item.hidden = true;
            if (item.name.toLowerCase().includes(inputValue.toLowerCase())) {
              item.hidden = false;
            }
            return item;
          });

          this.canadaStates.map((item) => {
            item.hidden = true;
            if (item.name.toLowerCase().includes(inputValue.toLowerCase())) {
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

  clearAll(e?) {
    if (e) {
      e.stopPropagation();
    }

    console.log('--type--', this.type);

    if (this.type == 'timeFilter') {
      this.selectedTimeValue = '';
      this.filterActiveTime = '';
    } else {
      this.unselectedUser = [...this.unselectedUser, ...this.selectedUser];
      this.selectedUser = [];
      this.usaSelectedStates = [];
      this.canadaSelectedStates = [];

      if (this.type == 'departmentFilter') {
        this.departmentArray.map((item) => {
          item.isSelected = false;
        });
      } else if (this.type == 'statusFilter') {
        this.pendingStatusArray.map((item) => {
          item.isSelected = false;
        });

        this.activeStatusArray.map((item) => {
          item.isSelected = false;
        });

        this.closedStatusArray.map((item) => {
          item.isSelected = false;
        });
      } else if (this.type == 'pmFilter') {
        this.pmFilterArray.map((item) => {
          item.isSelected = false;
        });
      } else if (this.type == 'categoryFuelFilter') {
        this.categoryFuelArray.map((item) => {
          item.isSelected = false;
        });
      } else if (this.type == 'categoryRepairFilter') {
        this.categoryRepairArray.map((item) => {
          item.isSelected = false;
        });
      } else if (this.type == 'truckFilter') {
        this.truckArray.map((item) => {
          item.isSelected = false;
        });
      } else if (this.type == 'trailerFilter') {
        this.trailerArray.map((item) => {
          item.isSelected = false;
        });
      } else if (this.type == 'brokerFilter') {
        this.brokerArray.map((item) => {
          item.isSelected = false;
        });
      } else if (this.type == 'driverFilter') {
        this.driverArray.map((item) => {
          item.isSelected = false;
        });
      } else if (this.type == 'truckTypeFilter') {
        this.truckTypeArray.map((item) => {
          item.isSelected = false;
        });
      } else if (this.type == 'userFilter') {
        this.unselectedUser.map((item) => {
          item.isSelected = false;
        });
      } else if (this.type == 'stateFilter') {
        this.usaStates.map((item) => {
          item.isSelected = false;
        });

        this.canadaStates.map((item) => {
          item.isSelected = false;
        });
      } else if (
        this.type == 'injuryFilter' ||
        this.type == 'fatalityFilter' ||
        this.type == 'violationFilter'
      ) {
        this.rangeValue = 0;
      } else if (this.type == 'locationFilter') {
        this.rangeValue = 0;
        this.locationForm.setValue({
          address: '',
        });
      } else if (this.type == 'moneyFilter') {
        if (this.subType != 'all') {
          this.clearForm('singleForm');
        } else {
          this.clearForm('clearAll');
        }
      }
    }
    this.setButtonAvailable = true;
    this.filterActiveArray = [];
    this.swipeActiveRange = 0;
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

  addToSelectedDispatcher(indx, item) {
    this.unselectedDispatcher.splice(indx, 1);
    this.selectedDispatcher.push(item);
  }

  removeFromSelectedDispatcher(item, indx) {
    this.selectedDispatcher.splice(indx, 1);
    this.unselectedDispatcher.push(item);
  }

  filterDispatcher(e: any) {
    const inputValue = e.target.value;
    this.unselectedDispatcher.filter((item) => {
      item.hidden = true;
      if (item.name.toLowerCase().includes(inputValue.toLowerCase())) {
        item.hidden = false;
      }
      return item;
    });
  }

  clearAllDispatcher() {
    this.unselectedDispatcher = [
      ...this.unselectedDispatcher,
      ...this.selectedDispatcher,
    ];
    this.selectedDispatcher = [];
  }

  hideOtherToolTips(e) {
    document.querySelectorAll('.box-icons').forEach((parentElement) => {
      //console.log('---parentElement----', parentElement);
    });
  }

  backOtherToolTips(e) {
    document.querySelectorAll('.box-icons').forEach((parentElement) => {
      //parentElement.style.pointerEvents = 'auto';
      //parentElement.classList.remove('hideEventsOnBox');
    });
  }

  setTimeValue(mod) {
    this.selectedTimeValue = mod;

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
    if (mod) {
      this.expandSearch = false;
    } else {
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
    this.rangeValue = mod;
  }

  handleInputSelect(e) {
    if (e?.address?.address) {
      this.locationState = e.address.address;
      this.rangeValue = 3000;
    }
  }

  clearForm(mod) {
    if (mod == 'singleForm') {
      this.singleFormError = false;
      this.moneyFilterStatus = false;
      this.moneyForm.setValue({
        singleFrom: '',
        singleTo: '',
        multiFromFirstFrom: this.moneyForm.value.multiFromFirstFrom,
        multiFromFirstTo: this.moneyForm.value.multiFromFirstTo,
        multiFormSecondFrom: this.moneyForm.value.multiFormSecondFrom,
        multiFormSecondTo: this.moneyForm.value.multiFormSecondTo,
        multiFormThirdFrom: this.moneyForm.value.multiFormThirdFrom,
        multiFormThirdTo: this.moneyForm.value.multiFormThirdTo,
      });
    } else if (mod == 'multiFromFirst') {
      this.multiFormFirstError = false;
      this.moneyForm.setValue({
        singleFrom: this.moneyForm.value.singleFrom,
        singleTo: this.moneyForm.value.singleTo,
        multiFromFirstFrom: '',
        multiFromFirstTo: '',
        multiFormSecondFrom: this.moneyForm.value.multiFormSecondFrom,
        multiFormSecondTo: this.moneyForm.value.multiFormSecondTo,
        multiFormThirdFrom: this.moneyForm.value.multiFormThirdFrom,
        multiFormThirdTo: this.moneyForm.value.multiFormThirdTo,
      });
    } else if (mod == 'multiFormSecond') {
      this.multiFormSecondError = false;
      this.moneyForm.setValue({
        singleFrom: this.moneyForm.value.singleFrom,
        singleTo: this.moneyForm.value.singleTo,
        multiFromFirstFrom: this.moneyForm.value.multiFromFirstFrom,
        multiFromFirstTo: this.moneyForm.value.multiFromFirstTo,
        multiFormSecondFrom: '',
        multiFormSecondTo: '',
        multiFormThirdFrom: this.moneyForm.value.multiFormThirdFrom,
        multiFormThirdTo: this.moneyForm.value.multiFormThirdTo,
      });
    } else if (mod == 'multiFormThird') {
      this.multiFormThirdError = false;
      this.moneyForm.setValue({
        singleFrom: this.moneyForm.value.singleFrom,
        singleTo: this.moneyForm.value.singleTo,
        multiFromFirstFrom: this.moneyForm.value.multiFromFirstFrom,
        multiFromFirstTo: this.moneyForm.value.multiFromFirstTo,
        multiFormSecondFrom: this.moneyForm.value.multiFormSecondFrom,
        multiFormSecondTo: this.moneyForm.value.multiFormSecondTo,
        multiFormThirdFrom: '',
        multiFormThirdTo: '',
      });
    } else if (mod == 'clearAll') {
      this.multiFormFirstError = false;
      this.multiFormSecondError = false;
      this.multiFormThirdError = false;
      this.moneyForm.setValue({
        singleFrom: '',
        singleTo: '',
        multiFromFirstFrom: '',
        multiFromFirstTo: '',
        multiFormSecondFrom: '',
        multiFormSecondTo: '',
        multiFormThirdFrom: '',
        multiFormThirdTo: '',
      });
    }
  }

  setFilter(e) {
    const element = e.target;
    if (element.classList.contains('active')) {
      this.setButtonAvailable = false;

      if (this.type == 'timeFilter') {
        this.filterActiveTime = this.selectedTimeValue;
      } else if (this.swipeFilter) {
        this.swipeActiveRange = this.rangeValue;
      } else {
        this.filterActiveArray = [...this.selectedUser];
      }
    } else {
      return false;
    }
  }

  checkFilterActiveValue() {
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

    //console.log('--stringfy1', stringfy1);
    //console.log('--stringfy2', stringfy2);

    if (stringfy1 == stringfy2) {
      this.setButtonAvailable = false;
    } else {
      this.setButtonAvailable = true;
    }
  }
}
