import { Component, OnInit } from '@angular/core';
import { CustomModalService } from 'src/app/core/services/modals/custom-modal.service';
import { getToolsAccountsColumnDefinition } from 'src/assets/utils/settings/toolsAccounts-columns';

@Component({
  selector: 'app-account-table',
  templateUrl: './account-table.component.html',
  styleUrls: ['./account-table.component.scss'],
})
export class AccountTableComponent implements OnInit {
  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'active';
  resetColumns: boolean;

  constructor(private customModalService: CustomModalService) {}

  ngOnInit(): void {
    this.initTableOptions();

    this.getAccountData();
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
          name: 'edit-account',
        },
        {
          title: 'Delete',
          name: 'delete-account',
          type: 'account',
          text: 'Are you sure you want to delete account(s)?',
        },
      ],
      export: true,
    };
  }

  getAccountData() {
    this.sendAccountData();
  }

  sendAccountData() {
    this.tableData = [
      {
        title: 'Accounts',
        field: 'active',
        extended: false,
        length: 8,
        data: this.getDumyData(8),
        gridNameTitle: 'Account',
        stateName: 'accounts',
        gridColumns: this.getGridColumns('accounts', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setAccountData(td);
  }

  getGridColumns(stateName: string, resetColumns: boolean) {
    const userState: any = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );

    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      return getToolsAccountsColumnDefinition();
    }
  }

  setAccountData(td: any) {
    this.viewData = td.data;
    this.columns = td.gridColumns;

    this.viewData = this.viewData.map((data) => {
      data.isSelected = false;
      return data;
    });

    console.log('setAccountData');

    console.log(this.viewData);
    console.log(this.columns);
  }

  getDumyData(numberOfCopy: number) {
    let data: any[] = [
      {
        id: 95,
        companyId: 1,
        contactType: 'both',
        name: 'Advokat Doug',
        labelId: 1134,
        labelName: '333',
        labelColor: '#49CBFF',
        phone: null,
        email: null,
        address: null,
        addressUnit: null,
        username: 'Test',
        note: null,
        url: 'https://www.youtube.com/watch?v=pBAkrxTkkWw',
        doc: {
          note: '',
          email: 'testets@gmail.com',
          phone: '(847) 241-2074',
          address: 'New York, NY, USA',
          address_unit: '',
        },
        createdAt: '2022-01-10T17:00:13',
        updatedAt: '2022-02-15T12:28:27',
        textPhone: '(847) 241-2074',
        textEmail: 'testets@gmail.com',
        textAddress: 'New York, NY, USA',
      },
    ];

    for (let i = 0; i < numberOfCopy; i++) {
      data.push(data[i]);
    }

    return data;
  }

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      alert('Treba da se uradi modal!');
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;
      this.setAccountData(event.tabData);
    }
  }
}
