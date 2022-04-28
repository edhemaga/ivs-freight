import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { getToolsAccountsColumnDefinition } from 'src/assets/utils/settings/toolsAccounts-columns';
import { AccountModalComponent } from '../../modals/account-modal/account-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';

@Component({
  selector: 'app-account-table',
  templateUrl: './account-table.component.html',
  styleUrls: ['./account-table.component.scss'],
})
export class AccountTableComponent implements OnInit {
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
    this.getAccountData();

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.resetColumns = response;

          this.sendAccountData();
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
          name: 'edit-account',
          class: 'regular-text',
          contentType: 'edit',
        },
        {
          title: 'Delete',
          name: 'delete-account',
          type: 'account',
          text: 'Are you sure you want to delete account(s)?',
          class: 'delete-text',
          contentType: 'delete',
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

  public onTableBodyActions(event: any) {
    console.log(event)
    if (event.type === 'edit-account') {
      this.modalService.openModal(
        AccountModalComponent,
        { size: 'small' },
        {
          ...event,
          type: 'edit'
        }
      );
    }
  }

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      this.modalService.openModal(
        AccountModalComponent,
        { size: 'small' }
      );
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;
      this.setAccountData(event.tabData);
    }
  }
}
