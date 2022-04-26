import { Component, OnInit } from '@angular/core';
import { getTrailerColumnDefinition } from 'src/assets/utils/settings/trailer-columns';
import { TrailerModalComponent } from '../../modals/trailer-modal/trailer-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';

@Component({
  selector: 'app-trailer-table',
  templateUrl: './trailer-table.component.html',
  styleUrls: ['./trailer-table.component.scss'],
})
export class TrailerTableComponent implements OnInit {
  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'active';
  resetColumns: boolean;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.initTableOptions();

    this.getTrucksData();
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
          title: 'Edit Trailer',
          name: 'edit-trailer',
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
          title: 'Activate',
          reverseTitle: 'Deactivate',
          name: 'activate-item',
          class: 'regular-text',
          contentType: 'activate',
        },
        {
          title: 'Delete',
          name: 'delete-item',
          type: 'trailer',
          text: 'Are you sure you want to delete trailer(s)?',
          class: 'delete-text',
          contentType: 'delete',
        },
      ],
      export: true,
    };
  }

  getTrucksData() {
    this.sendTrailerData();
  }

  sendTrailerData() {
    this.tableData = [
      {
        title: 'Active',
        field: 'active',
        length: 15,
        data: this.getDumyData(15),
        extended: false,
        gridNameTitle: 'Trailer',
        stateName: 'trailers',
        gridColumns: this.getGridColumns('trailers', this.resetColumns),
      },
      {
        title: 'Inactive',
        field: 'inactive',
        length: 25,
        data: this.getDumyData(25),
        extended: false,
        gridNameTitle: 'Trailer',
        stateName: 'trailers',
        gridColumns: this.getGridColumns('trailers', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setTrailerData(td);
  }

  private getGridColumns(stateName: string, resetColumns: boolean): any[] {
    const userState: any = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );

    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      return getTrailerColumnDefinition();
    }
  }

  setTrailerData(td: any) {
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
        id: 104,
        companyId: 1,
        companyOwned: 0,
        divisionFlag: null,
        ownerId: 466,
        ownerName: 'ERA TRUCKING LLC',
        trailerNumber: 'R504',
        vin: '1UYVS3605AM932301',
        year: '2010',
        categoryId: 1,
        category: 'Bank of America',
        make: null,
        model: '',
        licensePlate: 'J783209',
        licenseExpDate: null,
        fhwaInspection: null,
        svgIcon: 'reefer.svg',
        length: 0,
        status: 1,
        used: 0,
        canBeUsedByCompany: 1,
        doc: {
          titleData: [],
          licenseData: [
            {
              id: 'b26b5982-9d55-420a-b397-bc56a74d6915',
              startDate: '2020-07-15T05:00:00Z',
              attachments: [],
              licensePlate: 'J783209',
            },
          ],
          additionalData: {
            make: {
              file: 'utility.svg',
              name: 'Utility',
              color: '',
            },
            note: '',
            type: {
              file: 'reefer.svg',
              name: 'Reefer',
              type: 'trailer',
              class: 'reefer-icon',
              color: 'EF6E6E',
              whiteFile: 'white-reefer.svg',
              legendcolor: 'ef6e6e',
            },
            year: '2010',
            color: {
              id: 921,
              key: 'White',
              value: '#F9F9F9',
              domain: 'color',
              entityId: null,
              parentId: null,
              companyId: null,
              createdAt: '2021-02-08T21:34:33',
              protected: 1,
              updatedAt: '2021-02-09T05:39:40',
              entityName: null,
            },
            model: '',
            axises: '',
            length: {
              id: 671,
              key: 'length',
              value: '48 ft',
              domain: 'trailer',
              entityId: null,
              parentId: null,
              companyId: null,
              createdAt: '2020-10-23T17:15:33',
              protected: 0,
              updatedAt: '2020-10-23T17:15:33',
              entityName: null,
            },
            tireSize: null,
          },
          inspectionData: [
            {
              id: '2ad2fbef-f024-4ecb-876d-ea38894ed6fe',
              startDate: '2021-06-08T05:00:00Z',
              attachments: [
                {
                  url: 'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/104/inspection/2ad2fbeff0244ecb876dea38894ed6fe1623258561-R504 6.8.21.pdf',
                  fileName: 'R504 6.8.21.pdf',
                  fileItemGuid: '2ad2fbef-f024-4ecb-876d-ea38894ed6fe',
                },
              ],
            },
          ],
          activityHistory: [
            {
              id: '1dcd5580-c4ab-4352-b318-eef3829ac73e',
              header: 'ERA TRUCKING LLC',
              endDate: null,
              ownerId: 466,
              startDate: '2021-06-07T16:51:56.451Z',
              endDateShort: null,
              startDateShort: '6/7/21',
            },
          ],
          trailerLeaseData: [],
        },
        protected: 0,
        createdAt: '2021-06-07T16:51:56',
        updatedAt: '2021-12-29T15:07:37',
        gpsFlag: null,
        guid: '3bbdf681-64d3-4223-9479-4a769603b1e6',
        textYear: '2010',
        textMake: 'Utility',
        textModel: '',
        textColor: '#F9F9F9',
        textType: 'Reefer',
        textLicPlate: 'J783209',
        textInspectionData: {
          start: '2021-06-08T05:00:00Z',
        },
        textLength: '48 ft',
        tableType: {
          file: 'reefer.svg',
          name: 'Reefer',
          type: 'trailer',
          class: 'reefer-icon',
          color: 'EF6E6E',
          whiteFile: 'white-reefer.svg',
          legendcolor: 'ef6e6e',
        },
      },
    ];

    for (let i = 0; i < numberOfCopy; i++) {
      data.push(data[i]);
    }

    return data;
  }

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      this.modalService.openModal(TrailerModalComponent, {
        size: 'small',
      });
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;
      this.setTrailerData(event.tabData);
    }
  }

  public onTableBodyActions(event: any) {
    if (event.type === 'edit-trailer') {
      this.modalService.openModal(
        TrailerModalComponent,
        { size: 'small' },
        {
          ...event,
          type: 'edit'
        }
      );
    }
  }
}
