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
      name: 'Semi w/Sleeper',
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

  public trailerType: any[] = [
    {
      id: 1,
      name: 'Reefer',
      svg: 'ic_trailer_reefer.svg',
      folder: 'common',
      subFolder: 'trailers',
    },
    {
      id: 2,
      name: 'Dry Van',
      svg: 'ic_trailer_dryvan.svg',
      folder: 'common',
      subFolder: 'trailers',
    },
    {
      id: 3,
      name: 'Side Kit',
      svg: 'ic_trailer_side-kit.svg',
      folder: 'common',
      subFolder: 'trailers',
    },
    {
      id: 4,
      name: 'Conestoga',
      svg: 'ic_trailer_conestoga.svg',
      folder: 'common',
      subFolder: 'trailers',
    },
    {
      id: 5,
      name: 'Dumper',
      svg: 'ic_trailer_dumper.svg',
      folder: 'common',
      subFolder: 'trailers',
    },
    {
      id: 6,
      name: 'Container',
      svg: 'ic_trailer_container.svg',
      folder: 'common',
      subFolder: 'trailers',
    },
    {
      id: 7,
      name: 'Tanker',
      svg: 'ic_trailer_tanker.svg',
      folder: 'common',
      subFolder: 'trailers',
    },
    {
      id: 8,
      name: 'Car Hauler',
      svg: 'ic_trailer_carhauler.svg',
      folder: 'common',
      subFolder: 'trailers',
    },
    {
      id: 9,
      name: 'Flat Bed',
      svg: 'ic_trailer_flatbed.svg',
      folder: 'common',
      subFolder: 'trailers',
    },
    {
      id: 9,
      name: 'Low Boy/RGN',
      svg: 'ic_trailer_low-boy.svg',
      folder: 'common',
      subFolder: 'trailers',
    },
    {
      id: 10,
      name: 'Chassis',
      svg: 'ic_trailer_chassis.svg',
      folder: 'common',
      subFolder: 'trailers',
    },
    {
      id: 11,
      name: 'Step Deck',
      svg: 'ic_trailer_step-deck.svg',
      folder: 'common',
      subFolder: 'trailers',
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

  public trailerMakeType: any[] = [
    {
      id: 1,
      name: 'DORSEY',
    },
    {
      id: 2,
      name: 'EAST',
    },
    {
      id: 3,
      name: 'FONTAINE',
    },
    {
      id: 4,
      name: 'FRUENHAUF',
    },
    {
      id: 5,
      name: 'Great Dane',
    },
    {
      id: 6,
      name: 'Hudson Bros.',
    },
    {
      id: 7,
      name: 'HYUNDAI',
    },
    {
      id: 8,
      name: 'Kaufman',
    },
    {
      id: 9,
      name: 'Manac',
    },
  ];

  public trailerLengthType: any[] = [
    {
      id: 1,
      name: '20 ft',
    },
    {
      id: 2,
      name: '22 ft',
    },
    {
      id: 3,
      name: '24 ft',
    },
    {
      id: 4,
      name: '26 ft',
    },
    {
      id: 5,
      name: '28 ft',
    },
    {
      id: 6,
      name: '40 ft',
    },
    {
      id: 7,
      name: '43 ft',
    },
    {
      id: 8,
      name: '45 ft',
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
      svg: 'ic_bank_of_america.svg',
      folder: 'common',
      subFolder: 'banks'
    },
    {
      id: 2,
      name: 'BB&T',
      svg: 'ic_bank_bbt.svg',
      folder: 'common',
      subFolder: 'banks'
    },
    {
      id: 3,
      name: 'BMO Harris',
      svg: 'ic_bank_bmo_harris.svg',
      folder: 'common',
      subFolder: 'banks'
    },
    {
      id: 4,
      name: 'CHASE',
      svg: 'ic_bank_chase.svg',
      folder: 'common',
      subFolder: 'banks'
    },
    {
      id: 5,
      name: 'CHIME',
      svg: 'ic_bank_chime.svg',
      folder: 'common',
      subFolder: 'banks'
    },
    {
      id: 6,
      name: 'Citi Bank',
      svg: 'ic_bank_citi.svg',
      folder: 'common',
      subFolder: 'banks'
    },
    {
      id: 7,
      name: 'Fifth Third',
      svg: 'ic_bank_fifth_third.svg',
      folder: 'common',
      subFolder: 'banks'
    },
    {
      id: 8,
      name: 'MB Financial',
      svg: 'ic_bank_mb_financial.svg',
      folder: 'common',
      subFolder: 'banks'
    },
    {
      id: 9,
      name: 'NAVY FEDERAL',
      svg: 'ic_bank_navi_federal.svg',
      folder: 'common',
      subFolder: 'banks'
    },
    {
      id: 10,
      name: 'PNC BANK',
      svg: 'ic_bank_pnc.svg',
      folder: 'common',
      subFolder: 'banks'
    },
    {
      id: 11,
      name: 'Regions',
      svg: 'ic_bank_regions.svg',
      folder: 'common',
      subFolder: 'banks'
    },
    {
      id: 12,
      name: 'TCF Bank',
      svg: 'ic_bank_tcf.svg',
      folder: 'common',
      subFolder: 'banks'
    },
    {
      id: 13,
      name: 'US Bank',
      svg: 'ic_bank_us.svg',
      folder: 'common',
      subFolder: 'banks'
    },
    {
      id: 14,
      name: 'Wells Fargo',
      svg: 'ic_bank_wells_fargo.svg',
      folder: 'common',
      subFolder: 'banks'
    },
    {
      id: 15,
      name: 'Meta Bank',
      svg: 'ic_bank_meta.svg',
      folder: 'common',
      subFolder: 'banks'
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
    },
  ];

  public ownerType: any[] = [
    {
      id: 1,
      name: 'Purchase',
    },
    {
      id: 2,
      name: 'Sale',
    },
  ];

  public suspensionType: any[] = [
    {
      id: 1,
      name: 'Leaf Spring',
    },
    {
      id: 2,
      name: 'Air Ride',
    },
    {
      id: 3,
      name: 'Rigid',
    },
  ];

  public doorType: any[] = [
    {
      id: 1,
      name: 'Swing',
    },
    {
      id: 2,
      name: 'Roll-Up',
    },
  ];

  public reeferUnitType: any[] = [
    {
      id: 1,
      name: 'THERMO KING',
    },
    {
      id: 2,
      name: 'Carrier',
    },
  ];

  public accountLabels: any [] = [
    { id: 1, name: 'Aleksandar Djordjevic' },
    { id: 2, name: 'Denis Rodman' },
    { id: 3, name: 'James Halpert' },
    { id: 4, name: 'Pamela Beasley' },
  ];
}
