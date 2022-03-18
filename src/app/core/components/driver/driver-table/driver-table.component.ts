import { Component, OnInit } from '@angular/core';
import { CustomModalService } from 'src/app/core/services/modals/custom-modal.service';
import { getApplicantColumnsDefinition } from 'src/assets/utils/settings/applicant-columns';
import { getDriverColumnsDefinition } from 'src/assets/utils/settings/driver-columns';
import { DriverManageComponent } from '../../modals/driver-manage/driver-manage.component';

@Component({
  selector: 'app-driver-table',
  templateUrl: './driver-table.component.html',
  styleUrls: ['./driver-table.component.scss'],
})
export class DriverTableComponent implements OnInit {
  public tableOptions: any = {};
  viewData: any[] = [];
  columns: any[] = [];
  selectedTab = 'active';
  resetColumns: boolean;

  constructor(private customModalService: CustomModalService) {}

  ngOnInit(): void {
    this.initTableOptions();

    this.getDriversData();
  }

  public initTableOptions(): void {
    this.tableOptions = {
      disabledMutedStyle: null,
      toolbarActions: {
        hideImport: false,
        hideExport: false,
        hideLockUnlock: false,
        hideAddNew: false,
        hideColumns: false,
        hideCompress: false,
      },
      config: {
        showSort: true,
        sortBy: '',
        sortDirection: '',
        disabledColumns: [0],
        minWidth: 60,
      },
      actions: [
        {
          title: 'Edit Driver',
          name: 'edit',
        },
        {
          title: 'Add CDL',
          name: 'new-licence',
        },
        {
          title: 'Add Medical',
          name: 'new-medical',
        },
        {
          title: 'Add MVR',
          name: 'new-mvr',
        },
        {
          title: 'Add Test',
          name: 'new-drug',
        },
        {
          title: 'Activate',
          reverseTitle: 'Deactivate',
          name: 'activate-item',
        },
        {
          title: 'Delete',
          name: 'delete-item',
          type: 'driver',
          text: 'Are you sure you want to delete driver(s)?',
        },
      ],
      export: true,
    };
  }

  getDriversData() {
    this.sendDriverData();
  }

  sendDriverData() {
    const data: any[] = [
      {
        title: 'Applicants',
        field: 'applicants',
        data: this.getDumyData(2),
        extended: true,
        gridNameTitle: 'Applicant',
        stateName: 'applicants',
        gridColumns: this.getGridColumns('applicants', this.resetColumns),
      },
      {
        title: 'Active',
        field: 'active',
        data: this.getDumyData(5),
        extended: false,
        gridNameTitle: 'Driver',
        stateName: 'drivers',
        gridColumns: this.getGridColumns('drivers', this.resetColumns),
      },
      {
        title: 'Inactive',
        field: 'inactive',
        data: this.getDumyData(10),
        extended: false,
        gridNameTitle: 'Driver',
        stateName: 'drivers',
        gridColumns: this.getGridColumns('drivers', this.resetColumns),
      },
    ];

    const td = data.find((t) => t.field === this.selectedTab);

    this.viewData = td.data;
    this.columns = td.gridColumns;

    this.viewData = this.viewData.map((data) => {
      data.isSelected = false;
      return data;
    });
  }

