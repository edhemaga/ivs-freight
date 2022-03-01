import {takeUntil} from 'rxjs/operators';
import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject} from 'rxjs';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { SharedService } from '../../../services/shared/shared.service';

class DashboardStats {
  allTimeObject: any[];
  mtdObject: any[];
  ytdObject: any[];
  todayObject: any[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../dashboard.global.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {
  dashboardStats: DashboardStats = {todayObject: [], mtdObject: [], ytdObject: [], allTimeObject: []};
  data: any = {
    contacts: [
      {
        contactName: 'Blanca Parker',
        location: 'Immokallee, Fl 14220',
        email: 'test@test.com',
        phone: '(123) 456 7890'
      },
      {
        contactName: 'Blanca Parker',
        location: 'Immokallee, Fl 14220',
        email: 'test@test.com',
        phone: '(123) 456 7890'
      },
      {
        contactName: 'Blanca Parker',
        location: 'Immokallee, Fl 14220',
        email: 'test@test.com',
        phone: '(123) 456 7890'
      }
    ],
    shippers: [
      {
        shipperName: 'Watco Supply Services',
        location: 'Immokallee, Fl 14220',
        email: 'test@test.com',
        phone: '(123) 456 7890'
      },
      {
        shipperName: 'Watco Supply Services',
        location: 'Immokallee, Fl 14220',
        email: 'test@test.com',
        phone: '(123) 456 7890'
      },
      {
        shipperName: 'Watco Supply Services',
        location: 'Immokallee, Fl 14220',
        email: 'test@test.com',
        phone: '(123) 456 7890'
      }
    ],
    accounts: [
      {
        name: 'Truck Shop',
        link: 'https://truck-shop.com'
      },
      {
        name: 'Truck Shop',
        link: 'https://truck-shop.com'
      },
      {
        name: 'Truck Shop',
        link: 'https://truck-shop.com'
      }
    ],
    shop: [
      {
        shopName: 'IVS TRUCK REPAIR, INC.',
        location: 'Bridgevie, IL 60098',
        phone: '(123) 456 7890',
        shopItems: ['TRU', 'TO', 'PA']
      },
      {
        shopName: 'IVS TRUCK REPAIR, INC.',
        location: 'Bridgevie, IL 60098',
        phone: '(123) 456 7890',
        shopItems: ['TRU', 'TO', 'PA']
      },
      {
        shopName: 'IVS TRUCK REPAIR, INC.',
        location: 'Bridgevie, IL 60098',
        phone: '(123) 456 7890',
        shopItems: ['TRU', 'TO', 'PA']
      }
    ],
    brokers: [
      {
        brokerName: 'AZEK BUILDING PRODUCTS',
        location: 'Woodstock, IL 60098',
        email: 'test@test.com',
        phone: '(123) 456 7890'
      },
      {
        brokerName: 'AZEK BUILDING PRODUCTS',
        location: 'Woodstock, IL 60098',
        email: 'test@test.com',
        phone: '(123) 456 7890'
      },
      {
        brokerName: 'AZEK BUILDING PRODUCTS',
        location: 'Woodstock, IL 60098',
        email: 'test@test.com',
        phone: '(123) 456 7890'
      }
    ],
    drivers: [
      {
        driverName: 'Michael Schot',
        ssn: '123-456-4312',
        email: 'test@test.com',
        phone: '(123) 456 7890'
      },
      {
        driverName: 'Michael Schot',
        ssn: '123-456-4312',
        email: 'test@test.com',
        phone: '(123) 456 7890'
      },
      {
        driverName: 'Michael Schot',
        ssn: '123-456-4312',
        email: 'test@test.com',
        phone: '(123) 456 7890'
      }
    ],
    owners: [
      {
        ownerName: 'Peter Pettreli',
        ein: '21-4563457',
        email: 'test@test.com',
        phone: '(123) 456 7890',
        gross: 250762,
        trucks: 3,
        trailers: 3
      },
      {
        ownerName: 'Hiro Nakamura',
        ein: '21-4563457',
        email: 'test@test.com',
        phone: '(123) 456 7890',
        gross: 250762,
        trucks: 33,
        trailers: 31
      },
      {
        ownerName: 'Mike Mike',
        ein: '21-4563457',
        email: 'test@test.com',
        phone: '(123) 456 7890',
        gross: 250762,
        trucks: 6,
        trailers: 10
      }
    ],
    trailers: [
      {
        id: 34,
        companyId: 261,
        companyOwned: 1,
        divisionFlag: null,
        ownerId: 123,
        ownerName: 'DISP',
        trailerNumber: '1',
        vin: '545454',
        year: '2015',
        status: 1,
        used: 1,
        canBeUsedByCompany: null,
        doc: {
          titleData: [],
          licenseData: [],
          additionalData: {
            make: {
              file: 'dorsey.svg',
              name: 'Dorsey',
              color: ''
            },
            note: '',
            type: {
              file: 'reefer.svg',
              name: 'Reefer',
              type: 'trailer',
              color: 'e94c4c',
              whiteFile: 'white-reefer.svg'
            },
            year: '2015',
            color: {
              id: 66,
              key: 'Black',
              value: '#000000',
              domain: 'color',
              entityId: null,
              parentId: null,
              companyId: null,
              createdAt: '2020-07-27T11:47:01',
              protected: 0,
              updatedAt: '2020-07-27T11:47:01',
              entityName: null
            },
            model: '545454',
            owner: null,
            axises: '',
            length: {
              id: 663,
              key: 'length',
              value: '20 ft',
              domain: 'trailer',
              entityId: null,
              parentId: null,
              companyId: null,
              createdAt: '2020-10-23T17:15:33',
              protected: 0,
              updatedAt: '2020-10-23T17:15:33',
              entityName: null
            },
            tireSize: null,
            ownerName: 'DISP'
          },
          inspectionData: [],
          activityHistory: [
            {
              id: 'b8fc4dbe-defb-40e7-a583-481c028928d3',
              header: 'DISP',
              endDate: null,
              startDate: '2020-11-26T11:47:00.526Z',
              endDateShort: null,
              startDateShort: '11/26/20'
            }
          ],
          trailerLeaseData: []
        },
        protected: null,
        createdAt: null,
        updatedAt: null
      },
      {
        id: 34,
        companyId: 261,
        companyOwned: 1,
        divisionFlag: null,
        ownerId: 123,
        ownerName: 'DISP',
        trailerNumber: '1',
        vin: '545454',
        year: '2015',
        status: 1,
        used: 1,
        canBeUsedByCompany: null,
        doc: {
          titleData: [],
          licenseData: [],
          additionalData: {
            make: {
              file: 'dorsey.svg',
              name: 'Dorsey',
              color: ''
            },
            note: '',
            type: {
              file: 'reefer.svg',
              name: 'Reefer',
              type: 'trailer',
              color: 'e94c4c',
              whiteFile: 'white-reefer.svg'
            },
            year: '2015',
            color: {
              id: 66,
              key: 'Black',
              value: '#000000',
              domain: 'color',
              entityId: null,
              parentId: null,
              companyId: null,
              createdAt: '2020-07-27T11:47:01',
              protected: 0,
              updatedAt: '2020-07-27T11:47:01',
              entityName: null
            },
            model: '545454',
            owner: null,
            axises: '',
            length: {
              id: 663,
              key: 'length',
              value: '20 ft',
              domain: 'trailer',
              entityId: null,
              parentId: null,
              companyId: null,
              createdAt: '2020-10-23T17:15:33',
              protected: 0,
              updatedAt: '2020-10-23T17:15:33',
              entityName: null
            },
            tireSize: null,
            ownerName: 'DISP'
          },
          inspectionData: [],
          activityHistory: [
            {
              id: 'b8fc4dbe-defb-40e7-a583-481c028928d3',
              header: 'DISP',
              endDate: null,
              startDate: '2020-11-26T11:47:00.526Z',
              endDateShort: null,
              startDateShort: '11/26/20'
            }
          ],
          trailerLeaseData: []
        },
        protected: null,
        createdAt: null,
        updatedAt: null
      }
    ],
    trucks: [
      {
        id: 139,
        companyId: 261,
        divisionFlag: 0,
        companyOwned: 1,
        ownerId: 123,
        ownerName: 'DISP',
        truckNumber: '34567',
        vin: '87654365438767767',
        year: null,
        commission: 12,
        status: 1,
        used: 1,
        canBeUsedByCompany: null,
        location: 'Los Angeles, CA',
        deviceId: null,
        doc: {
          additionalData: {
            make: {
              file: 'ford.svg',
              name: 'Ford',
              color: ''
            },
            note: '',
            type: {
              file: 'box-truck.svg',
              name: 'Box Truck',
              type: 'truck',
              color: 'e94949',
              whiteFile: 'white-box-truck.svg'
            },
            year: '2015',
            color: {
              id: 67,
              key: 'Dark blue',
              value: '#1C55AA',
              domain: 'color',
              entityId: null,
              parentId: null,
              companyId: null,
              createdAt: '2020-07-27T11:47:01',
              protected: 0,
              updatedAt: '2020-11-11T16:13:43',
              entityName: null
            },
            model: '6675432',
            owner: null,
            axises: '',
            engine: null,
            mileage: null,
            tireSize: null,
            emptyWeight: null,
            insurancePolicyNumber: ''
          },
          activityHistory: [
            {
              id: '74db837b-4fd1-4daa-b9bc-617d9c569b1d',
              header: 'DISP',
              endDate: null,
              startDate: '2020-11-18T07:39:28.864Z',
              endDateShort: null,
              startDateShort: '11/18/20'
            }
          ]
        },
        protected: null,
        createdAt: null,
        updatedAt: null
      },
      {
        id: 139,
        companyId: 261,
        divisionFlag: 0,
        companyOwned: 1,
        ownerId: 123,
        ownerName: 'DISP',
        truckNumber: '34567',
        vin: '87654365438767767',
        year: null,
        commission: 12,
        status: 1,
        used: 1,
        canBeUsedByCompany: null,
        location: 'Los Angeles, CA',
        deviceId: null,
        doc: {
          additionalData: {
            make: {
              file: 'ford.svg',
              name: 'Ford',
              color: ''
            },
            note: '',
            type: {
              file: 'box-truck.svg',
              name: 'Box Truck',
              type: 'truck',
              color: 'e94949',
              whiteFile: 'white-box-truck.svg'
            },
            year: '2015',
            color: {
              id: 67,
              key: 'Dark blue',
              value: '#1C55AA',
              domain: 'color',
              entityId: null,
              parentId: null,
              companyId: null,
              createdAt: '2020-07-27T11:47:01',
              protected: 0,
              updatedAt: '2020-11-11T16:13:43',
              entityName: null
            },
            model: '6675432',
            owner: null,
            axises: '',
            engine: null,
            mileage: null,
            tireSize: null,
            emptyWeight: null,
            insurancePolicyNumber: ''
          },
          activityHistory: [
            {
              id: '74db837b-4fd1-4daa-b9bc-617d9c569b1d',
              header: 'DISP',
              endDate: null,
              startDate: '2020-11-18T07:39:28.864Z',
              endDateShort: null,
              startDateShort: '11/18/20'
            }
          ]
        },
        protected: null,
        createdAt: null,
        updatedAt: null
      }
    ]
  };
  dispatchStatuses: any = [
    {
      id: 40,
      name: 'OFF',
      status: 58,
      statusPercentage: 10.0,
      color: '#202020'
    },
    {
      id: 40,
      status: 58,
      name: 'ACTIVE',
      statusPercentage: 15.0,
      color: '#5AE99D'
    },
    {
      id: 40,
      status: 58,
      name: 'DISPATCHED',
      color: '#497BDC',
      statusPercentage: 25.0,
    },
    {
      id: 40,
      status: 58,
      name: 'CHECKED IN',
      color: '#24C1A1',
      statusPercentage: 98.0
    },
    {
      id: 40,
      status: 58,
      name: 'LOADED',
      color: '#207E4C',
      statusPercentage: 35.0
    },
    {
      id: 40,
      status: 58,
      name: 'REPAIR',
      color: '#AE3232',
      statusPercentage: 80.0
    },
    {
      id: 40,
      status: 58,
      name: 'EMPTY',
      color: '#F99E00',
      statusPercentage: 76.0
    }
  ];
  pendingStatuses: any = [
    {
      id: 40,
      name: 'BOOKED',
      status: 58,
      statusPercentage: 25.0,
      color: '#959595'
    },
    {
      id: 40,
      status: 58,
      name: 'ASSIGNED',
      statusPercentage: 10.0,
      color: '#202020'
    },
    {
      id: 40,
      status: 58,
      name: 'DISPATCHED',
      color: '#497BDC',
      statusPercentage: 14.0,
    },
    {
      id: 40,
      status: 58,
      name: 'LOADED',
      color: '#207E4C',
      statusPercentage: 90.0
    }
  ];
  closedStatuses: any = [
    {
      id: 40,
      name: 'CANCELED',
      status: 58,
      statusPercentage: 20.0,
      color: '#AE3232'
    },
    {
      id: 40,
      status: 58,
      name: 'TONU',
      statusPercentage: 55.0,
      color: '#FF5D5D'
    },
    {
      id: 40,
      status: 58,
      name: 'INVOICED',
      color: '#BFB580',
      statusPercentage: 30.0,
    },
    {
      id: 40,
      status: 58,
      name: 'In HOLD / REVISED',
      color: '#B7B7B7',
      statusPercentage: 100.0
    },
    {
      id: 40,
      name: 'PAID',
      status: 58,
      statusPercentage: 40.0,
      color: '#9F9A7B'
    },
    {
      id: 40,
      status: 58,
      name: 'SHORT-PAID',
      statusPercentage: 70.0,
      color: '#807B65'
    },
    {
      id: 40,
      status: 58,
      name: 'UNPAID',
      color: '#65614D',
      statusPercentage: 10.0,
    },
    {
      id: 40,
      status: 58,
      name: 'CLAIM',
      color: '#514E40',
      statusPercentage: 90.0
    }
  ];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private dashboardService: DashboardService, private sharedService: SharedService) {
  }

  ngOnInit() {
    this.getStats();
  }

  getStats() {
    this.dashboardService.getDasboardMainTotals()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: any) => {
          this.dashboardStats = response;
          console.log('dashboardStats:', response);
        },
        (error: any) => {
          this.sharedService.handleServerError();
        }
      );
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  parseNum(x) {
    return parseFloat(x);
  }
}
