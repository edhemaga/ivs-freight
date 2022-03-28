import { Component, OnInit } from '@angular/core';
import { CustomModalService } from 'src/app/core/services/modals/custom-modal.service';
import { getToolsContactsColumnDefinition } from 'src/assets/utils/settings/contacts-columns';

@Component({
  selector: 'app-accident-table',
  templateUrl: './accident-table.component.html',
  styleUrls: ['./accident-table.component.scss']
})
export class AccidentTableComponent implements OnInit {
  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'active';
  resetColumns: boolean;

  constructor(private customModalService: CustomModalService) {}

  ngOnInit(): void {
    this.initTableOptions();

    this.getContactData();
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
          name: 'edit-contact',
        },
        {
          title: 'Delete',
          type: 'contact',
          name: 'delete-contact',
          text: 'Are you sure you want to delete contact(s)?',
        },
      ],
      export: true,
    };
  }

  getContactData() {
    this.sendContactData();
  }

  sendContactData() {
    this.tableData = [
      {
        title: 'Contacts',
        field: 'active',
        length: 10,
        data: this.getDumyData(10),
        extended: false,
        gridNameTitle: 'Contact',
        stateName: 'contacts',
        gridColumns: this.getGridColumns('contacts', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setContactData(td);
  }

  getGridColumns(stateName: string, resetColumns: boolean) {
    const userState: any = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );

    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      return getToolsContactsColumnDefinition();
    }
  }

  setContactData(td: any) {
    this.viewData = td.data;
    this.columns = td.gridColumns;

    this.viewData = this.viewData.map((data) => {
      data.isSelected = false;
      return data;
    });
  }

  getDumyData(numberOfCopy: number) {
    let data: any[] = [];

    /* for (let i = 0; i < numberOfCopy; i++) {
      data.push(data[i]);
    }

    return data; */
  }

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      alert('Treba da se odradi modal!');
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;
      this.setContactData(event.tabData);
    }
  }
}
