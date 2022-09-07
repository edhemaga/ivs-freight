import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { tableSearch } from 'src/app/core/utils/methods.globals';
import { LoadModalComponent } from '../../modals/load-modal/load-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import {
  getLoadActiveAndPendingColumnDefinition,
  getLoadClosedColumnDefinition,
  getLoadTemplateColumnDefinition,
} from '../../../../../assets/utils/settings/load-columns';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';

@Component({
  selector: 'app-load-table',
  templateUrl: './load-table.component.html',
  styleUrls: ['./load-table.component.scss'],
})
export class LoadTableComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'active';
  resetColumns: boolean;
  tableContainerWidth: number = 0;
  resizeObserver: ResizeObserver;

  constructor(
    private tableService: TruckassistTableService,
    private modalService: ModalService
  ) {}

  // ---------------------------- ngOnInit ------------------------------
  ngOnInit(): void {
    this.sendLoadData();

    // Confirmation Subscribe
    /* this.confirmationService.confirmationData$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Confirmation) => {
          switch (res.type) {
            case 'delete': {
              if (res.template === 'driver') {
                this.deleteDriverById(res.id);
              }
              break;
            }
            case 'activate': {
              this.changeDriverStatus(res.id);
              break;
            }
            case 'deactivate': {
              this.changeDriverStatus(res.id);
              break;
            }
            case 'multiple delete': {
              this.multipleDeleteDrivers(res.array);
              break;
            }
            default: {
              break;
            }
          }
        },
      }); */

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.resetColumns = response;

          this.sendLoadData();
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
          /* this.mapingIndex = 0;

          this.backFilterQuery.active = this.selectedTab === 'active' ? 1 : 0;
          this.backFilterQuery.pageIndex = 1; */
          /*  const searchEvent = tableSearch(res, this.backFilterQuery); */
          /* if (searchEvent) {
            if (searchEvent.action === 'api') {
              this.driverBackFilter(searchEvent.query, true);
            } else if (searchEvent.action === 'store') {
              this.sendLoadData();
            }
          } */
        }
      });

    // Delete Selected Rows
    this.tableService.currentDeleteSelectedRows
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any[]) => {
        if (response.length) {
          let mappedRes = response.map((item) => {
            return {
              id: item.id,
              data: { ...item.tableData, name: item.tableData?.fullName },
            };
          });
          /* this.modalService.openModal(
            ConfirmationModalComponent,
            { size: 'small' },
            {
              data: null,
              array: mappedRes,
              template: 'driver',
              type: 'multiple delete',
              image: true,
            }
          ); */
        }
      });

    // Driver Actions
    this.tableService.currentActionAnimation
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        // On Add Driver Active
        if (res.animation === 'add' && this.selectedTab === 'active') {
          /*  this.viewData.push(this.mapDriverData(res.data));

          this.viewData = this.viewData.map((driver: any) => {
            if (driver.id === res.id) {
              driver.actionAnimation = 'add';
            }

            return driver;
          });

          this.updateDataCount();

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
          }, 1000); */
        }
        // On Add Driver Inactive
        else if (res.animation === 'add' && this.selectedTab === 'inactive') {
          /* this.updateDataCount(); */
        }
        // On Update Driver
        else if (res.animation === 'update') {
          /*  const updatedDriver = this.mapDriverData(res.data);

          this.viewData = this.viewData.map((driver: any) => {
            if (driver.id === res.id) {
              driver = updatedDriver;
              driver.actionAnimation = 'update';
            }

            return driver;
          });

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
          }, 1000); */
        }
        // On Update Driver Status
        else if (res.animation === 'update-status') {
          /* let driverIndex: number;

          this.viewData = this.viewData.map((driver: any, index: number) => {
            if (driver.id === res.id) {
              driver.actionAnimation = 'update';
              driverIndex = index;
            }

            return driver;
          });

          this.updateDataCount();

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            this.viewData.splice(driverIndex, 1);
            clearInterval(inetval);
          }, 1000); */
        }
        // On Delete Driver
        else if (res.animation === 'delete') {
          /* let driverIndex: number;

          this.viewData = this.viewData.map((driver: any, index: number) => {
            if (driver.id === res.id) {
              driver.actionAnimation = 'delete';
              driverIndex = index;
            }

            return driver;
          });

          this.updateDataCount();

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            this.viewData.splice(driverIndex, 1);
            clearInterval(inetval);
          }, 1000); */
        }
      });
  }

  // ---------------------------- ngAfterViewInit ------------------------------
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
          name: 'edit-load',
          class: 'regular-text',
          contentType: 'edit',
        },
        {
          title: 'Delete',
          name: 'delete',
          type: 'load',
          text: 'Are you sure you want to delete load(s)?',
          class: 'delete-text',
          contentType: 'delete',
        },
      ],
      export: true,
    };
  }

  sendLoadData() {
    this.initTableOptions();

    this.tableData = [
      {
        title: 'Template',
        field: 'template',
        length: 2,
        data: this.getDumyData(2),
        extended: false,
        gridNameTitle: 'Load',
        stateName: 'loads',
        gridColumns: this.getGridColumns('template', this.resetColumns),
      },
      {
        title: 'Pending',
        field: 'pending',
        length: 3,
        data: this.getDumyData(3),
        extended: false,
        gridNameTitle: 'Load',
        stateName: 'loads',
        gridColumns: this.getGridColumns('active-panding', this.resetColumns),
      },
      {
        title: 'Active',
        field: 'active',
        length: 5,
        data: this.getDumyData(5),
        extended: false,
        gridNameTitle: 'Load',
        stateName: 'loads',
        gridColumns: this.getGridColumns('active-panding', this.resetColumns),
      },
      {
        title: 'Closed',
        field: 'inactive',
        length: 8,
        data: this.getDumyData(8),
        extended: false,
        gridNameTitle: 'Load',
        stateName: 'loads',
        gridColumns: this.getGridColumns('closed', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setLoadData(td);
  }

  getGridColumns(stateName: string, resetColumns: boolean) {
    if (stateName === 'active-panding') {
      return getLoadActiveAndPendingColumnDefinition();
    } else if (stateName === 'closed') {
      return getLoadClosedColumnDefinition();
    } else {
      return getLoadTemplateColumnDefinition();
    }

    /*  const userState: any = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );
    */
  }

  setLoadData(td: any) {
    this.columns = td.gridColumns;

    if (td.data) {
      this.viewData = td.data;

      this.viewData = this.viewData.map((data) => {
        data.isSelected = false;
        return data;
      });
    }
  }

  getDumyData(numberOfCopy: number) {
    let data: any[] = [{}];

    for (let i = 0; i < numberOfCopy; i++) {
      data.push(data[0]);
    }

    return data;
  }

  // ---------------------------- Table Actions ------------------------------
  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      this.modalService.openModal(LoadModalComponent, { size: 'load' });
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;
      this.setLoadData(event.tabData);
    }
  }

  onTableHeadActions(event: any) {
    if (event.action === 'sort') {
      /* this.mapingIndex = 0; */

      if (event.direction) {
        /*  this.backFilterQuery.active = this.selectedTab === 'active' ? 1 : 0;
        this.backFilterQuery.pageIndex = 1;
        this.backFilterQuery.sort = event.direction;

        this.driverBackFilter(this.backFilterQuery); */
      } else {
        this.sendLoadData();
      }
    }
  }

  onTableBodyActions(event: any) {
    if (event.type === 'show-more') {
      /*  this.backFilterQuery.pageIndex++;
      this.driverBackFilter(this.backFilterQuery, false, true); */
    } else if (event.type === 'edit') {
      /* this.modalService.openModal(
        DriverModalComponent,
        { size: 'medium' },
        {
          ...event,
          disableButton: true,
        }
      ); */
    }
  }

  // ---------------------------- ngOnDestroy ------------------------------
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.tableService.sendActionAnimation({});
    this.resizeObserver.unobserve(document.querySelector('.table-container'));
    this.resizeObserver.disconnect();
  }
}
