import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { getTruckColumnDefinition } from 'src/assets/utils/settings/truck-columns';
import { TruckModalComponent } from '../../modals/truck-modal/truck-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';

@Component({
  selector: 'app-truck-table',
  templateUrl: './truck-table.component.html',
  styleUrls: ['./truck-table.component.scss'],
})
export class TruckTableComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  
  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'active';
  resetColumns: boolean;

  constructor(private modalService: ModalService,  private tableService: TruckassistTableService) {}

  ngOnInit(): void {
    this.initTableOptions();
    this.getTrucksData();

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.resetColumns = response;

          this.sendTruckData();
        }
      });
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
          title: 'Edit Truck',
          name: 'edit-truck',
          class: 'regular-text',
          contentType: 'edit',
        },
        {
          title: 'Add Registration',
          name: 'add-registration',
          class: 'regular-text',
          contentType: 'add',
        },
        {
          title: 'Add Inspection',
          name: 'add-inspection',
          class: 'regular-text',
          contentType: 'add',
        },
        {
          title: 'Add Repair',
          name: 'add-repair',
          class: 'regular-text',
          contentType: 'add',
        },
        {
          title: 'Activate',
          reverseTitle: 'Deactivate',
          name: 'activate-item',
          class: 'regular-text',
          contentType: 'activate',
        },
        {
          title: 'Delete',
          name: 'delete-item',
          type: 'truck',
          text: 'Are you sure you want to delete truck(s)?',
          class: 'delete-text',
          contentType: 'delete',
        },
      ],
      export: true,
    };
  }

  getTrucksData() {
    this.sendTruckData();
  }

  sendTruckData() {
    this.tableData = [
      {
        title: 'Active',
        field: 'active',
        length: 15,
        data: this.getDumyData(15),
        extended: false,
        gridNameTitle: 'Truck',
        stateName: 'trucks',
        gridColumns: this.getGridColumns('trucks', this.resetColumns),
      },
      {
        title: 'Inactive',
        field: 'inactive',
        length: 8,
        data: this.getDumyData(8),
        extended: false,
        gridNameTitle: 'Truck',
        stateName: 'trucks',
        gridColumns: this.getGridColumns('trucks', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setTruckData(td);
  }

  private getGridColumns(stateName: string, resetColumns: boolean): any[] {
    const userState: any = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );
    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      return getTruckColumnDefinition();
    }
  }

  setTruckData(td: any) {
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
        id: 407,
        companyId: 1,
        divisionFlag: 0,
        companyOwned: 1,
        ownerId: 104,
        ownerName: 'JD FREIGHT',
        truckNumber: '0867',
        vin: '2HTFLAHR0WC040867',
        year: 1998,
        categoryId: null,
        category: null,
        make: 'International',
        model: '9400',
        licensePlate: 'P273532',
        licenseExpDate: '2022-03-31T05:00:00Z',
        colorName: 'Black',
        colorCode: '#3D3D3D',
        svgIcon: 'semi-wsleeper.svg',
        svgClass: 'semi-wsleeper-icon',
        length: null,
        fhwaInspection: null,
        status: 1,
        used: 0,
        canBeUsedByCompany: 1,
        location: null,
        longitude: null,
        latitude: null,
        deviceId: null,
        uniqueId: null,
        percentage: null,
        mileage: null,
        doc: {
          titleData: [],
          licenseData: [
            {
              id: 'ddbfc2df-f051-47d1-bc31-1933781a0a06',
              endDate: '2022-03-31T05:00:00Z',
              startDate: '2021-12-06T06:00:00Z',
              attachments: [
                {
                  url: 'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/407/license/bddbd3a60ee746c0abfddd95a09e0d001644001529-0867 reg 2022.pdf',
                  fileName: '0867 reg 2022.pdf',
                  fileItemGuid: 'bddbd3a6-0ee7-46c0-abfd-dd95a09e0d00',
                },
              ],
              licensePlate: 'P273532',
            },
          ],
          additionalData: {
            make: {
              file: 'international.svg',
              name: 'International',
              color: '',
            },
            note: '',
            type: {
              file: 'semi-wsleeper.svg',
              name: 'Semi w/Sleeper',
              type: 'truck',
              class: 'semi-wsleeper-icon',
              color: 'FFC061',
              whiteFile: 'white-semi-wsleeper.svg',
              legendcolor: 'ffc061',
            },
            year: '1998',
            color: {
              id: 920,
              key: 'Black',
              value: '#3D3D3D',
              domain: 'color',
              entityId: null,
              fuelItem: null,
              parentId: null,
              companyId: null,
              createdAt: '2021-02-08T21:34:22',
              protected: 1,
              truckMake: null,
              updatedAt: '2021-02-09T05:39:39',
              entityName: null,
              trailerMake: null,
              truckLength: null,
              entityNameId: null,
              trailerLength: null,
              truckCategory: null,
              companyAccount: null,
              companyContact: null,
              trailerCategory: null,
            },
            model: '9400',
            axises: null,
            engine: null,
            mileage: null,
            tireSize: null,
            ipasEzpass: null,
            emptyWeight: null,
            insurancePolicyNumber: null,
          },
          inspectionData: [
            {
              id: '84c965cf-e89b-45ed-9b42-1ffee68b594b',
              startDate: '2021-12-10T06:00:00Z',
              attachments: [
                {
                  url: 'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/407/inspection/0afa0c2f0ab64cb7aa62edad326fd1b41643998644-0867 insp 12.10.21.pdf',
                  fileName: '0867 insp 12.10.21.pdf',
                  fileItemGuid: '0afa0c2f-0ab6-4cb7-aa62-edad326fd1b4',
                },
              ],
            },
          ],
          truckLeaseData: [],
          activityHistory: [
            {
              id: 'd3f3dcf5-880d-4d8a-98da-fb48cef8a4f5',
              dialog: false,
              header: 'JD FREIGHT, INC.',
              endDate: '',
              ownerId: 1,
              startDate: '2022-02-04T18:13:25.962Z',
              showDelete: false,
              showDialog: false,
              endDateShort: null,
              startDateShort: '2/4/22',
              showEndDateAction: false,
              showStartDateAction: false,
            },
          ],
        },
        protected: 0,
        createdAt: '2022-02-04T18:12:06',
        updatedAt: '2022-02-04T19:05:30',
        gpsFlag: null,
        violation: [],
        accident: [],
        fuel: [],
        guid: 'b03b16cf-90e7-4970-9506-6b8acaef825e',
        textYear: '1998',
        textMake: 'International',
        textModel: '9400',
        color: '#3D3D3D',
        truckType: 'Semi w/Sleeper',
        truckLicensePlate: 'P273532',
        truckInspectionProgres: {
          start: '2021-12-10T06:00:00Z',
        },
        truckInsurancePolicyNumber: '',
        truckAxises: '',
        truckEmptyWeight: '',
        truckEngine: '',
        truckTireSize: '',
        truckMileage: '',
        truckIpasEzpass: '',
      },
    ];

    for (let i = 0; i < numberOfCopy; i++) {
      data.push(data[i]);
    }

    return data;
  }

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      this.modalService.openModal(TruckModalComponent, { size: 'small' });
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;
      this.setTruckData(event.tabData);
    }
  }

  public onTableBodyActions(event: any) {
    if (event.type === 'edit-truck') {
      this.modalService.openModal(
        TruckModalComponent,
        { size: 'small' },
        {
          ...event,
          type: 'edit'
        }
      );
    }
  }
}
