import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import {
  closeAnimationAction,
  tableSearch,
} from 'src/app/core/utils/methods.globals';
import { getToolsAccountsColumnDefinition } from 'src/assets/utils/settings/toolsAccounts-columns';
import { AccountModalComponent } from '../../modals/account-modal/account-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { AccountQuery } from '../state/account-state/account.query';
import { AccountState } from '../state/account-state/account.store';
import { AccountTService } from '../state/account.service';

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

  constructor(
    private modalService: ModalService,
    private tableService: TruckassistTableService,
    private accountQuery: AccountQuery,
    private accountService: AccountTService
  ) {}

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

    // Account Actions
    this.tableService.currentActionAnimation
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        // Add Account
        if (res.animation === 'add') {
          this.viewData.push(this.mapAccountData(res.data));

          this.viewData = this.viewData.map((account: any) => {
            if (account.id === res.id) {
              account.actionAnimation = 'add';
            }

            return account;
          });

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
          }, 1000);

          this.updateDataCount();
        }
        // Update Account
        else if (res.animation === 'update') {
          const updatedAccount = this.mapAccountData(res.data);

          this.viewData = this.viewData.map((account: any) => {
            if (account.id === res.id) {
              account = updatedAccount;
              account.actionAnimation = 'update';
            }

            return account;
          });

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
          }, 1000);
        }
        // Delete Account
        else if (res.animation === 'delete') {
          let accountIndex: number;

          this.viewData = this.viewData.map((account: any, index: number) => {
            if (account.id === res.id) {
              account.actionAnimation = 'delete';
              accountIndex = index;
            }

            return account;
          });

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            this.viewData.splice(accountIndex, 1);
            clearInterval(inetval);
          }, 1000);

          this.updateDataCount();
        }
      });

    // Delete Selected Rows
    this.tableService.currentDeleteSelectedRows
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any[]) => {
        if (response.length) {
          this.accountService
            .deleteAccountList(response)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.viewData = this.viewData.map((account: any) => {
                response.map((r: any) => {
                  if (account.id === r.id) {
                    account.actionAnimation = 'delete';
                  }
                });

                return account;
              });

              this.updateDataCount();

              const inetval = setInterval(() => {
                this.viewData = closeAnimationAction(true, this.viewData);

                clearInterval(inetval);
              }, 1000);

              this.tableService.sendRowsSelected([]);
              this.tableService.sendResetSelectedColumns(true);
            });
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
        viewModeActive: 'List',
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

    const accontCount = JSON.parse(localStorage.getItem('accountTableCount'));

    const accountData = this.getTabData();

    this.tableData = [
      {
        title: 'Accounts',
        field: 'active',
        extended: false,
        length: accontCount.account,
        data: accountData,
        gridNameTitle: 'Account',
        stateName: 'accounts',
        gridColumns: this.getGridColumns('accounts', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setAccountData(td);
  }

  updateDataCount() {
    const accountCount = JSON.parse(localStorage.getItem('accountTableCount'));

    this.tableData[0].length = accountCount.account;
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
    this.columns = td.gridColumns;

    if (td.data.length) {
      this.viewData = td.data;

      this.viewData = this.viewData.map((data: any) => {
        return this.mapAccountData(data);
      });

      console.log('Account Data');
      console.log(this.viewData);

      // For Testing
      // for (let i = 0; i < 300; i++) {
      //   this.viewData.push(this.viewData[0]);
      // }
    } else {
      this.viewData = [];
    }
  }

  mapAccountData(data: any) {
    return {
      ...data,
      isSelected: false,
    };
  }

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      this.modalService.openModal(AccountModalComponent, { size: 'small' });
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;
      this.setAccountData(event.tabData);
    } else if (event.action === 'view-mode') {
      this.tableOptions.toolbarActions.viewModeActive = event.mode;
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
          type: 'edit',
        }
      );
    } else if (event.type === 'delete-account') {
      this.accountService.deleteCompanyAccountById(event.id).pipe(takeUntil(this.destroy$)).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.tableService.sendActionAnimation({});
    this.resizeObserver.unobserve(document.querySelector('.table-container'));
    this.resizeObserver.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
