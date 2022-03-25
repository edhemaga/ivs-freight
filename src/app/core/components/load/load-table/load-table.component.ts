import { Component, OnInit } from '@angular/core';
import { CustomModalService } from 'src/app/core/services/modals/custom-modal.service';
import { getLoadColumnDefinition } from 'src/assets/utils/settings/load-columns';

@Component({
  selector: 'app-load-table',
  templateUrl: './load-table.component.html',
  styleUrls: ['./load-table.component.scss'],
})
export class LoadTableComponent implements OnInit {
  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'active';
  resetColumns: boolean;

  constructor(private customModalService: CustomModalService) {}

  ngOnInit(): void {
    this.initTableOptions();

    this.getLoadData();
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
          name: 'edit-load',
        },
        {
          title: 'Delete',
          name: 'delete',
          type: 'load',
          text: 'Are you sure you want to delete load(s)?',
        },
      ],
      export: true,
    };
  }

  getLoadData() {
    this.sendLoadData();
  }

  sendLoadData() {
    this.tableData = [
      {
        title: 'Pending',
        field: 'pending',
        length: 2,
        data: this.getDumyData(2),
        extended: false,
        gridNameTitle: 'Load',
        stateName: 'loads',
        gridColumns: this.getGridColumns('loads', this.resetColumns),
      },
      {
        title: 'Active',
        field: 'active',
        length: 8,
        data: this.getDumyData(8),
        extended: false,
        gridNameTitle: 'Load',
        stateName: 'loads',
        gridColumns: this.getGridColumns('loads', this.resetColumns),
      },
      {
        title: 'Closed',
        field: 'inactive',
        length: 10,
        data: this.getDumyData(10),
        extended: false,
        gridNameTitle: 'Load',
        stateName: 'loads',
        gridColumns: this.getGridColumns('loads', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setLoadData(td);
  }

  getGridColumns(stateName: string, resetColumns: boolean) {
    const userState: any = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );

    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      return getLoadColumnDefinition();
    }
  }

  setLoadData(td: any) {
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
        id: 337,
        assignedCompanyId: 1,
        eventId: null,
        categoryId: null,
        category: 'ftl',
        dispatchBoardId: null,
        truckId: null,
        truckNumber: null,
        trailerId: null,
        trailerNumber: null,
        driverId: null,
        driverName: null,
        driverPhone: null,
        driverEmail: null,
        driverAddress: null,
        deviceId: null,
        uniqueId: null,
        brokerId: 63,
        brokerName: 'GO-TO SOLUTIONS INC',
        loadNumber: 104,
        statusId: 0,
        statusDateTime: '2022-01-16T23:12:06',
        note: '',
        additionTotal: 0,
        deductionTotal: 0,
        total: '$2,000',
        companyCheck: 0,
        brokerLoadNumber: '555',
        dispatcherId: null,
        dispatcherName: null,
        teamBoard: null,
        pickupId: 30,
        pickupName: 'BEST FOOD',
        pickupLocation: {
          city: 'Tucker',
          state: 'Georgia',
          address: '3300 Montreal Industrial Way, Tucker, GA 30084, USA',
          country: 'US',
          zipCode: '30084',
          streetName: 'Montreal Industrial Way',
          streetNumber: '3300',
          stateShortName: 'GA',
        },
        pickupDateTime: '01/19/22',
        deliveryId: 40,
        deliveryName: 'LACTALIS',
        deliveryLocation: {
          city: 'Buffalo',
          state: 'New York',
          address: '2375 South Park Ave, Buffalo, NY 14220, USA',
          country: 'US',
          zipCode: '14220',
          streetName: 'South Park Avenue',
          streetNumber: '2375',
          stateShortName: 'NY',
        },
        deliveryDateTime: '01/21/22',
        mileage: '896',
        pickupCount: 1,
        deliveryCount: 1,
        used: 0,
        po: null,
        pu: null,
        doc: {},
        route: [],
        rates: [],
        startDateTime: null,
        endDateTime: null,
        startDate: null,
        endDate: null,
        startTime: null,
        endTime: null,
        createdAt: '2022-01-16T23:12:06',
        updatedAt: '2022-01-16T23:12:06',
        gpsFlag: 0,
        comments: [],
        commentsCount: 0,
        guid: '12e6d82a-45f4-49a9-9f61-e2ce0380cf36',
        baseRate: 0,
        adjusted: 0,
        advanced: 0,
        additional: '$0',
        revised: 0,
        stops: 2,
        status: 'UNASSIGNED',
      },
    ];

    for (let i = 0; i < numberOfCopy; i++) {
      data.push(data[i]);
    }

    return data;
  }

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      alert('Treba da se doda load modal!');
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;
      this.setLoadData(event.tabData);
    }
  }
}
