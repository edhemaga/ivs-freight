import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { tableSearch } from 'src/app/core/utils/methods.globals';
import { getToolsAccountsColumnDefinition } from 'src/assets/utils/settings/toolsAccounts-columns';
import { AccountModalComponent } from '../../modals/account-modal/account-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { AccountQuery } from '../state/account-state/account.query';
import { AccountState } from '../state/account-state/account.store';

@Component({
  selector: 'app-account-table',
  templateUrl: './account-table.component.html',
  styleUrls: ['./account-table.component.scss'],
})
export class AccountTableComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  
  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'active';
  resetColumns: boolean;
  tableContainerWidth: number = 0;
  resizeObserver: ResizeObserver;
  accounts: AccountState[] = [];

  constructor(private modalService: ModalService,  private tableService: TruckassistTableService, private accountQuery: AccountQuery) {}

  ngOnInit(): void {
    this.sendAccountData();

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.resetColumns = response;

          this.sendAccountData();
        }
      });

    // Resize
    this.tableService.currentColumnWidth
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        if (response?.event?.width) {
          this.columns = this.columns.map((c) => {
            if (c.title === response.columns[response.event.index].title) {
              c.width = response.event.width;
            }

            return c;
          });
        }
      });

    // Toaggle Columns
    this.tableService.currentToaggleColumn
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        if (response?.column) {
          this.columns = this.columns.map((c) => {
            if (c.field === response.column.field) {
              c.hidden = response.column.hidden;
            }

            return c;
          });
        }
      });

    // Search
    this.tableService.currentSearchTableData
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res) {
          /* const searchEvent = tableSearch(
            res,
            this.backFilterQuery,
            this.selectedTab
          );

          if (searchEvent) {
            if (searchEvent.action === 'api') {
              this.driverBackFilter(searchEvent.query);
            } else if (searchEvent.action === 'store') {
              this.sendAccountData();
            }
          } */
        }
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.observTableContainer();
    }, 10);
  }

  observTableContainer() {
    this.resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        this.tableContainerWidth = entry.contentRect.width;
      });
    });

    this.resizeObserver.observe(document.querySelector('.table-container'));
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

  sendAccountData() {
    this.initTableOptions();

    const accountData = this.getTabData();

    console.log('Account Data');
    console.log(accountData);
    
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

  getTabData() {
    this.accounts = this.accountQuery.getAll();

    return this.accounts?.length ? this.accounts : [];
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

  onTableHeadActions(event: any) {
    if (event.action === 'sort') {
      if (event.direction) {
        /* this.backFilterQuery.active = this.selectedTab === 'active' ? 1 : 0;
        this.backFilterQuery.sort = event.direction;

        this.driverBackFilter(this.backFilterQuery); */
      } else {
        this.sendAccountData();
      }
    }
  }

  public onTableBodyActions(event: any) {
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

  ngOnDestroy(): void {
    this.tableService.sendActionAnimation({});
    this.resizeObserver.unobserve(document.querySelector('.table-container'));
    this.resizeObserver.disconnect();
  }
}
