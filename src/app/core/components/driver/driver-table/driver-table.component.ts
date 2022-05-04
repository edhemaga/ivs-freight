import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { getApplicantColumnsDefinition } from 'src/assets/utils/settings/applicant-columns';
import { getDriverColumnsDefinition } from 'src/assets/utils/settings/driver-columns';
import { DriversQuery } from '../state/driver.query';
import { DriversState } from '../state/driver.store';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { DriverModalComponent } from '../../modals/driver-modal/driver-modal.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-driver-table',
  templateUrl: './driver-table.component.html',
  styleUrls: ['./driver-table.component.scss'],
})
export class DriverTableComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'active';
  resetColumns: boolean;

  public drivers: DriversState[] = [];

  constructor(
    private modalService: ModalService,
    private driversQuery: DriversQuery,
    private tableService: TruckassistTableService,
    public datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.initTableOptions();
    this.getDriversData();

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.resetColumns = response;

          this.sendDriverData();
        }
      });
  }

  public initTableOptions(): void {
    this.tableOptions = {
      disabledMutedStyle: null,
      toolbarActions: {
        hideViewMode: false,
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
          class: 'regular-text',
          contentType: 'edit',
        },
        {
          title: 'Add CDL',
          name: 'new-licence',
          class: 'regular-text',
          contentType: 'add',
        },
        {
          title: 'Add Medical',
          name: 'new-medical',
          class: 'regular-text',
          contentType: 'add',
        },
        {
          title: 'Add MVR',
          name: 'new-mvr',
          class: 'regular-text',
          contentType: 'add',
        },
        {
          title: 'Add Test',
          name: 'new-drug',
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
          type: 'driver',
          text: 'Are you sure you want to delete driver(s)?',
          class: 'delete-text',
          contentType: 'delete',
        },
      ],
      export: true,
    };
  }

  getDriversData() {
    this.sendDriverData();
  }

  sendDriverData() {
    this.tableData = [
      {
        title: 'Applicants',
        field: 'applicants',
        length: 8,
        data: this.getDumyData(),
        extended: true,
        gridNameTitle: 'Driver',
        stateName: 'applicants',
        gridColumns: this.getGridColumns('applicants', this.resetColumns),
      },
      {
        title: 'Active',
        field: 'active',
        length: 5,
        data: this.getDumyData(),
        extended: false,
        gridNameTitle: 'Driver',
        stateName: 'drivers',
        gridColumns: this.getGridColumns('drivers', this.resetColumns),
      },
      {
        title: 'Inactive',
        field: 'inactive',
        length: 10,
        data: this.getDumyData(),
        extended: false,
        gridNameTitle: 'Driver',
        stateName: 'drivers',
        gridColumns: this.getGridColumns('drivers', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    console.log('Table Data Befor Map');
    console.log(td)

    this.setDriverData(td);
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

  setDriverData(td: any) {
    this.viewData = td.data;
    this.columns = td.gridColumns;

    this.viewData = this.viewData.map((data: DriversState) => {
      return {
        ...data,
        isSelected: false,
        textAddress: data.address.address ? data.address.address : '',
        textDOB: data.dateOfBirth ? this.datepipe.transform(data.dateOfBirth, 'dd/MM/yy') : '',
        textHired: data.hired ? this.datepipe.transform(data.hired, 'dd/MM/yy') : '',
        textCDL: data.cdlNumber ? data.cdlNumber : '',
        textState: data.address.state ? data.address.state : '',
        textBank: data.bank ? data.bank : '',
        textAccount: data.account ? data.account : '',
        textRouting: data.routing ? data.routing : '',
        tableCDLData: data.cdlExpiration ? data.cdlExpiration : {},
        tableMedicalData: data.medicalExpiration ? data.medicalExpiration : {},
        tableMvrData: data.mvrIssueDate ? data.mvrIssueDate : {},
      };
    });

    console.log('viewData');
    console.log(this.viewData);
  }

  getDumyData() {
    this.drivers = this.driversQuery.getAll()[0];

    return this.drivers;
  }

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      this.modalService.openModal(DriverModalComponent, {
        size: 'small',
      });
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;
      this.setDriverData(event.tabData);
    }
  }

  public onTableBodyActions(event: any) {
    if (event.type === 'edit') {
      this.modalService.openModal(
        DriverModalComponent,
        { size: 'small' },
        {
          ...event,
          disableButton: true
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
