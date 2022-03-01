export const DRIVER_PHOTO = 'driver-photo';
export const COMPANY_LARGE_LOGO = 'company-large-logo';
export const COMPANY_SMALL_LOGO = 'company-small-logo';

export const GENDERS = [
  {
    id: 'male',
    name: 'Male',
  },
  {
    id: 'female',
    name: 'Female',
  },
];

export const LOAD_STATUS = [
  {
    id: 0,
    name: 'UNASSIGNED',
    color: '#959595',
    selected: false,
    approved: false,
    group: 'PENDING'
  },
  {
    id: 1,
    name: 'ASSIGNED',
    color: '#202020',
    selected: false,
    approved: false,
    group: 'PENDING'
  },
  {
    id: 2,
    name: 'DISPATCHED',
    color: '#497BDC',
    selected: false,
    approved: false,
    group: 'ACTIVE'
  },
  {
    id: 3,
    name: 'LOADED',
    color: '#207E4C',
    selected: false,
    approved: false,
    group: 'ACTIVE'
  },
  {
    id: 4,
    name: 'CANCELED',
    color: '#AE3232',
    selected: false,
    approved: false,
    group: 'CLOSED'
  },
  {
    id: 5,
    name: 'TONU',
    color: '#FF5D5D',
    selected: false,
    approved: false,
    group: 'CLOSED'
  },
  {
    id: 6,
    name: 'DELIVERED',
    color: '#F99E00',
    selected: false,
    approved: false,
    group: 'CLOSED'
  },
  {
    id: 7,
    name: 'HOLD',
    color: '#C9C9C9',
    selected: false,
    approved: false,
    group: 'CLOSED'
  },
  // MVR statuses
  {
    id: 8,
    name: 'PENDING',
    color: '#FFA85D',
    selected: false,
    approved: false,
    group: 'PENDING'
  },
  {
    id: 9,
    name: 'COMPLETE',
    color: '#24C1A1',
    selected: false,
    approved: false,
    group: 'COMPLETE'
  },
  {
    id: 10,
    name: 'DECLINED',
    color: '#FF5D5D',
    selected: false,
    approved: false,
    group: 'DECLINED'
  },
  // End MVR statuses
  {
    id: 1000,
    name: 'INVOICED',
    color: '#BFB580',
    selected: false,
    approved: false,
    group: 'BILLED'
  },
  {
    id: 1070,
    name: 'HOLD',
    color: '#C9C9C9',
    type: 'I',
    typeColor: '#CFC8A3',
    selected: false,
    approved: false,
    group: 'BILLED'
  },
  {
    id: 1100,
    name: 'REVISED',
    color: '#B7B7B7',
    selected: false,
    approved: false,
    group: 'BILLED'
  },
  {
    id: 1200,
    name: 'PAID',
    color: '#9F9A7B',
    selected: false,
    approved: false,
    group: 'BILLED'
  },
  {
    id: 1300,
    name: 'SHORT-PAID',
    color: '#807B65',
    selected: false,
    approved: false,
    group: 'BILLED'
  },
  {
    id: 1400,
    name: 'UNPAID',
    color: '#65614D',
    selected: false,
    approved: false,
    group: 'BILLED'
  },
  {
    id: 1500,
    name: 'CLAIM',
    color: '#514E40',
    selected: false,
    approved: false,
    group: 'BILLED'
  },
  {
    id: 1112, // 1211
    name: 'PAID',
    color: '#9F9A7B',
    type: 'R',
    typeColor: '#B7B7B7',
    selected: false,
    approved: false,
    group: 'BILLED'
  },
  {
    id: 1113, // 1311
    name: 'SHORT-PAID',
    color: '#807B65',
    type: 'R',
    typeColor: '#B7B7B7',
    selected: false,
    approved: false,
    group: 'BILLED'
  },
  {
    id: 1114, // 1411
    name: 'UNPAID',
    color: '#65614D',
    type: 'R',
    typeColor: '#B7B7B7',
    selected: false,
    approved: false,
    group: 'BILLED'
  },
  {
    id: 1115, // 1511
    name: 'CLAIM',
    color: '#514E40',
    type: 'R',
    typeColor: '#B7B7B7',
    selected: false,
    approved: false,
    group: 'BILLED'
  },
  {
    id: 5010, // 1005
    name: 'INVOICED',
    color: '#BFB580',
    type: 'T',
    typeColor: '#FF5D5D',
    selected: false,
    approved: false,
    group: 'BILLED'
  },
  {
    id: 5012, // 1205
    name: 'PAID',
    color: '#9F9A7B',
    type: 'T',
    typeColor: '#FF5D5D',
    selected: false,
    approved: false,
    group: 'BILLED'
  },
  {
    id: 5013, // 1305
    name: 'SHORT-PAID',
    color: '#807B65',
    type: 'T',
    typeColor: '#FF5D5D',
    selected: false,
    approved: false,
    group: 'BILLED'
  },
  {
    id: 5014, // 1405
    name: 'UNPAID',
    color: '#65614D',
    type: 'T',
    typeColor: '#FF5D5D',
    selected: false,
    approved: false,
    group: 'BILLED'
  },
  {
    id: 5015, // 1505
    name: 'CLAIM',
    color: '#514E40',
    type: 'T',
    typeColor: '#FF5D5D',
    selected: false,
    approved: false,
    group: 'BILLED'
  }
];

