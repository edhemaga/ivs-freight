import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { GetOwnerListResponse } from 'appcoretruckassist';
import { Subject, takeUntil } from 'rxjs';
import { OwnerModalComponent } from '../../modals/owner-modal/owner-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { OwnerActiveQuery } from '../state/owner-active-state/owner-active.query';
import { OwnerActiveState } from '../state/owner-active-state/owner-active.store';
import { OwnerInactiveQuery } from '../state/owner-inactive-state/owner-inactive.query';
import { OwnerInactiveState } from '../state/owner-inactive-state/owner-inactive.store';
import { OwnerTService } from '../state/owner.service';
import { formatPhonePipe } from '../../../pipes/formatPhone.pipe';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import {
  tableSearch,
  closeAnimationAction,
} from '../../../utils/methods.globals';
import { getOwnerColumnDefinition } from '../../../../../assets/utils/settings/owner-columns';

@Component({
  selector: 'app-owner-table',
  templateUrl: './owner-table.component.html',
  styleUrls: ['./owner-table.component.scss'],
  providers: [formatPhonePipe],
})
export class OwnerTableComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();

  tableOptions: any = {};
  tableData: any[] = [];
  viewData: any[] = [];
  columns: any[] = [];
  selectedTab = 'active';
  activeViewMode: string = 'List';
  tableContainerWidth: number = 0;
  resizeObserver: ResizeObserver;
  ownerActive: OwnerActiveState[] = [];
  ownerInactive: OwnerInactiveState[] = [];
  backFilterQuery = {
    active: 1,
    companyOwnerId: undefined,
    long: undefined,
    lat: undefined,
    distance: undefined,
    truckTypeIds: undefined,
    trailerTypeIds: undefined,
    pageIndex: 1,
    pageSize: 25,
    companyId: undefined,
    sort: undefined,
    searchOne: undefined,
    searchTwo: undefined,
    searchThree: undefined,
  };

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
          this.backFilterQuery.active = this.selectedTab === 'active' ? 1 : 0;
          this.backFilterQuery.pageIndex = 1;

          const searchEvent = tableSearch(res, this.backFilterQuery);

          if (searchEvent) {
            if (searchEvent.action === 'api') {
              this.ownerBackFilter(searchEvent.query, true);
            } else if (searchEvent.action === 'store') {
              this.sendOwnerData();
            }
          }
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
                    owner.actionAnimation = 'delete-multiple';
                  }
                });

                return owner;
              });

              this.updateDataCount();

              const inetval = setInterval(() => {
                this.viewData = closeAnimationAction(true, this.viewData);

                clearInterval(inetval);
              }, 900);

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
            }, 2300);
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
            }, 900);
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
      toolbarActions: {
        showMoneyFilter: true,
        showLocationFilter: true,
        showTruckTypeFilter: true,
        showTrailerTypeFilter: true,
        viewModeOptions: [
          { name: 'List', active: this.activeViewMode === 'List' },
          { name: 'Card', active: this.activeViewMode === 'Card' },
        ],
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
        tableConfiguration: 'OWNER',
        isActive: this.selectedTab === 'active',
        gridColumns: this.getGridColumns('OWNER'),
      },
      {
        title: 'Inactive',
        field: 'inactive',
        length: ownerCount.inactive,
        data: ownerInactiveData,
        extended: false,
        gridNameTitle: 'Owner',
        stateName: 'owners',
        tableConfiguration: 'OWNER',
        isActive: this.selectedTab === 'inactive',
        gridColumns: this.getGridColumns('OWNER'),
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

  getGridColumns(configType: string) {
    const tableColumnsConfig = JSON.parse(
      localStorage.getItem(`table-${configType}-Configuration`)
    );

    return tableColumnsConfig
        ? tableColumnsConfig
        : getOwnerColumnDefinition();
  }

  setOwnerData(td: any) {
    this.columns = td.gridColumns;

    if (td.data.length) {
      this.viewData = td.data;

      this.viewData = this.viewData.map((data: any) => {
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
      textBankName: data?.bank?.name ? data.bank.name : '',
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

  // Owner Back Filter
  ownerBackFilter(
    filter: {
      active: number;
      companyOwnerId: number | undefined;
      long: number | undefined;
      lat: number | undefined;
      distance: number | undefined;
      truckTypeIds: Array<number> | undefined;
      trailerTypeIds: Array<number> | undefined;
      pageIndex: number;
      pageSize: number;
      companyId: number | undefined;
      sort: string | undefined;
      searchOne: string | undefined;
      searchTwo: string | undefined;
      searchThree: string | undefined;
    },
    isSearch?: boolean,
    isShowMore?: boolean
  ) {
    this.ownerService
      .getOwner(
        filter.active,
        filter.companyOwnerId,
        filter.long,
        filter.lat,
        filter.distance,
        filter.truckTypeIds,
        filter.trailerTypeIds,
        filter.pageIndex,
        filter.pageSize,
        filter.companyId,
        filter.sort,
        filter.searchOne,
        filter.searchTwo,
        filter.searchThree
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((owners: GetOwnerListResponse) => {
        if (!isShowMore) {
          this.viewData = owners.pagination.data;

          this.viewData = this.viewData.map((data: any) => {
            return this.mapOwnerData(data);
          });

          if (isSearch) {
            this.tableData[this.selectedTab === 'active' ? 0 : 1].length =
              owners.pagination.count;
          }
        } else {
          let newData = [...this.viewData];

          owners.pagination.data.map((data: any) => {
            newData.push(this.mapOwnerData(data));
          });

          this.viewData = [...newData];
        }
      });
  }

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      this.modalService.openModal(OwnerModalComponent, { size: 'small' });
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;

      this.backFilterQuery.pageIndex = 1;

      this.sendOwnerData();
    } else if (event.action === 'view-mode') {
      this.activeViewMode = event.mode;
    }
  }

  onTableHeadActions(event: any) {
    if (event.action === 'sort') {
      if (event.direction) {
        this.backFilterQuery.active = this.selectedTab === 'active' ? 1 : 0;
        this.backFilterQuery.pageIndex = 1;
        this.backFilterQuery.sort = event.direction;

        this.ownerBackFilter(this.backFilterQuery);
      } else {
        this.sendOwnerData();
      }
    }
  }

  onTableBodyActions(event: any) {
    if (event.type === 'show-more') {
      this.backFilterQuery.pageIndex++;

      this.ownerBackFilter(this.backFilterQuery, false, true);
    } else if (event.type === 'edit-owner') {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.tableService.sendActionAnimation({});
    this.resizeObserver.unobserve(document.querySelector('.table-container'));
    this.resizeObserver.disconnect();
  }
}
