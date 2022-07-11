import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { getAccidentColumns } from 'src/assets/utils/settings/safety-columns';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { AccidentModalComponent } from '../accident-modal/accident-modal.component';

@Component({
  selector: 'app-accident-table',
  templateUrl: './accident-table.component.html',
  styleUrls: ['./accident-table.component.scss'],
})
export class AccidentTableComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();

  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'active';
  resetColumns: boolean;

  constructor(
    private modalService: ModalService,
    private tableService: TruckassistTableService
  ) {}

  ngOnInit(): void {
    this.initTableOptions();
    this.getAccidentData();

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.resetColumns = response;

          this.sendAccidentData();
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
          title: 'Edit',
          name: 'edit-accident',
          class: 'regular-text',
          contentType: 'edit',
        },
        {
          title: 'Delete',
          name: 'delete',
          type: 'safety',
          text: 'Are you sure you want to delete accident?',
          class: 'delete-text',
          contentType: 'delete',
        },
      ],
      export: true,
    };
  }

  getAccidentData() {
    this.sendAccidentData();
  }

  sendAccidentData() {
    this.tableData = [
      {
        title: 'Reportable',
        field: 'active',
        length: 10,
        data: this.getDumyData(10),
        extended: false,
        gridNameTitle: 'Accident',
        stateName: 'accidents',
        gridColumns: this.getGridColumns('accidents', this.resetColumns),
      },
      {
        title: 'Non-Reportable',
        field: 'non-reportable',
        length: 7,
        data: this.getDumyData(7),
        extended: false,
        gridNameTitle: 'Accident',
        stateName: 'accidents_non-reportable',
        gridColumns: this.getGridColumns('accidents', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setAccidentData(td);
  }

  getGridColumns(stateName: string, resetColumns: boolean) {
    const userState: any = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );

    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      return getAccidentColumns();
    }
  }

  setAccidentData(td: any) {
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
        id: 164,
        companyId: 1,
        driverId: 161,
        driverFullName: 'Cortney Morrow',
        firstName: 'Cortney',
        lastName: 'Morrow',
        avatar:
          'data:image/png;base64,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',
        truckId: 349,
        truckNumber: '1763',
        trailerId: 85,
        trailerNumber: 'V318180',
        policeReport: null,
        csaReport: null,
        eventDate: '03/07/22',
        eventTime: null,
        location: null,
        address: 'New York, NY, USA',
        city: null,
        zip: null,
        county: null,
        state: null,
        country: null,
        longitude: -73.967596,
        latitude: 40.777048,
        report: 'asdsdaf',
        insuranceClaim: null,
        fatality: '0',
        injuries: '0',
        towing: 'No',
        hm: 'No',
        note: null,
        doc: {
          time: '2022-03-07T23:00:00Z',
          truck: 349,
          trailer: 85,
          attachments: [],
          fullAddress: {
            city: 'New York',
            state: 'NY',
            address: 'New York, NY, USA',
            country: 'US',
            zipCode: '',
            streetName: '',
            streetNumber: '',
            stateShortName: 'NY',
          },
        },
        createdAt: '2022-03-07T14:58:45',
        updatedAt: '2022-03-07T14:58:45',
        guid: '5e8c5a59-0d7f-4264-8c5a-a747a8399eb3',
      },
    ];

    for (let i = 0; i < numberOfCopy; i++) {
      data.push(data[i]);
    }

    return data;
  }

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      this.modalService.openModal(AccidentModalComponent, { size: 'large-xl' });
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;
      this.setAccidentData(event.tabData);
    }
  }

  public onTableBodyActions(event: any) {
    switch (event.type) {
      case 'edit-accident': {
        this.modalService.openModal(
          AccidentModalComponent,
          { size: 'large-xl' },
          { id: 21, type: 'edit' }
        );
      }
    }
  }
}
