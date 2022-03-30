import { Component, OnInit } from '@angular/core';
import { CustomModalService } from 'src/app/core/services/modals/custom-modal.service';
import { getViolationsColums } from 'src/assets/utils/settings/safety-columns';

@Component({
  selector: 'app-violation-table',
  templateUrl: './violation-table.component.html',
  styleUrls: ['./violation-table.component.scss'],
})
export class ViolationTableComponent implements OnInit {
  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'active';
  resetColumns: boolean;

  constructor(private customModalService: CustomModalService) {}

  ngOnInit(): void {
    this.initTableOptions();

    this.getViolationData();
  }

  public initTableOptions(): void {
    this.tableOptions = {
      disabledMutedStyle: null,
      toolbarActions: {
        hideLocationFilter: true,
        hideViewMode: true,
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
          title: 'Edit',
          name: 'edit-violation',
        },
        {
          title: 'Delete',
          name: 'delete',
          type: 'violations',
          text: 'Are you sure you want to delete violation?',
        },
      ],
      export: true,
    };
  }

  getViolationData() {
    this.sendViolationData();
  }

  sendViolationData() {
    this.tableData = [
      {
        title: 'Active',
        field: 'active',
        type: 'violations',
        length: 10,
        data: this.getDumyData(10),
        extended: false,
        gridNameTitle: 'Violations',
        stateName: 'violations',
        gridColumns: this.getGridColumns('violations', this.resetColumns),
      },
      {
        title: 'Inactive',
        field: 'inactive',
        type: 'violations',
        length: 15,
        data: this.getDumyData(15),
        extended: false,
        gridNameTitle: 'Violations',
        stateName: 'violations',
        gridColumns: this.getGridColumns('violations', this.resetColumns),
      },
      {
        title: 'Summary',
        field: 'summary',
        type: 'violations_summary',
        length: 8,
        data: this.getDumyData(8),
        extended: false,
        gridNameTitle: 'Summary',
        stateName: 'violations_summary',
        gridColumns: this.getGridColumns(
          'violations_summary',
          this.resetColumns
        ),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setViolationData(td);
  }

  getGridColumns(stateName: string, resetColumns: boolean) {
    const userState: any = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );

    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      return getViolationsColums();
    }
  }

  setViolationData(td: any) {
    this.viewData = td.data;
    this.columns = td.gridColumns;

    this.viewData = this.viewData.map((data) => {
      data.isSelected = false;
      return data;
    });
  }

  getDumyData(numberOfCopy: number) {
    let data: any[] = [
      {
        id: 387,
        companyId: 1,
        report: 'MD0290003860',
        driverId: 258,
        firstName: 'Vladica',
        lastName: 'Mitic',
        driverFullName: 'Vladica Mitic',
        avatar:
          'data:image/png;base64,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',
        truckId: 189,
        truckNumber: '8292',
        trailerId: null,
        trailerNumber: '3434',
        eventDate: '07/15/21',
        eventTime: '08:47AM',
        typeDescription: null,
        oos: [
          {
            active: true,
            value: 'D',
            title: 'Driver',
          },
          {
            active: false,
            value: '1',
            title: 'Truck',
          },
          {
            active: false,
            value: '2',
            title: 'Trailer',
          },
        ],
        lvl: 'II',
        categories: [
          {
            id: 727,
            typeId: 1121,
            violationId: 387,
            code: '392.2C',
            description: 'Failure to obey traffic control device',
            driverFlag: 1,
            truckFlag: 0,
            trailerFlag: 0,
            sw: 5,
            swPlus: 0,
            tiw: 3,
            totw: 15,
          },
          {
            id: 728,
            typeId: 1123,
            violationId: 387,
            code: '393.9H',
            description: 'Inoperable head lamps',
            driverFlag: 0,
            truckFlag: 1,
            trailerFlag: 0,
            sw: 6,
            swPlus: 0,
            tiw: 3,
            totw: 18,
          },
          {
            id: 729,
            typeId: 1123,
            violationId: 387,
            code: '393.75C-OO',
            description:
              'Tire-other tread depth less than 1/32 of inch measured in 2 adjacent major tread grooves 3 separate locations 8 inches apart',
            driverFlag: 0,
            truckFlag: 0,
            trailerFlag: 1,
            sw: 8,
            swPlus: 0,
            tiw: 3,
            totw: 24,
          },
          {
            id: 730,
            typeId: 1123,
            violationId: 387,
            code: '393.75C-OO',
            description:
              'Tire-other tread depth less than 1/32 of inch measured in 2 adjacent major tread grooves 3 separate locations 8 inches apart',
            driverFlag: 0,
            truckFlag: 0,
            trailerFlag: 1,
            sw: 8,
            swPlus: 0,
            tiw: 3,
            totw: 24,
          },
          {
            id: 731,
            typeId: 1123,
            violationId: 387,
            code: '393.45DLUV',
            description: 'Brake Connections with Leaks Under Vehicle',
            driverFlag: 0,
            truckFlag: 0,
            trailerFlag: 1,
            sw: 4,
            swPlus: 0,
            tiw: 3,
            totw: 12,
          },
        ],
        citations: [],
        citationTotal: 0,
        violationsTotal: [
          {
            id: 1121,
            sw: 15,
          },
          {
            id: 1122,
            sw: 0,
          },
          {
            id: 1123,
            sw: 78,
          },
          {
            id: 1124,
            sw: 0,
          },
          {
            id: 1125,
            sw: 0,
          },
          {
            id: 1126,
            sw: 0,
          },
        ],
        policeDept: null,
        policeAddress: null,
        policePhone: null,
        policeFax: null,
        highway: null,
        location: null,
        county: null,
        state: 'MD',
        country: 'US',
        longitude: -76.649533,
        latitude: 39.319732,
        milepost: null,
        shipperId: null,
        shipperName: null,
        pickupId: null,
        origin: null,
        originLongitude: null,
        originLatitude: null,
        deliveryId: null,
        destination: null,
        destinationLongitude: null,
        destinationLatitude: null,
        cargo: null,
        hazmat: 0,
        bol: null,
        note: '',
        stateText: 'Maryland',
        doc: {
          address: {
            city: 'Baltimore',
            state: 'Maryland',
            address: 'Baltimore, MD, USA',
            country: 'US',
            zipCode: '',
            streetName: '',
            streetNumber: '',
            stateShortName: 'MD',
          },
          attachments: [
            {
              url: 'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/violation/387/0/3ae909195b054649b8a90e57206ffe9b1637858059-Vladica Mitic insp II 7.15.21 (1).pdf',
              fileName: 'Vladica Mitic insp II 7.15.21 (1).pdf',
              fileItemGuid: '3ae90919-5b05-4649-b8a9-0e57206ffe9b',
            },
          ],
          specialChecks: [
            {
              id: 1,
              name: 'Alc/Cont. Sub. Check',
              checked: false,
            },
            {
              id: 2,
              name: 'Cond. by Local Juris.',
              checked: false,
            },
            {
              id: 3,
              name: 'Size & Weight Enf.',
              checked: false,
            },
            {
              id: 4,
              name: 'eScreen Inspection',
              checked: false,
            },
            {
              id: 5,
              name: 'Traffic Enforcement',
              checked: false,
            },
            {
              id: 6,
              name: 'PASA Cond. Insp.',
              checked: false,
            },
            {
              id: 7,
              name: 'Drug Interd. Search',
              checked: false,
            },
            {
              id: 8,
              name: 'Border Enf. Insp.',
              checked: false,
            },
            {
              id: 9,
              name: 'Post Crash Insp.',
              checked: false,
            },
            {
              id: 10,
              name: 'PBBT Inspection',
              checked: false,
            },
          ],
        },
        active: null,
        createdAt: '2021-11-25T16:34:18',
        updatedAt: '2021-11-26T19:36:02',
        guid: 'cde2c55c-4d3d-47a0-af71-b304d5a2497f',
        citation: 2,
        vl1: 15,
        vl3: 78,
        oosStatus: false,
        groupedViolations: [
          {
            title: 'Unsafe Driving',
            active: false,
            iconUrl: 'assets/img/svgs/table/violation-vl1.svg',
            id: 1121,
            data: [
              {
                id: 727,
                typeId: 1121,
                violationId: 387,
                code: '392.2C',
                description: 'Failure to obey traffic control device',
                driverFlag: 1,
                truckFlag: 0,
                trailerFlag: 0,
                sw: 5,
                swPlus: 0,
                tiw: 3,
                totw: 15,
              },
            ],
            totw: 15,
            tiw: 3,
            sw: 5,
          },
          {
            title: 'Hours of Service Compliance',
            active: false,
            iconUrl: 'assets/img/svgs/table/violation-vl2.svg',
            id: 1122,
            data: [],
            totw: 0,
            tiw: 0,
            sw: 0,
          },
          {
            title: 'Vehicle Maintenance',
            active: false,
            iconUrl: 'assets/img/svgs/table/violation-vl3.svg',
            id: 1123,
            data: [
              {
                id: 728,
                typeId: 1123,
                violationId: 387,
                code: '393.9H',
                description: 'Inoperable head lamps',
                driverFlag: 0,
                truckFlag: 1,
                trailerFlag: 0,
                sw: 6,
                swPlus: 0,
                tiw: 3,
                totw: 18,
              },
              {
                id: 729,
                typeId: 1123,
                violationId: 387,
                code: '393.75C-OO',
                description:
                  'Tire-other tread depth less than 1/32 of inch measured in 2 adjacent major tread grooves 3 separate locations 8 inches apart',
                driverFlag: 0,
                truckFlag: 0,
                trailerFlag: 1,
                sw: 8,
                swPlus: 0,
                tiw: 3,
                totw: 24,
              },
              {
                id: 730,
                typeId: 1123,
                violationId: 387,
                code: '393.75C-OO',
                description:
                  'Tire-other tread depth less than 1/32 of inch measured in 2 adjacent major tread grooves 3 separate locations 8 inches apart',
                driverFlag: 0,
                truckFlag: 0,
                trailerFlag: 1,
                sw: 8,
                swPlus: 0,
                tiw: 3,
                totw: 24,
              },
              {
                id: 731,
                typeId: 1123,
                violationId: 387,
                code: '393.45DLUV',
                description: 'Brake Connections with Leaks Under Vehicle',
                driverFlag: 0,
                truckFlag: 0,
                trailerFlag: 1,
                sw: 4,
                swPlus: 0,
                tiw: 3,
                totw: 12,
              },
            ],
            totw: 78,
            tiw: 3,
            sw: 26,
          },
          {
            title: 'Controlled Substances and Alcohol',
            active: false,
            iconUrl: 'assets/img/svgs/table/violation-vl4.svg',
            id: 1124,
            data: [],
            totw: 0,
            tiw: 0,
            sw: 0,
          },
          {
            title: 'Hazardous Materials Compliance',
            active: false,
            iconUrl: 'assets/img/svgs/table/violation-vl5.svg',
            id: 1125,
            data: [],
            totw: 0,
            tiw: 0,
            sw: 0,
          },
          {
            title: 'Driver Fitness',
            active: false,
            iconUrl: 'assets/img/svgs/table/violation-vl6.svg',
            id: 1126,
            data: [],
            totw: 0,
            tiw: 0,
            sw: 0,
          },
        ],
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
      alert('Treba da se odradi modal!');
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;
      this.setViolationData(event.tabData);
    }
  }
}
