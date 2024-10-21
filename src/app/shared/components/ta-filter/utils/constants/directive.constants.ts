import { ArrayStatus } from '@shared/components/ta-filter/models/array-status.model';

export class DirectiveConstants {
    static LABEL_ARRAY: ArrayStatus[] = [
        {
            id: 1,
            name: 'Test test test',
            color: '#ff0000',
        },
        {
            id: 2,
            name: 'Test asdadasd',
            color: '#ff1234',
        },
        {
            id: 3,
            name: 'Test dddd eeee',
            color: '#ff4442',
        },
        {
            id: 4,
            name: 'Test ttttt tttttt',
            color: '#ff5858',
        },
    ];

    static UNSELECTED_USER: ArrayStatus[] = [
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

    static UNSELECTED_DISPATCHER: ArrayStatus[] = [
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

    static DEPARTMANT_ARRAY: ArrayStatus[] = [
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

    static PENDING_STATUS_ARRAY: ArrayStatus[] = [
        {
            id: 1,
            name: 'BOOKED',
            color: '#C1C1C1',
        },
        {
            id: 3,
            name: 'UNASSIGNED',
            color: '#C1C1C1',
        },
        {
            id: 2,
            name: 'ASSIGNED',
            color: '#9F9F9F',
        },
    ];

    static ACTIVE_STATUS_ARRAY: ArrayStatus[] = [
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

    static CLOSED_STATUS_ARRAY: ArrayStatus[] = [
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

    static PM_FILTER_ARRAY: ArrayStatus[] = [
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
            icon: 'assets/svg/common/category/ic_alignment.svg',
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

    static CATEGORY_FUEL_ARRAY: ArrayStatus[] = [
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

    static CATEGORY_REPAIR_ARRAY: ArrayStatus[] = [
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

    static TRUCK_ARRAY: ArrayStatus[] = [
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

    static TRAILER_ARRAY: ArrayStatus[] = [
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

    static FUEL_STOP_ARRAY: ArrayStatus[] = [
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

    static BROKER_ARRAY: ArrayStatus[] = [
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
            name: 'Everyone on time safely',
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

    static DRIVER_ARRAY: ArrayStatus[] = [
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

    static TRUCK_TYPE_ARRAY: ArrayStatus[] = [
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

    static TRAILER_TYPE_ARRAY: ArrayStatus[] = [
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
            icon: 'assets/svg/common/trailers/ic_trailer_tanker.svg',
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
        {
            id: 13,
            name: 'Tanker Pneumatic',
            icon: 'assets/svg/common/trailers/ic_trailer_tanker-pneumatic.svg',
        },
    ];

    static USA_STATES: ArrayStatus[] = [
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

    static CANADA_STATES: ArrayStatus[] = [
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
}
