import { untilDestroyed } from 'ngx-take-until-destroy';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { getApplicantColumnsDefinition } from 'src/assets/utils/settings/applicant-columns';
import { getDriverColumnsDefinition } from 'src/assets/utils/settings/driver-columns';
import { DriversQuery } from '../state/driver.query';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { DriverModalComponent } from '../../modals/driver-modal/driver-modal.component';
import { DatePipe } from '@angular/common';
import { DriverTService } from '../state/driver.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { DriversState, DriversStore } from '../state/driver.store';
import { DriverCdlModalComponent } from '../driver-details/driver-modals/driver-cdl-modal/driver-cdl-modal.component';
import { DriverDrugAlcoholModalComponent } from '../driver-details/driver-modals/driver-drugAlcohol-modal/driver-drugAlcohol-modal.component';
import { DriverMedicalModalComponent } from '../driver-details/driver-modals/driver-medical-modal/driver-medical-modal.component';
import { DriverMvrModalComponent } from '../driver-details/driver-modals/driver-mvr-modal/driver-mvr-modal.component';

@Component({
  selector: 'app-driver-table',
  templateUrl: './driver-table.component.html',
  styleUrls: ['./driver-table.component.scss'],
})
export class DriverTableComponent implements OnInit, OnDestroy {
  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'active';
  resetColumns: boolean;

  public drivers: DriversState[] = [];