// TODO: use color from LOAD_STATUS array insetad of classes
// export const LOAD_STATUS_ARRAY = {
//   0: 'Unassigned',
//   1: 'Assigned',
//   2: 'Dispatched',
//   3: 'Loaded',
//   4: 'Canceled',
//   5: 'Tonu',
//   6: 'Delivered',
//   1000: 'Invoiced',
//   1100: 'Paid',
//   1200: 'ShortPaid',
//   1300: 'Unpaid',
//   1400: 'Claim',
//   1050: 'TonuInvoiced',
//   1150: 'TonuPaid',
// };

export const DISPATCH_BOARD_STATUS = [
  {
    id: 0,
    name: 'OFF',
    sort: 1,
    color: '#C1C1C1'
  },
  {
    id: 1000,
    name: 'ACTIVE',
    sort: 2,
    color: '#508F91'
  },
  {
    id: 2000,
    name: 'DISPATCHED',
    sort: 3,
    color: '#7FA2E6'
  },
  {
    id: 3000,
    name: 'CHECKED IN',
    sort: 4,
    color: '#60D5BD'
  },
  {
    id: 3100,
    name: 'CHECKED IN', // with number - CHECKED IN 1
    load_count: 1,
    sort: 5,
    color: '#CCCCCC'
  },
  {
    id: 3200,
    name: 'LOADED', // with number - LOADED 1
    load_count: 1,
    sort: 6,
    color: '#207E4C'
  },
  {
    id: 4000,
    name: 'LOADED',
    sort: 7,
    color: '#74BF97'
  },
  {
    id: 4070,
    name: 'REPAIR',
    load_repear: true,
    sort: 12,
    color: '#C29FCB'
  },
  {
    id: 5000,
    name: 'CHECKED IN',
    sort: 9,
    color: '#FFA7A7'
  },
  {
    id: 5100,
    name: 'CHECKED IN', // with number - CHECKED IN 1 - this in delivered
    load_count: 1,
    sort: 10,
    color: '#CCCCCC'
  },
  {
    id: 5200,
    name: 'OFFLOADED',
    load_count: 1,
    sort: 11,
    color: '#FFBF6B'
  },
  {
    id: 6000,
    name: 'EMPTY',
    sort: 11,
    color: '#FFBF6B'
  },
  {
    id: 7000,
    name: 'REPAIR SHOP',
    sort: 12,
    color: '#C29FCB'
  },
  {
    id: 8000,
    name: 'DEAD HEADING',
    sort: 12,
    color: '#9F9F9F'
  },
  {
    id: 9000,
    name: 'CANCEL',
    sort: 12,
    color: '#E27579'
  },
];

export const ADDITION_TYPE_LIST = [
  {
    id: 1,
    name: 'Lumper',
    formName: 'lumper',
  },
  {
    id: 2,
    name: 'Detention',
    formName: 'detention',
  },
  {
    id: 3,
    name: 'Layover',
    formName: 'layover',
  },
  {
    id: 4,
    name: 'Fuel surch.',
    formName: 'fuelSurch',
  },
  {
    id: 5,
    name: 'Escort',
    formName: 'escort',
  },
  {
    id: 5,
    name: 'Misc.',
    formName: 'misc',
  },
  // {
  //   id: 6,
  //   name: 'Scale Ticket',
  // },
  // {
  //   id: 7,
  //   name: 'Misc Acces.',
  // },
];

export const GOOGLE_MAP_STYLES = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dadada',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#c9c9c9',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
];

