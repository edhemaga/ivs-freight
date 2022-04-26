import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MockModalService {
  public truckType: any[] = [
    {
      id: 1,
      name: 'Semi Truck',
      svg: 'ic_truck_semi-truck.svg',
      folder: 'common',
      subFolder: 'trucks',
    },
    {
      id: 2,
      name: 'Semi Sleeper',
      svg: 'ic_truck_semi-wSleeper.svg',
      folder: 'common',
      subFolder: 'trucks',
    },
    {
      id: 3,
      name: 'Box Truck',
      svg: 'ic_truck_box-truck.svg',
      folder: 'common',
      subFolder: 'trucks',
    },
    {
      id: 4,
      name: 'Cargo Van',
      svg: 'ic_truck_cargo-van.svg',
      folder: 'common',
      subFolder: 'trucks',
    },
    {
      id: 5,
      name: 'Tow Truck',
      svg: 'ic_truck_tow-truck.svg',
      folder: 'common',
      subFolder: 'trucks',
    },
    {
      id: 6,
      name: 'Car Hauler',
      svg: 'ic_truck_car-hauler.svg',
      folder: 'common',
      subFolder: 'trucks',
    },
  ];

  public truckMakeType: any[] = [
    {
      id: 1,
      name: 'CHEVROLET',
    },
    {
      id: 2,
      name: 'Ford',
    },
    {
      id: 3,
      name: 'GMC',
    },
    {
      id: 4,
      name: 'HINO',
    },
    {
      id: 5,
      name: 'ISUZU',
    },
    {
      id: 6,
      name: 'INTERNATIONAL',
    },
    {
      id: 7,
      name: 'KENWORTH',
    },
    {
      id: 8,
      name: 'MACK',
    },
    {
      id: 9,
      name: 'VOLVO',
    },
  ];

  public colorType: any[] = [
    {
      id: 1,
      name: 'Black',
      svg: 'ic_color.svg',
      folder: 'common',
      subFolder: 'colors',
    },
    {
      id: 2,
      name: 'Brown',
      svg: 'ic_color.svg',
      folder: 'common',
      subFolder: 'colors',
    },
    {
      id: 3,
      name: 'Dark Green',
      svg: 'ic_color.svg',
      folder: 'common',
      subFolder: 'colors',
    },
    {
      id: 4,
      name: 'Light Green',
      svg: 'ic_color.svg',
      folder: 'common',
      subFolder: 'colors',
    },
    {
      id: 5,
      name: 'Dark Blue',
      svg: 'ic_color.svg',
      folder: 'common',
      subFolder: 'colors',
    },
    {
      id: 6,
      name: 'Light Blue',
      svg: 'ic_color.svg',
      folder: 'common',
      subFolder: 'colors',
    },
    {
      id: 7,
      name: 'Gray',
      svg: 'ic_color.svg',
      folder: 'common',
      subFolder: 'colors',
    },
    {
      id: 8,
      name: 'Purple',
      svg: 'ic_color.svg',
      folder: 'common',
      subFolder: 'colors',
    },
    {
      id: 9,
      name: 'Gold',
      svg: 'ic_color.svg',
      folder: 'common',
      subFolder: 'colors',
    },
    {
      id: 10,
      name: 'Silver',
      svg: 'ic_color.svg',
      folder: 'common',
      subFolder: 'colors',
    },
    {
      id: 11,
      name: 'Red',
      svg: 'ic_color.svg',
      folder: 'common',
      subFolder: 'colors',
    },
    {
      id: 12,
      name: 'Pink',
      svg: 'ic_color.svg',
      folder: 'common',
      subFolder: 'colors',
    },
    {
      id: 13,
      name: 'White',
      svg: 'ic_color.svg',
      folder: 'common',
      subFolder: 'colors',
    },
    {
      id: 14,
      name: 'Orange',
      svg: 'ic_color.svg',
      folder: 'common',
      subFolder: 'colors',
    },
    {
      id: 15,
      name: 'Yellow',
      svg: 'ic_color.svg',
      folder: 'common',
      subFolder: 'colors',
    },
  ];

  public ownerTabs: any[] = [
    {
      id: 'sole',
      name: 'Sole Proprietor',
      checked: true,
    },
    {
      id: 'company',
      name: 'Company',
      checked: false,
    },
  ];

  public labelsBank: any[] = [
    {
      id: 1,
      name: 'Bank Of America',
      svg: 'ic_bankAccount_dummy.svg',
      folder: 'common',
    },
    {
      id: 2,
      name: 'Bank Of Serbia',
      svg: 'ic_bankAccount_dummy.svg',
      folder: 'common',
    },
    {
      id: 2,
      name: 'Unicredit Bank',
      svg: '',
      folder: 'common',
    },
  ];

  public labelsPayType: any[] = [
    {
      id: 1,
      name: 'Per mile',
    },
    {
      id: 2,
      name: 'Commission',
    },
  ];

  public grossWeight: any[] = [
    {
      id: 1,
      name: 'A - 55,000 lbs.',
    },
    {
      id: 2,
      name: 'B - 55,001 - 56,000 lbs.',
    },
    {
      id: 3,
      name: 'C - 56,001 - 57,000 lbs.',
    },
    {
      id: 4,
      name: 'D - 57,001 - 58,000 lbs.',
    },
    {
      id: 5,
      name: 'E - 58,001 - 59,000 lbs.',
    },
    {
      id: 6,
      name: 'F - 59,001 - 60,000 lbs.',
    },
  ];

  public engineType: any[] = [
    {
      id: 1,
      name: 'Cummins 3.9L',
    },
    {
      id: 2,
      name: 'Cummins 5.9L',
    },
    {
      id: 3,
      name: 'Cummins 8.3L',
    },
    {
      id: 4,
      name: 'Cummins L9',
    },
    {
      id: 5,
      name: 'Cummins L9N',
    },
    {
      id: 6,
      name: 'Cummins L10',
    },
    {
      id: 7,
      name: 'Cummins L10N',
    },
  ];

  public tireSize: any[] = [
    {
      id: 1,
      name: '10R - 17.5',
    },
    {
      id: 2,
      name: '215 - 75 - 17.5',
    },
    {
      id: 3,
      name: '235 - 75 - 17.5',
    },
    {
      id: 4,
      name: '245-70-17.5',
    },
    {
      id: 5,
      name: '8R-19.5',
    },
    {
      id: 6,
      name: '225-70-19.5',
    },
    {
      id: 7,
      name: '245-70-19.5',
    }
  ]

  public ownerType: any[] = [
    {
      id: 1,
      name: 'Purchase'
    },
    {
      id: 2,
      name: 'Sale'
    }
  ]
}