  constructor(
    private modalService: ModalService,
    private driversQuery: DriversQuery,
    private tableService: TruckassistTableService,
    public datePipe: DatePipe,
    private driverTService: DriverTService,
    private notificationService: NotificationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(untilDestroyed(this))
      .subscribe((response: boolean) => {
        if (response) {
          this.resetColumns = response;

          this.sendDriverData();
        }
      });

    // Add Driver
    this.tableService.currentActionAnimation
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
        if(res.animation === 'add'){
          this.viewData.push(this.mapDriverData(res.data));

          this.viewData = this.viewData.map((driver:any) => {
            if(driver.id === res.id){
              driver.actionAnimation = 'add';
            }

            return driver;
          })

          this.closeAnimationAction();
        }
      });

    // Delete Selected Rows
    this.tableService.currentDeleteSelectedRows
      .pipe(untilDestroyed(this))
      .subscribe((response: any[]) => {
        if (response.length) {
          this.driverTService
            .deleteDriverList(response)
            .pipe(untilDestroyed(this))
            .subscribe(() => {
              this.viewData = this.viewData.map((driver: any) => {
                response.map((r: any) => {
                  if (driver.id === r.id) {
                    driver.actionAnimation = 'delete';
                  }
                });

                return driver;
              });

              this.closeAnimationAction(true);

              this.tableService.sendRowsSelected([]);
            });
        }
      });
      this.initTableOptions();
    this.getDriversData();
  }

  public initTableOptions(): void {
    this.tableOptions = {
      disabledMutedStyle: null,
      toolbarActions: {
        hideViewMode: false,
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
          title: 'Edit Driver',
          name: 'edit',
          class: 'regular-text',
          contentType: 'edit',
        },
        {
          title: 'Add CDL',
          name: 'new-licence',
          class: 'regular-text',
          contentType: 'add',
        },
        {
          title: 'Add Medical',
          name: 'new-medical',
          class: 'regular-text',
          contentType: 'add',
        },
        {
          title: 'Add MVR',
          name: 'new-mvr',
          class: 'regular-text',
          contentType: 'add',
        },
        {
          title: 'Add Test',
          name: 'new-drug',
          class: 'regular-text',
          contentType: 'add',
        },
        {
          title: 'Activate',
          reverseTitle: 'Deactivate',
          name: 'activate-item',
          class: 'regular-text',
          contentType: 'activate',
        },
        {
          title: 'Delete',
          name: 'delete-item',
          type: 'driver',
          text: 'Are you sure you want to delete driver(s)?',
          class: 'delete-text',
          contentType: 'delete',
        },
      ],
      export: true,
    };
  }

  getDriversData() {
    this.sendDriverData();
  }

  sendDriverData() {
    this.tableData = [
      {
        title: 'Applicants',
        field: 'applicants',
        length: 8,
        data: this.getDumyData(),
        extended: true,
        gridNameTitle: 'Driver',
        stateName: 'applicants',
        gridColumns: this.getGridColumns('applicants', this.resetColumns),
      },
      {
        title: 'Active',
        field: 'active',
        length: 5,
        data: this.getDumyData(),
        extended: false,
        gridNameTitle: 'Driver',
        stateName: 'drivers',
        gridColumns: this.getGridColumns('drivers', this.resetColumns),
      },
      {
        title: 'Inactive',
        field: 'inactive',
        length: 10,
        data: this.getDumyData(),
        extended: false,
        gridNameTitle: 'Driver',
        stateName: 'drivers',
        gridColumns: this.getGridColumns('drivers', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setDriverData(td);
  }

  getDumyData() {
    this.drivers = this.driversQuery.getAll();

    return this.drivers?.length ? this.drivers : [];
  }

  getGridColumns(stateName: string, resetColumns: boolean) {
    const userState: any = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );

    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      if (stateName === 'applicants') {
        return getApplicantColumnsDefinition();
      } else {
        return getDriverColumnsDefinition();
      }
    }
  }

  setDriverData(td: any) {
    this.columns = td.gridColumns;

    if (td.data.length) {
      this.viewData = td.data;

      this.viewData = this.viewData.map((data: DriversState) => {
        console.log(data);
        
        return this.mapDriverData(data);
      });
    }
  }

  mapDriverData(data: any){
    
    return {
      ...data,
      isSelected: false,
      textAddress: data.address.address ? data.address.address : '',
      textDOB: data.dateOfBirth
        ? this.datePipe.transform(data.dateOfBirth, 'dd/MM/yy')
        : '',
      textHired: data.hired
        ? this.datePipe.transform(data.hired, 'dd/MM/yy')
        : '',
      textCDL: data.cdlNumber ? data.cdlNumber : '',
      textState: data.address.state ? data.address.state : '',
      textBank: data.bank ? data.bank : '',
      textAccount: data.account ? data.account : '',
      textRouting: data.routing ? data.routing : '',
      tableCDLData: data.cdlExpiration ? data.cdlExpiration : {},
      tableMedicalData: data.medicalExpiration
        ? data.medicalExpiration
        : {},
      tableMvrData: data.mvrIssueDate ? data.mvrIssueDate : {},
    };
  }

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      this.modalService.openModal(DriverModalComponent, {
        size: 'small',
      });
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;
      this.setDriverData(event.tabData);
    } else if (event.action === 'view-mode') {
      this.tableOptions.toolbarActions.viewModeActive = event.mode;
    }
  }

  public onTableBodyActions(event: any) {
    if (event.type === 'edit') {
      this.modalService.openModal(
        DriverModalComponent,
        { size: 'small' },
        {
          ...event,
          disableButton: true,
        }
      );
    } else if (event.type === 'new-licence') {
      this.modalService.openModal(
        DriverCdlModalComponent,
        { size: 'small' },
        { ...event }
      );
    } else if (event.type === 'new-medical') {
      this.modalService.openModal(
        DriverMedicalModalComponent,
        {
          size: 'small',
        },
        { ...event }
      );
    } else if (event.type === 'new-mvr') {
      this.modalService.openModal(
        DriverMvrModalComponent,
        { size: 'small' },
        { ...event }
      );
    } else if (event.type === 'new-drug') {
      this.modalService.openModal(
        DriverDrugAlcoholModalComponent,
        {
          size: 'small',
        },
        { ...event }
      );
    } else if (event.type === 'delete-item') {
      this.driverTService
        .deleteDriverById(event.id)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: () => {
            this.notificationService.success(
              'Driver successfully deleted',
              'Success:'
            );

            this.viewData = this.viewData.map((driver: any) => {
              if (driver.id === event.id) {
                driver.actionAnimation = 'delete';
              }

              return driver;
            });

            this.closeAnimationAction(true);
          },
          error: () => {
            this.notificationService.error(
              `Driver with id: ${event.id} couldn't be deleted`,
              'Error:'
            );
          },
        });
    }
  }

  closeAnimationAction(isDelete?: boolean) {
    const timeOut = setInterval(() => {
      if (!isDelete) {
        this.viewData = this.viewData.map((driver: any) => {
          if (driver?.actionAnimation) {
            delete driver.actionAnimation;
          }

          return driver;
        });
      } else {
        let newViewData = [];

        this.viewData.map((driver: any) => {
          if (!driver.hasOwnProperty('actionAnimation')) {
            newViewData.push(driver);
          }
        });

        this.viewData = newViewData;
      }

      clearInterval(timeOut);
    }, 1000);
  }

  ngOnDestroy(): void {}
}