export const NORTH_AMERICA_BOUNDS = {
  north: 75,
  south: 9,
  west: -170,
  east: -50,
};

export const LEFT_NAV_ARROW = '<i class="nav-arrow left-nav-arrow"></i>';
export const RIGHT_NAV_ARROW = '<i class="nav-arrow right-nav-arrow"></i>';

export const TRUCK_LIST = [
  {
    type: 'truck',
    name: 'Semi Truck',
    file: 'semi-truck.svg',
    class: 'semi-truck-icon',
    whiteFile: 'white-semi-truck.svg',
    color: '90BC6F',
    legendcolor: '90bc6f',
  },
  {
    type: 'truck',
    name: 'Semi w/Sleeper',
    file: 'semi-wsleeper.svg',
    class: 'semi-wsleeper-icon',
    whiteFile: 'white-semi-wsleeper.svg',
    color: 'FFC061',
    legendcolor: 'ffc061',
  },
  {
    type: 'truck',
    name: 'Box Truck',
    file: 'box-truck.svg',
    class: 'box-truck-icon',
    whiteFile: 'white-box-truck.svg',
    color: 'EF6E6E',
    legendcolor: 'ef6e6e',
  },
  {
    type: 'truck',
    name: 'Cargo Van',
    file: 'cargo-van.svg',
    class: 'cargo-van-icon',
    whiteFile: 'white-cargo-van.svg',
    color: '78C7FC',
    legendcolor: '78c7fc',
  },
  {
    type: 'truck',
    name: 'Tow Truck',
    file: 'tow-truck.svg',
    class: 'tow-truck-icon',
    whiteFile: 'white-tow-truck.svg',
    color: '90659B',
    legendcolor: '90659b',
  },
  {
    type: 'truck',
    name: 'Car Hauler',
    file: 'car-hauler.svg',
    class: 'truck-hauler-icon',
    whiteFile: 'white-car-hauler.svg',
    color: '668888',
    legendcolor: '668888',
  }
];

export const TRUCK_LIST_APPLICANTS = [
  {
    type: 'truck',
    name: 'Semi Truck',
    file: 'semi-truck.svg',
    class: 'semi-truck-icon',
    whiteFile: 'white-semi-truck.svg',
    color: '90BC6F',
    legendcolor: '90bc6f',
  },
  {
    type: 'truck',
    name: 'Semi w/Sleeper',
    file: 'semi-wsleeper.svg',
    class: 'semi-wsleeper-icon',
    whiteFile: 'white-semi-wsleeper.svg',
    color: 'FFC061',
    legendcolor: 'ffc061',
  },
  {
    type: 'truck',
    name: 'Box Truck',
    file: 'box-truck.svg',
    class: 'box-truck-icon',
    whiteFile: 'white-box-truck.svg',
    color: 'EF6E6E',
    legendcolor: 'ef6e6e',
  },
  {
    type: 'truck',
    name: 'Cargo Van',
    file: 'cargo-van.svg',
    class: 'cargo-van-icon',
    whiteFile: 'white-cargo-van.svg',
    color: '78C7FC',
    legendcolor: '78c7fc',
  },
  {
    type: 'truck',
    name: 'Tow Truck',
    file: 'tow-truck.svg',
    class: 'tow-truck-icon',
    whiteFile: 'white-tow-truck.svg',
    color: '90659B',
    legendcolor: '90659b',
  },
  {
    type: 'truck',
    name: 'Car Hauler',
    file: 'car-hauler.svg',
    class: 'truck-hauler-icon',
    whiteFile: 'white-car-hauler.svg',
    color: '668888',
    legendcolor: '668888',
  },
  {
    type: 'truck',
    name: 'Bus',
    file: 'bus.svg',
    class: 'bus-icon',
    whiteFile: 'white-bus.svg',
    color: 'EED070',
    legendcolor: 'eed070',
  },
  {
    type: 'truck',
    name: 'Motorcycle',
    file: 'motorcycle.svg',
    class: 'motorcycle-icon',
    whiteFile: 'white-motorcycle.svg',
    color: '7081DB',
    legendcolor: '7081db',
  },
  {
    type: 'truck',
    name: 'Pers. Vehicle',
    file: 'personal-vehicle.svg',
    class: 'personalvehicle-icon',
    whiteFile: 'white-personalvehicle.svg',
    color: '78D1B5',
    legendcolor: '78d1b5',
  },
];

