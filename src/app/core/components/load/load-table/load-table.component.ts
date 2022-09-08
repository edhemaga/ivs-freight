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
import { LoadActiveQuery } from '../state/load-active-state/load-active.query';
import { LoadClosedQuery } from '../state/load-closed-state/load-closed.query';
import { LoadPandinQuery } from '../state/load-pending-state/load-pending.query';
import { LoadTemplateQuery } from '../state/load-template-state/load-template.query';
import { LoadActiveState } from '../state/load-active-state/load-active.store';
import { LoadClosedState } from '../state/load-closed-state/load-closed.store';
import { LoadPandingState } from '../state/load-pending-state/load-panding.store';
import { LoadTemplateState } from '../state/load-template-state/load-template.store';

@Component({
  selector: 'app-load-table',
  templateUrl: './load-table.component.html',
  styleUrls: ['./load-table.component.scss'],
})
export class LoadTableComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();
  tableOptions: any = {};
  tableData: any[] = [];
  viewData: any[] = [];
  columns: any[] = [];
  selectedTab = 'active';
  resetColumns: boolean;
  tableContainerWidth: number = 0;
  resizeObserver: ResizeObserver;
  loadActive: LoadActiveState[] = [];
  loadClosed: LoadClosedState[] = [];
  loadPanding: LoadPandingState[] = [];
  loadTemplate: LoadTemplateState[] = [];

  constructor(
    private tableService: TruckassistTableService,
    private modalService: ModalService,
    private loadActiveQuery: LoadActiveQuery,
    private loadClosedQuery: LoadClosedQuery,
    private loadPandinQuery: LoadPandinQuery,
    private loadTemplateQuery: LoadTemplateQuery
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

    const loadCount = JSON.parse(localStorage.getItem('loadTableCount'));

    const loadTemplateData =
      this.selectedTab === 'template' ? this.getTabData('template') : [];

    const loadPendingData =
      this.selectedTab === 'pending' ? this.getTabData('pending') : [];

    const loadActiveData =
      this.selectedTab === 'active' ? this.getTabData('active') : [];

    const repairClosedData =
      this.selectedTab === 'closed' ? this.getTabData('closed') : [];

    this.tableData = [
      {
        title: 'Template',
        field: 'template',
        length: loadCount.templateCount,
        data: loadTemplateData,
        extended: false,
        gridNameTitle: 'Load',
        stateName: 'loads',
        gridColumns: this.getGridColumns('template', this.resetColumns),
      },
      {
        title: 'Pending',
        field: 'pending',
        length: loadCount.pendingCount,
        data: loadPendingData,
        extended: false,
        gridNameTitle: 'Load',
        stateName: 'loads',
        gridColumns: this.getGridColumns('active-panding', this.resetColumns),
      },
      {
        title: 'Active',
        field: 'active',
        length: loadCount.activeCount,
        data: loadActiveData,
        extended: false,
        gridNameTitle: 'Load',
        stateName: 'loads',
        gridColumns: this.getGridColumns('active-panding', this.resetColumns),
      },
      {
        title: 'Closed',
        field: 'closed',
        length: loadCount.closedCount,
        data: repairClosedData,
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
    // const userState: any = JSON.parse(
    //   localStorage.getItem(stateName + '_user_columns_state')
    // );

    if (stateName === 'active-panding') {
      return getLoadActiveAndPendingColumnDefinition();
    } else if (stateName === 'closed') {
      return getLoadClosedColumnDefinition();
    } else {
      return getLoadTemplateColumnDefinition();
    }
  }

  setLoadData(td: any) {
    this.columns = td.gridColumns;

    if (td.data?.length) {
      console.log('Imaju podaci');

      this.viewData = td.data;

      this.viewData = this.viewData.map((data) => {
        data.isSelected = false;
        return data;
      });
    }else{
      this.viewData = [];
    }
  }

  getTabData(dataType: string) {
    if (dataType === 'active') {
      this.loadActive = this.loadActiveQuery.getAll();

      return this.loadActive?.length ? this.loadActive : [];
    } else if (dataType === 'closed') {
      this.loadClosed = this.loadClosedQuery.getAll();

      return this.loadClosed?.length ? this.loadClosed : [];
    } else if (dataType === 'pending') {
      this.loadPanding = this.loadPandinQuery.getAll();

      return this.loadPanding?.length ? this.loadPanding : [];
    } else if (dataType === 'template') {
      this.loadTemplate = this.loadTemplateQuery.getAll();

      return this.loadTemplate?.length ? this.loadTemplate : [];
    }
  }

  // ---------------------------- Table Actions ------------------------------
  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      this.modalService.openModal(LoadModalComponent, { size: 'load' });
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;
      
      this.sendLoadData();
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
