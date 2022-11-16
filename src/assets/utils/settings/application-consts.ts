export interface ITrailerTypes {
    id: number;
    name: string;
    icon: string;
    color: string;
    isSelected?: boolean;
}

export interface ITruckType {
    id: number;
    name: string;
    icon: string;
    color: string;
    isSelected?: boolean;
}

export const TRAILER_TYPES: ITrailerTypes[] = [
    {
        id: 1,
        name: 'Reefer',
        icon: 'assets/svg/common/trailers/ic_trailer_reefer.svg',
        color: 'FF5454',
    },
    {
        id: 2,
        name: 'Dry Van',
        icon: 'assets/svg/common/trailers/ic_trailer_dryvan.svg',
        color: '6D82C7',
    },
    {
        id: 3,
        name: 'Side Kit',
        icon: 'assets/svg/common/trailers/ic_trailer_side-kit.svg',
        color: '56AB62',
    },
    {
        id: 4,
        name: 'Conestoga',
        icon: 'assets/svg/common/trailers/ic_trailer_conestoga.svg',
        color: '3C3C3C',
    },
    {
        id: 5,
        name: 'Dumper',
        icon: 'assets/svg/common/trailers/ic_trailer_dumper.svg',
        color: '6FDFE4',
    },
    {
        id: 6,
        name: 'Container',
        icon: 'assets/svg/common/trailers/ic_trailer_container.svg',
        color: 'F89A3D',
    },
    {
        id: 7,
        name: 'Tanker',
        icon: 'assets/svg/common/trailers/ic_trailer_tanker-liquid.svg',
        color: '1E9DF3',
    },
    {
        id: 8,
        name: 'Car Hauler',
        icon: 'assets/svg/common/trailers/ic_trailer_carhauler.svg',
        color: '59A5A5',
    },
    {
        id: 9,
        name: 'Flat Bed',
        icon: 'assets/svg/common/trailers/ic_trailer_flatbed.svg',
        color: 'A468FF',
    },
    {
        id: 10,
        name: 'Low Boy/RGN',
        icon: 'assets/svg/common/trailers/ic_trailer_low-boy.svg',
        color: 'A34CB8',
    },
    {
        id: 11,
        name: 'Chassis',
        icon: 'assets/svg/common/trailers/ic_trailer_chassis.svg',
        color: '4A9A4F',
    },
    {
        id: 12,
        name: 'Step Deck',
        icon: 'assets/svg/common/trailers/ic_trailer_step-deck.svg',
        color: 'F3D542',
    },
];

export const TRUCK_TYPE: ITruckType[] = [
    {
        id: 1,
        name: 'Semi Truck',
        icon: 'assets/svg/common/semi-truck.svg',
        color: '97D568',
    },
    {
        id: 2,
        name: 'Semi Sleeper',
        icon: 'assets/svg/common/trucks/ic_truck_semi-wSleeper.svg',
        color: 'FFB74D',
    },
    {
        id: 3,
        name: 'Box Truck',
        icon: 'assets/svg/common/trucks/ic_truck_box-truck.svg',
        color: 'E57373',
    },
    {
        id: 4,
        name: 'Cargo Van',
        icon: 'assets/svg/common/trucks/ic_truck_cargo-van.svg',
        color: '68C3FF',
    },
    {
        id: 5,
        name: 'Tow Truck',
        icon: 'assets/svg/common/trucks/ic_truck_tow-truck.svg',
        color: 'BA68C8',
    },
    {
        id: 6,
        name: 'Car Hauler',
        icon: 'assets/svg/common/trucks/ic_truck_car-hauler.svg',
        color: '59A5A5',
    },
    {
        id: 7,
        name: 'Spotter',
        icon: 'assets/svg/common/trucks/ic_truck_spotter.svg',
        color: '415FC1',
    },
];

export const USA_STATES: {
    id: number;
    name: string;
    short: string;
    isSelected?: boolean;
    hidden?: boolean;
}[] = [
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