export const TRAILER_LIST = [
  {
    type: 'trailer',
    name: 'Reefer',
    file: 'reefer.svg',
    class: 'reefer-icon',
    whiteFile: 'white-reefer.svg',
    color: 'EF6E6E',
    legendcolor: 'ef6e6e',
  },
  {
    type: 'trailer',
    name: 'Dry Van',
    file: 'dry-van.svg',
    class: 'dry-van-icon',
    whiteFile: 'white-dry-van.svg',
    color: '5673AA',
    legendcolor: '5673aa',
  },
  {
    type: 'trailer',
    name: 'Side Kit',
    file: 'side-kit.svg',
    class: 'side-kit-icon',
    whiteFile: 'white-side-kit.svg',
    color: '76A77D',
    legendcolor: '76a77d',
  },
  {
    type: 'trailer',
    name: 'Conestoga',
    file: 'conestoga.svg',
    class: 'conestoga-icon',
    whiteFile: 'white-conestoga.svg',
    color: '484848',
    legendcolor: '484848',
  },
  {
    type: 'trailer',
    name: 'Dumper',
    file: 'dumper.svg',
    class: 'dumper-icon',
    whiteFile: 'white-dumper.svg',
    color: '8FDEE1',
    legendcolor: '8fdee1',
  },
  {
    type: 'trailer',
    name: 'Container',
    file: 'container.svg',
    class: 'container-icon',
    whiteFile: 'white-container.svg',
    color: 'FFBE7D',
    legendcolor: 'ffbe7d',
  },
  {
    type: 'trailer',
    name: 'Tanker',
    file: 'tanker.svg',
    class: 'tanker-icon',
    whiteFile: 'white-tanker.svg',
    color: '81CCFF',
    legendcolor: '81ccff',
  },
  {
    type: 'trailer',
    name: 'Car Hauler',
    file: 'car-hauler.svg',
    class: 'trailer-hauler-icon',
    whiteFile: 'white-car-hauler.svg',
    color: '668888',
    legendcolor: '668888',
  },
  {
    type: 'trailer',
    name: 'Flat Bed',
    file: 'flat-bed.svg',
    class: 'flat-bed-icon',
    whiteFile: 'white-flat-bed.svg',
    color: 'AF88EA',
    legendcolor: 'af88ea',
  },
  {
    type: 'trailer',
    name: 'Low Boy/RGN',
    file: 'low-boy-RGN.svg',
    class: 'low-boy-rgn-icon',
    whiteFile: 'white-low-boy-RGN.svg',
    color: '955FA2',
    legendcolor: '955fa2',
  },
  {
    type: 'trailer',
    name: 'Chassis',
    file: 'chassis.svg',
    class: 'chassis-icon',
    whiteFile: 'white-chassis.svg',
    color: '547556',
    legendcolor: '547556',
  },
  {
    type: 'trailer',
    name: 'Step Deck',
    file: 'step-deck.svg',
    class: 'step-deck-icon',
    whiteFile: 'white-step-deck.svg',
    color: 'F2DD75',
    legendcolor: 'f2dd75',
  },
];

export const TRUCK_MAKERS = [
  {
    name: 'Chevrolet',
    file: 'chevrolet.svg',
    color: '',
  },
  {
    name: 'Ford',
    file: 'ford.svg',
    color: '',
  },
  {
    name: 'Freightliner',
    file: 'freightliner.svg',
    color: '',
  },
  {
    name: 'Gmc',
    file: 'gmc.svg',
    color: '',
  },
  {
    name: 'Hino',
    file: 'hino.svg',
    color: '',
  },
  {
    name: 'International',
    file: 'international.svg',
    color: '',
  },
  {
    name: 'Isuzu',
    file: 'isuzu.svg',
    color: '',
  },
  {
    name: 'Kenworth',
    file: 'kenworth.svg',
    color: '',
  },
  {
    name: 'Mack',
    file: 'mack.svg',
    color: '',
  },
  {
    name: 'Peterbilt',
    file: 'peterbilt.svg',
    color: '',
  },
  {
    name: 'Volvo',
    file: 'volvo.svg',
    color: '',
  },
  {
    name: 'Westernstar',
    file: 'westernstar.svg',
    color: '',
  },
];

