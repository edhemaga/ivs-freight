import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { formatPhonePipe } from 'src/app/core/pipes/formatPhone.pipe';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import {
  closeAnimationAction,
  tableSearch,
} from 'src/app/core/utils/methods.globals';
import { getOwnerColumnDefinition } from 'src/assets/utils/settings/owner-columns';
import { OwnerModalComponent } from '../../modals/owner-modal/owner-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { OwnerActiveQuery } from '../state/owner-active-state/owner-active.query';
import { OwnerActiveState } from '../state/owner-active-state/owner-active.store';
import { OwnerInactiveQuery } from '../state/owner-inactive-state/owner-inactive.query';
import { OwnerInactiveState } from '../state/owner-inactive-state/owner-inactive.store';
import { OwnerTService } from '../state/owner.service';

@Component({
  selector: 'app-owner-table',
  templateUrl: './owner-table.component.html',
  styleUrls: ['./owner-table.component.scss'],
  providers: [formatPhonePipe],
})
export class OwnerTableComponent implements OnInit, AfterViewInit {
  private destroy$: Subject<void> = new Subject<void>();

  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'active';
  resetColumns: boolean;
  tableContainerWidth: number = 0;
  resizeObserver: ResizeObserver;
  public ownerActive: OwnerActiveState[] = [];
  public ownerInactive: OwnerInactiveState[] = [];

  constructor(
    private modalService: ModalService,
    private tableService: TruckassistTableService,
    private ownerActiveQuery: OwnerActiveQuery,
    private ownerInactiveQuery: OwnerInactiveQuery,
    private ownerService: OwnerTService,
    private phonePipe: formatPhonePipe
  ) {}

  ngOnInit(): void {
    this.sendOwnerData();

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.resetColumns = response;

          this.sendOwnerData();
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
              this.sendOwnerData();
            }
          } */
        }
      });

    // Delete Selected Rows
    this.tableService.currentDeleteSelectedRows
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any[]) => {
        if (response.length) {
          this.ownerService
            .deleteOwnerList(response, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.viewData = this.viewData.map((owner: any) => {
                response.map((r: any) => {
                  if (owner.id === r.id) {
                    owner.actionAnimation = 'delete';
                  }
                });

                return owner;
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

    // Owner Actions
    this.tableService.currentActionAnimation
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        // Add Owner
        if (res.animation === 'add') {
          if (this.selectedTab === 'inactive') {
            this.viewData.push(this.mapOwnerData(res.data));

            this.viewData = this.viewData.map((owner: any) => {
              if (owner.id === res.id) {
                owner.actionAnimation = 'add';
              }

              return owner;
            });

            const inetval = setInterval(() => {
              this.viewData = closeAnimationAction(false, this.viewData);

              clearInterval(inetval);
            }, 1000);
          }

          this.updateDataCount();
        }
        // Update Owner
        else if (res.animation === 'update' && this.selectedTab === res.tab) {
          const updatedOwner = this.mapOwnerData(res.data);

          this.viewData = this.viewData.map((owner: any) => {
            if (owner.id === res.id) {
              owner = updatedOwner;
              owner.actionAnimation = 'update';
            }

            return owner;
          });

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
          }, 1000);
        }
        // Delete Owner
        else if (res.animation === 'delete') {
          if (this.selectedTab === res.tab) {
            let ownerIndex: number;

            this.viewData = this.viewData.map((owner: any, index: number) => {
              if (owner.id === res.id) {
                owner.actionAnimation = 'delete';
                ownerIndex = index;
              }

              return owner;
            });

            const inetval = setInterval(() => {
              this.viewData = closeAnimationAction(false, this.viewData);

              this.viewData.splice(ownerIndex, 1);
              clearInterval(inetval);
            }, 1000);
          }

          this.updateDataCount();
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

  initTableOptions(): void {
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
          name: 'edit-owner',
          class: 'regular-text',
          contentType: 'edit',
        },
        {
          title: 'Delete',
          name: 'delete-owner',
          type: 'owner',
          text: 'Are you sure you want to delete owner(s)?',
          class: 'delete-text',
          contentType: 'delete',
        },
      ],
      export: true,
    };
  }

  sendOwnerData() {
    this.initTableOptions();

    const ownerCount = JSON.parse(localStorage.getItem('ownerTableCount'));

    const ownerActiveData =
      this.selectedTab === 'active' ? this.getTabData('active') : [];

    const ownerInactiveData =
      this.selectedTab === 'inactive' ? this.getTabData('inactive') : [];

    this.tableData = [
      {
        title: 'Active',
        field: 'active',
        length: ownerCount.active,
        data: ownerActiveData,
        extended: false,
        gridNameTitle: 'Owner',
        stateName: 'owners',
        gridColumns: this.getGridColumns('owners', this.resetColumns),
      },
      {
        title: 'Inactive',
        field: 'inactive',
        length: ownerCount.inactive,
        data: ownerInactiveData,
        extended: false,
        gridNameTitle: 'Owner',
        stateName: 'owners',
        gridColumns: this.getGridColumns('owners', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setOwnerData(td);
  }

  updateDataCount() {
    const ownerCount = JSON.parse(localStorage.getItem('ownerTableCount'));

    this.tableData[0].length = ownerCount.active;
    this.tableData[1].length = ownerCount.inactive;
  }

  getGridColumns(stateName: string, resetColumns: boolean) {
    const userState: any = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );

    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      return getOwnerColumnDefinition();
    }
  }

  setOwnerData(td: any) {
    this.columns = td.gridColumns;

    if (td.data.length) {
      this.viewData = td.data;

      this.viewData = this.viewData.map((data: any, index: number) => {
        return this.mapOwnerData(data);
      });

      // For Testing
      // for (let i = 0; i < 300; i++) {
      //   this.viewData.push(this.viewData[0]);
      // }
    } else {
      this.viewData = [];
    }
  }

  mapOwnerData(data: any) {
    return {
      ...data,
      isSelected: false,
      textType: data?.ownerType?.name ? data.ownerType.name : '',
      textPhone: data?.phone ? this.phonePipe.transform(data.phone) : '',
      textAddress: data?.address?.address ? data.address.address : '',
    };
  }

  getTabData(dataType: string) {
    if (dataType === 'active') {
      this.ownerActive = this.ownerActiveQuery.getAll();

      return this.ownerActive?.length ? this.ownerActive : [];
    } else if (dataType === 'inactive') {
      this.ownerInactive = this.ownerInactiveQuery.getAll();

      return this.ownerInactive?.length ? this.ownerInactive : [];
    }
  }

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      this.modalService.openModal(OwnerModalComponent, { size: 'small' });
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;

      this.sendOwnerData();
    } else if (event.action === 'view-mode') {
      this.tableOptions.toolbarActions.viewModeActive = event.mode;
    }
  }

  onTableHeadActions(event: any) {
    if (event.action === 'sort') {
      if (event.direction) {
        /*   this.backFilterQuery.active = this.selectedTab === 'active' ? 1 : 0;
        this.backFilterQuery.sort = event.direction;

        this.driverBackFilter(this.backFilterQuery); */
      } else {
        this.sendOwnerData();
      }
    }
  }

  onTableBodyActions(event: any) {
    if (event.type === 'edit-owner') {
      this.modalService.openModal(
        OwnerModalComponent,
        { size: 'small' },
        {
          ...event,
          type: 'edit',
          selectedTab: this.selectedTab,
        }
      );
    } else if (event.type === 'delete-owner') {
      this.ownerService
        .deleteOwnerById(event.id, this.selectedTab)
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }
  }
}
