import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { ViolationModalComponent } from '../violation-modal/violation-modal.component';
import { TruckassistTableService } from '../../../../services/truckassist-table/truckassist-table.service';
import { getViolationsColums } from '../../../../../../assets/utils/settings/safety-columns';
import { Subject, takeUntil } from 'rxjs';
import { RoadsideInactiveState } from '../state/roadside-state/roadside-inactive/roadside-inactive.store';
import { RoadsideActiveState } from '../state/roadside-state/roadside-active/roadside-active.store';
import { RoadsideActiveQuery } from '../state/roadside-state/roadside-active/roadside-active.query';
import { RoadsideInactiveQuery } from '../state/roadside-state/roadside-inactive/roadside-inactive.query';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-violation-table',
  templateUrl: './violation-table.component.html',
  styleUrls: ['./violation-table.component.scss'],
  providers: [DatePipe],
})
export class ViolationTableComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private destroy$ = new Subject<void>();

  tableOptions: any = {};
  tableData: any[] = [];
  viewData: any[] = [];
  columns: any[] = [];
  selectedTab = 'active';
  activeViewMode: string = 'List';
  resetColumns: boolean;
  tableContainerWidth: number = 0;
  resizeObserver: ResizeObserver;
  roadsideActive: RoadsideActiveState[] = [];
  roadsideInactive: RoadsideInactiveState[] = [];

  constructor(
    private tableService: TruckassistTableService,
    private modalService: ModalService,
    private roadsideActiveQuery: RoadsideActiveQuery,
    private roadsideInactiveQuery: RoadsideInactiveQuery,
    private datePipe: DatePipe
  ) {}

  // -------------------------------NgOnInit-------------------------------
  ngOnInit(): void {
    this.sendViolationData();

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.resetColumns = response;

          this.sendViolationData();
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
        /*  if (res) {
          this.mapingIndex = 0;

          this.backFilterQuery.pageIndex = 1;

          const searchEvent = tableSearch(res, this.backFilterQuery);

          if (searchEvent) {
            if (searchEvent.action === 'api') {
              this.contactBackFilter(searchEvent.query, true);
            } else if (searchEvent.action === 'store') {
              this.sendViolationData();
            }
          }
        } */
      });

    // Roadside Inspection Actions
    this.tableService.currentActionAnimation
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        // Add Roadside Insection
        if (res.animation === 'add') {
          /* this.viewData.push(this.mapContactData(res.data));

          this.viewData = this.viewData.map((contact: any) => {
            if (contact.id === res.id) {
              contact.actionAnimation = 'add';
            }

            return contact;
          });

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
          }, 2300);

          this.updateDataCount(); */
        }
        // Update Roadside Insection
        else if (res.animation === 'update') {
          /* const updatedContact = this.mapContactData(res.data, true);

          this.viewData = this.viewData.map((contact: any) => {
            if (contact.id === res.id) {
              contact = updatedContact;
              contact.actionAnimation = 'update';
            }

            return contact;
          });

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
          }, 1000); */
        }
        // Delete Roadside Insection
        else if (res.animation === 'delete') {
          /* let contactIndex: number;

          this.viewData = this.viewData.map((contact: any, index: number) => {
            if (contact.id === res.id) {
              contact.actionAnimation = 'delete';
              contact = index;
            }

            return contact;
          });

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            this.viewData.splice(contactIndex, 1);
            clearInterval(inetval);
          }, 900);

          this.updateDataCount(); */
        }
      });

    // Delete Selected Rows
    this.tableService.currentDeleteSelectedRows
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any[]) => {
        /*  if (response.length) {
          this.contactService
            .deleteAccountList(response)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.viewData = this.viewData.map((contact: any) => {
                response.map((r: any) => {
                  if (contact.id === r.id) {
                    contact.actionAnimation = 'delete-multiple';
                  }
                });

                return contact;
              });

              this.updateDataCount();

              const inetval = setInterval(() => {
                this.viewData = closeAnimationAction(true, this.viewData);

                clearInterval(inetval);
              }, 900);

              this.tableService.sendRowsSelected([]);
              this.tableService.sendResetSelectedColumns(true);
            });
        } */
      });
  }

  // -------------------------------NgAfterViewInit-------------------------------
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.observTableContainer();
    }, 10);
  }

  // Responsive Observer
  observTableContainer() {
    this.resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        this.tableContainerWidth = entry.contentRect.width;
      });
    });

    this.resizeObserver.observe(document.querySelector('.table-container'));
  }

  // Table Options
  initTableOptions(): void {
    this.tableOptions = {
      toolbarActions: {
        viewModeOptions: [
          { name: 'List', active: this.activeViewMode === 'List' },
          { name: 'Card', active: this.activeViewMode === 'Card' },
          { name: 'Map', active: this.activeViewMode === 'Map' },
        ],
      },
      attachmentConfig: {
        hasViolation: true,
        hasCitation: true,
      },
      actions: [
        {
          title: 'Edit',
          name: 'edit-violation',
          class: 'regular-text',
          contentType: 'edit',
        },
        {
          title: 'Delete',
          name: 'delete',
          type: 'violations',
          text: 'Are you sure you want to delete violation?',
          class: 'delete-text',
          contentType: 'delete',
        },
      ],
    };
  }

  // Send Roadside Inspection
  sendViolationData() {
    this.initTableOptions();

    const roadsideCount = JSON.parse(
      localStorage.getItem('roadsideTableCount')
    );

    const roadsideActiveData = this.getTabData('active');

    const roadsideInactiveData = this.getTabData();

    this.tableData = [
      {
        title: 'Active',
        field: 'active',
        length: roadsideCount.active,
        data: roadsideActiveData,
        gridNameTitle: 'Roadside Inspection',
        gridColumns: this.getGridColumns('violation', this.resetColumns),
      },
      {
        title: 'Inactive',
        field: 'inactive',
        length: roadsideCount.inactive,
        data: roadsideInactiveData,
        gridNameTitle: 'Roadside Inspection',
        gridColumns: this.getGridColumns('violation', this.resetColumns),
      },
      {
        title: 'Violation Summary',
        field: 'summary',
        length: 0,
        data: [],
        gridNameTitle: 'Roadside Inspection',
        gridColumns: this.getGridColumns('summary', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setViolationData(td);
  }

  // Get Table Tab Data
  getTabData(dataType?: string) {
    if (dataType === 'active') {
      this.roadsideActive = this.roadsideActiveQuery.getAll();

      return this.roadsideActive?.length ? this.roadsideActive : [];
    } else {
      this.roadsideInactive = this.roadsideInactiveQuery.getAll();

      return this.roadsideInactive?.length ? this.roadsideInactive : [];
    }
  }

  // Get Roadside Inspection Table Columns Configurations
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

  // Set Roadside Inspection Table Data
  setViolationData(td: any) {
    this.columns = td.gridColumns;

    if (td.data.length) {
      this.viewData = td.data;

      this.viewData = this.viewData.map((data: any) => {
        return this.selectedTab === 'summary'
          ? this.mapViolationSummaryData(data)
          : this.mapRoadsideInspectionData(data);
      });

      /* for(let i = 0; i < 100; i++){
        this.viewData.push(this.viewData[2]);
      } */

      console.log('viewData');
      console.log(this.viewData);
    } else {
      this.viewData = [];
    }
  }

  // Map Violation Summary Data
  mapViolationSummaryData(data: any) {
    return {
      ...data,
      isSelected: false,
    };
  }

  // Map Roadside Inspection Data
  mapRoadsideInspectionData(data: any) {
    return {
      ...data,
      isSelected: false,
      tableReport: data?.report ? data.report : 'No Report',
      tableDriverName: data?.driver_FullName ? data.driver_FullName : '',
      truckNumber: 'Nije povezano',
      trailerNumber: 'Nije povezano',
      tableDate: data?.date
        ? this.datePipe.transform(data.date, 'MM/dd/yy')
        : '',
      tabelStartTime: data?.startTime ? data?.startTime : '',
      tabelEndTime: data?.endTime ? data?.endTime : '',
      tableLvl: data?.inspectionLevel
        ? this.formatInspectionLevel(data?.inspectionLevel)
        : '',
      tableState: data?.country ? data?.country : '',
      /* Test */
      tableDropdownProgress: {
        expirationDays: 20,
        percentage: 20,
      },
    };
  }

  // Format Inspection Level
  formatInspectionLevel(inspectionLevel: string) {
    let level = '';

    for (let i = 0; i < inspectionLevel.length; i++) {
      if (inspectionLevel[i] !== '.') {
        level += inspectionLevel[i];
      } else {
        break;
      }
    }

    return level;
  }

  // On Toolbar Actions
  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      alert('Treba da se odradi modal!');
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;
      this.setViolationData(event.tabData);
    } else if (event.action === 'view-mode') {
      this.activeViewMode = event.mode;
    }
  }

  // On Head Actions
  onTableHeadActions(event: any) {
    if (event.action === 'sort') {
      if (event.direction) {
        /*  this.mapingIndex = 0;

        this.backFilterQuery.sort = event.direction;

        this.backFilterQuery.pageIndex = 1;

        this.contactBackFilter(this.backFilterQuery); */
      } else {
        this.sendViolationData();
      }
    }
  }

  // On Body Actions
  onTableBodyActions(event: any) {
    switch (event.type) {
      case 'edit-violation': {
        this.modalService.openModal(
          ViolationModalComponent,
          { size: 'large-xl' },
          { id: 1, type: 'edit' }
        );
      }
    }
  }

  // -------------------------------NgOnDestroy-------------------------------
  ngOnDestroy(): void {
    this.tableService.sendActionAnimation({});

    this.resizeObserver.unobserve(document.querySelector('.table-container'));
    this.resizeObserver.disconnect();

    this.destroy$.next();
    this.destroy$.complete();
  }
}
