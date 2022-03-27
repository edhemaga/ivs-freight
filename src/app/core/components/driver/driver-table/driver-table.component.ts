import { Driver } from './../state/driver.model';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CustomModalService } from 'src/app/core/services/modals/custom-modal.service';
import { getApplicantColumnsDefinition } from 'src/assets/utils/settings/applicant-columns';
import { getDriverColumnsDefinition } from 'src/assets/utils/settings/driver-columns';
import { DriverManageComponent } from '../../modals/driver-manage/driver-manage.component';
import { DriversQuery } from '../state/driver.query';
import { DriversState } from '../state/driver.store';
import { data } from 'jquery';

@Component({
  selector: 'app-driver-table',
  templateUrl: './driver-table.component.html',
  styleUrls: ['./driver-table.component.scss'],
})
export class DriverTableComponent implements OnInit {
  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'active';
  resetColumns: boolean;

  public drivers: DriversState[] = [];

  constructor(
    private customModalService: CustomModalService,
    private driversQuery: DriversQuery
  ) {}

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
        hideViewMode: true,
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
    this.tableData = [
      {
        title: 'Applicants',
        field: 'applicants',
        length: 8,
        data: this.getDumyData(8),
        extended: true,
        gridNameTitle: 'Applicant',
        stateName: 'applicants',
        gridColumns: this.getGridColumns('applicants', this.resetColumns),
      },
      {
        title: 'Active',
        field: 'active',
        length: 5,
        data: this.getDumyData(5),
        extended: false,
        gridNameTitle: 'Driver',
        stateName: 'drivers',
        gridColumns: this.getGridColumns('drivers', this.resetColumns),
      },
      {
        title: 'Inactive',
        field: 'inactive',
        length: 10,
        data: this.getDumyData(10),
        extended: false,
        gridNameTitle: 'Driver',
        stateName: 'drivers',
        gridColumns: this.getGridColumns('drivers', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

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
        isSelected: false
      }
    });
  }

  getDumyData(numberOfCopy: number) {
    this.drivers = this.driversQuery.getAll();
    for (let i = 0; i < numberOfCopy; i++) {
      this.drivers.push(this.drivers[i]);
    }
    return this.drivers;
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
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;
      this.setDriverData(event.tabData);
    }
  }
}