export const TRAILER_MAKERS = [
  {
    name: 'Dorsey',
    file: 'dorsey.svg',
    color: '',
  },
  {
    name: 'East',
    file: 'east.svg',
    color: '',
  },
  {
    name: 'Fontaine',
    file: 'fontaine.svg',
    color: '',
  },
  {
    name: 'Fruehauf',
    file: 'fruehauf.svg',
    color: '',
  },
  {
    name: 'Great Dane',
    file: 'great-dane.svg',
    color: '',
  },
  {
    name: 'Hyundai',
    file: 'hyundai.svg',
    color: '',
  },
  {
    name: 'Manac',
    file: 'manac.svg',
    color: '',
  },
  {
    name: 'Strick',
    file: 'strick.svg',
    color: '',
  },
  {
    name: 'Utility',
    file: 'utility.svg',
    color: '',
  },
  {
    name: 'Vanguard',
    file: 'vanguard.svg',
    color: '',
  },
  /* {
    name: 'Wabash National',
    file: 'wabash.svg',
    color: '',
  }, */
  {
    name: 'Wabash National',
    file: 'wabash-national.svg',
    color: '',
  },
  {
    name: 'Wilson',
    file: 'wilson.svg',
    color: '',
  },
];

export const CURRENCIES = [
  {
    id: 1,
    code: 'usd',
    symbol: '$',
    name: '$ - USD',
  },
  {
    id: 2,
    code: 'cad',
    symbol: '$',
    name: '$ - CAD',
  },
  {
    id: 3,
    code: 'eur',
    symbol: '€',
    name: '€ - EUR',
  },
  {
    id: 4,
    code: 'chf',
    symbol: 'Fr.',
    name: 'Fr. - CHF',
  },
];

/* export const USER_TYPES = [
  {
    id: 'company_owner',
    name: 'Owner',
  },
  {
    id: 'admin',
    name: 'Admin',
  },
  {
    id: 'dispatcher',
    name: 'Dispatcher',
  },
]; */
export const USER_TYPES = [
  {
    id: 'admin',
    name: 'Admin',
  },
  {
    id: 'dispatcher',
    name: 'Dispatcher',
  },
];

export const TIME_ZONES = [
  {
    id: 1,
    name: '(UTC-8) Alaska Daylight Time',
    offset: -8
  },
  {
    id: 2,
    name: '(UTC-7) Pacific Daylight Time',
    offset: -7
  },
  {
    id: 3,
    name: '(UTC-7) Mountain Standard Time',
    offset: -7
  },
  {
    id: 4,
    name: '(UTC-6) Mountain Daylight Time',
    offset: -6
  },
  {
    id: 5,
    name: '(UTC-5) Central Daylight Time',
    offset: -5
  },
  {
    id: 6,
    name: '(UTC-4) Eastern Daylight Time',
    offset: -4
  }
];

export const PAY_PERIODS = [
  {
    id: 'weekly',
    name: 'Weekly',
  },
  {
    id: 'bi-weekly',
    name: 'Bi-weekly',
  },
  {
    id: 'monthly',
    name: 'Monthly',
  },
];

export const DAYS = [
  {
    id: 'monday',
    name: 'Monday',
  },
  {
    id: 'tuesday',
    name: 'Tuesday',
  },
  {
    id: 'wednesday',
    name: 'Wednesday',
  },
  {
    id: 'thursday',
    name: 'Thursday',
  },
  {
    id: 'friday',
    name: 'Friday',
  },
];

export const REEFERUNITS = [
  {
    id: 1,
    name: 'Thermo King',
  },
  {
    id: 2,
    name: 'Carrier',
  },
];

export const FILE_TABLES = {
  ACCIDENT: 'Accident',
  VIOLATION: 'Violation',
  BROKER: 'Broker',
  COMMENT: 'Comment',
  COMPANY: 'Company',
  COMPANY_USER: 'CompanyUser',
  DOCUMENT: 'Document',
  DRIVER: 'Driver',
  FUEL: 'Fuel',
  INVOICE_COMPANY: 'InvoiceCompany',
  MAINTENANCE: 'Maintenance',
  OWNER: 'Owner',
  PACKAGE: 'Package',
  PAYROLL_DRIVER: 'PayrollDriver',
  PAYROLL_OWNER: 'PayrollOwner',
  REPAIR_SHOP: 'RepairShop',
  SCHEDULER: 'Scheduler',
  SHIPPER: 'Shipper',
  STORAGE: 'Storage',
  TEST: 'Test',
  TODO: 'Todo',
  TRAILER: 'Trailer',
  TRUCK: 'Truck',
  TRUCK_LOAD: 'Truckload',
  USER: 'User'
};
