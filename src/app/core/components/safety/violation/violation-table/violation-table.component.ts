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
        length: 10,
        data: this.getDumyData(10),
        extended: false,
        gridNameTitle: 'Violations',
        stateName: 'violations',
        gridColumns: this.getGridColumns('violations', this.resetColumns),
      },
      {
        title: 'Summary',
        field: 'summary',
        type: 'violations_summary',
        length: 10,
        data: this.getDumyData(10),
        extended: false,
        gridNameTitle: 'Summary',
        stateName: 'violations_summary',
        gridColumns: this.getGridColumns('violations_summary', this.resetColumns),
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
    let data: any[] = [];

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