  getGridColumns(stateName: string, resetColumns: boolean) {
    const userState: any = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );

    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      if (stateName === 'applicants') {
        return getApplicantColumnsDefinition();
      } else {
        return getDriverColumnsDefinition();
      }
    }
  }

  getDumyData(numberOfCopy: number) {
    let data: any[] = [
      {
        id: 336,
        companyId: 1,
        driverUserId: 625,
        ownerId: null,
        ssn: '439-33-3808',
        dateOfBirth: null,
        password: null,
        avatar:
          'data:image/png;base64,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',
        firstName: 'Anthony',
        lastName: 'Robertson',
        phone: '5043731128',
        additionalData: {
          note: null,
          type: 'single',
          email: 'robertsonanthony23@yahoo.com',
          phone: '(504) 373-1128',
          avatar: {
            id: '1cc4c905-dc04-4628-9296-ae54c313b859',
            src: 'data:image/png;base64,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',
          },
          address: {
            city: 'Bogalusa',
            state: 'Louisiana',
            address: '1106 Florida Ave, Bogalusa, LA 70427, USA',
            country: 'US',
            zipCode: '70427',
            streetName: 'Florida Avenue',
            addressUnit: null,
            streetNumber: '1106',
            stateShortName: 'LA',
          },
          bankData: {
            id: null,
            bankLogo: null,
            bankName: null,
            bankLogoWide: null,
            accountNumber: null,
            routingNumber: null,
          },
          dateOfBirth: '1977-04-02T06:00:00Z',
          paymentType: null,
          businessData: {
            taxId: null,
            isOwner: 0,
            businessName: null,
            isBusinessOwner: 0,
          },
          notifications: [],
          birthDateShort: '4/2/77',
        },
        workData: [
          {
            id: '059da5d7-26cf-4076-aa57-651a7b96aab5',
            endDate: '',
            startDate: '2021-05-12T18:45:14.001Z',
            endDateShort: null,
            startDateShort: '5/12/21',
          },
        ],
        licenseData: [
          {
            id: '8bb04a89-0dc9-4ab1-8423-5cb8dba81cd7',
            note: '',
            class: {
              id: 282,
              key: 'class',
              value: 'A',
              domain: 'driver',
              entityId: null,
              parentId: null,
              companyId: 1,
              createdAt: '2020-09-28T13:41:47',
              protected: 0,
              updatedAt: '2020-10-01T22:55:32',
              entityName: null,
            },
            state: {
              key: 'LA',
              value: 'Louisiana',
            },
            number: '006602965',
            country: {
              id: 285,
              key: 'country',
              value: 'US',
              domain: 'driver',
              entityId: null,
              parentId: null,
              companyId: 1,
              createdAt: '2020-09-28T15:11:43',
              protected: 0,
              updatedAt: '2020-09-28T15:23:56',
              entityName: null,
            },
            endDate: '2024-04-02T05:00:00Z',
            startDate: '2018-04-20T05:00:00Z',
            attachments: [
              {
                url: 'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/driver/336/cdl/8bb04a89-0dc9-4ab1-8423-5cb8dba81cd7/7756ba5acc1d486b9493ac3ce739c6541620845260-Anthony Robertson CDL.pdf',
                fileName: 'Anthony Robertson CDL.pdf',
                fileItemGuid: '7756ba5a-cc1d-486b-9493-ac3ce739c654',
              },
            ],
            endorsements: [
              {
                id: 109,
                domain: null,
                protected: null,
                endorsementCode: 'tank_vehicles',
                endorsementName: 'N - Tank Vehicles',
              },
              {
                id: 113,
                domain: null,
                protected: null,
                endorsementCode: 'doubles_triples',
                endorsementName: 'T - Doubles/Triples',
              },
            ],
            restrictions: null,
          },
        ],
        medicalData: [
          {
            id: 'bea0931e-3ea3-40f0-8bc4-dda705eed52d',
            endDate: '2022-08-22T05:00:00Z',
            startDate: '2020-08-22T05:00:00Z',
            attachments: [
              {
                url: 'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/driver/336/medical/bea0931e3ea340f08bc4dda705eed52d1621623271-Anthony Robertson medical 8.22.22.pdf',
                fileName: 'Anthony Robertson medical 8.22.22.pdf',
                fileItemGuid: 'bea0931e-3ea3-40f0-8bc4-dda705eed52d',
              },
            ],
          },
        ],
        mvrData: [
          {
            id: 'f1d77fa8-9837-4ebd-8014-043dab58ef2f',
            startDate: '2021-05-12T05:00:00Z',
            attachments: [],
          },
        ],
        bankId: null,
        accountNumber: null,
        routingNumber: null,
        deviceId: null,
        uniqueId: null,
        paymentTypeId: null,
        paymentType: 'mile',
        commission: 10,
        emptyMiles: null,
        loadedMiles: null,
        isOwner: 0,
        isOwnerAsCompany: 0,
        commissionOwner: null,
        twic: 0,
        expirationDate: null,
        cardNumber: null,
        cardId: null,
        status: 1,
        used: 0,
        doc: {
          mvrData: [
            {
              id: 'f1d77fa8-9837-4ebd-8014-043dab58ef2f',
              startDate: '2021-05-12T05:00:00Z',
              attachments: [],
            },
          ],
          testData: [],
          workData: [
            {
              id: '059da5d7-26cf-4076-aa57-651a7b96aab5',
              endDate: '',
              startDate: '2021-05-12T18:45:14.001Z',
              endDateShort: null,
              startDateShort: '5/12/21',
            },
          ],
          licenseData: [
            {
              id: '8bb04a89-0dc9-4ab1-8423-5cb8dba81cd7',
              note: '',
              class: {
                id: 282,
                key: 'class',
                value: 'A',
                domain: 'driver',
                entityId: null,
                parentId: null,
                companyId: 1,
                createdAt: '2020-09-28T13:41:47',
                protected: 0,
                updatedAt: '2020-10-01T22:55:32',
                entityName: null,
              },
              state: {
                key: 'LA',
                value: 'Louisiana',
              },
              number: '006602965',
              country: {
                id: 285,
                key: 'country',
                value: 'US',
                domain: 'driver',
                entityId: null,
                parentId: null,
                companyId: 1,
                createdAt: '2020-09-28T15:11:43',
                protected: 0,
                updatedAt: '2020-09-28T15:23:56',
                entityName: null,
              },
              endDate: '2024-04-02T05:00:00Z',
              startDate: '2018-04-20T05:00:00Z',
              attachments: [
                {
                  url: 'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/driver/336/cdl/8bb04a89-0dc9-4ab1-8423-5cb8dba81cd7/7756ba5acc1d486b9493ac3ce739c6541620845260-Anthony Robertson CDL.pdf',
                  fileName: 'Anthony Robertson CDL.pdf',
                  fileItemGuid: '7756ba5a-cc1d-486b-9493-ac3ce739c654',
                },
              ],
              endorsements: [
                {
                  id: 109,
                  domain: null,
                  protected: null,
                  endorsementCode: 'tank_vehicles',
                  endorsementName: 'N - Tank Vehicles',
                },
                {
                  id: 113,
                  domain: null,
                  protected: null,
                  endorsementCode: 'doubles_triples',
                  endorsementName: 'T - Doubles/Triples',
                },
              ],
              restrictions: null,
            },
          ],
          medicalData: [
            {
              id: 'bea0931e-3ea3-40f0-8bc4-dda705eed52d',
              endDate: '2022-08-22T05:00:00Z',
              startDate: '2020-08-22T05:00:00Z',
              attachments: [
                {
                  url: 'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/driver/336/medical/bea0931e3ea340f08bc4dda705eed52d1621623271-Anthony Robertson medical 8.22.22.pdf',
                  fileName: 'Anthony Robertson medical 8.22.22.pdf',
                  fileItemGuid: 'bea0931e-3ea3-40f0-8bc4-dda705eed52d',
                },
              ],
            },
          ],
          additionalData: {
            note: null,
            type: 'single',
            email: 'robertsonanthony23@yahoo.com',
            phone: '5043731128',
            avatar: {
              id: '1cc4c905-dc04-4628-9296-ae54c313b859',
              src: 'data:image/png;base64,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',
            },
            address: {
              city: 'Bogalusa',
              state: 'Louisiana',
              address: '1106 Florida Ave, Bogalusa, LA 70427, USA',
              country: 'US',
              zipCode: '70427',
              streetName: 'Florida Avenue',
              addressUnit: null,
              streetNumber: '1106',
              stateShortName: 'LA',
            },
            bankData: {
              id: null,
              bankLogo: null,
              bankName: null,
              bankLogoWide: null,
              accountNumber: null,
              routingNumber: null,
            },
            dateOfBirth: '1977-04-02T06:00:00Z',
            paymentType: null,
            businessData: {
              taxId: null,
              isOwner: 0,
              businessName: null,
              isBusinessOwner: 0,
            },
            notifications: [],
            birthDateShort: '4/2/77',
          },
        },
        protected: 0,
        createdAt: '2021-05-12T18:45:14',
        updatedAt: '2021-12-29T15:03:42',
        gpsFlag: null,
        truckload: null,
        owner: null,
        driverUser: null,
        guid: 'a4b527d2-8cf4-4fb2-b75b-4c37b016fa73',
        textPhone: '(504) 373-1128',
        textEmail: 'robertsonanthony23@yahoo.com',
        textAddress: '1106 Florida Ave, Bogalusa, LA 70427, USA',
        textDOB: '4/2/77',
        textHired: '5/12/21',
        textState: 'LA',
        textCDL: '006602965',
        textBank: null,
        textAccount: null,
        textRouting: null,
        bankImage: null,
        restrictions: null,
        endorsements: [
          {
            id: 109,
            domain: null,
            protected: null,
            endorsementCode: 'tank_vehicles',
            endorsementName: 'N - Tank Vehicles',
          },
          {
            id: 113,
            domain: null,
            protected: null,
            endorsementCode: 'doubles_triples',
            endorsementName: 'T - Doubles/Triples',
          },
        ],
        tableCDLData: {
          start: '2018-04-20T05:00:00Z',
          end: '2024-04-02T05:00:00Z',
        },
        tableMedicalData: {
          start: '2020-08-22T05:00:00Z',
          end: '2022-08-22T05:00:00Z',
        },
        tableMvrData: {
          start: '2021-05-12T05:00:00Z',
        },
        isSelected: false,
      },
    ];

    for (let i = 0; i < numberOfCopy; i++) {
      data.push(data[i]);
    }

    return data;
  }

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      this.customModalService.openModal(
        DriverManageComponent,
        {
          data: {
            type: 'new',
          },
        },
        null,
        {
          size: 'small',
        }
      );
    }
  }
}
