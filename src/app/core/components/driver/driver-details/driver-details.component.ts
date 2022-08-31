import { map } from 'rxjs';
import { LengthData } from './../../../model/trailer';
import { DriverMvrModalComponent } from './driver-modals/driver-mvr-modal/driver-mvr-modal.component';
import { DriverMedicalModalComponent } from './driver-modals/driver-medical-modal/driver-medical-modal.component';
import { DriverDrugAlcoholModalComponent } from './driver-modals/driver-drugAlcohol-modal/driver-drugAlcohol-modal.component';
import { DriverCdlModalComponent } from './driver-modals/driver-cdl-modal/driver-cdl-modal.component';
import { ModalService } from './../../shared/ta-modal/modal.service';
import {
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DriverTService } from '../state/driver.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DriverResponse } from 'appcoretruckassist';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import moment from 'moment';
import { ConfirmationService } from '../../modals/confirmation-modal/confirmation.service';
import {
  Confirmation,
  ConfirmationModalComponent,
} from '../../modals/confirmation-modal/confirmation-modal.component';
import { DriversMinimalListStore } from '../state/driver-details-minimal-list-state/driver-minimal-list.store';
import { DriversMinimalListQuery } from '../state/driver-details-minimal-list-state/driver-minimal-list.query';
import { DriversItemStore } from '../state/driver-details-state/driver-details.store';
import { DropDownService } from 'src/app/core/services/details-page/drop-down.service';
import { CdlTService } from '../state/cdl.service';

@UntilDestroy()
@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.scss'],
  providers: [DetailsPageService],
})
export class DriverDetailsComponent implements OnInit, OnDestroy {
  public driverDetailsConfig: any[] = [];
  public dataTest: any;
  public statusDriver: boolean;
  public data: any;
  public showInc: boolean;
  public hasDangerCDL: boolean;
  public arrayCDL: any[] = [];
  public arrayMedical: any[] = [];
  public arrayMvrs: any[] = [];
  public hasDangerMedical: boolean;
  public hasDangerMvr: boolean;
  public driverId: number = null;
  public driverObject: any;
  public driversList: any = this.driverMinimalQuery.getAll();
  public currentIndex: number = 0;
  public arrayActiveCdl: any[] = [];
  public isActiveCdl: boolean;
  public dataCdl: any;
  public cdlActiveId: number;
  constructor(
    private activated_route: ActivatedRoute,
    private modalService: ModalService,
    private driverService: DriverTService,
    private router: Router,
    private notificationService: NotificationService,
    private detailsPageDriverService: DetailsPageService,
    private cdRef: ChangeDetectorRef,
    private tableService: TruckassistTableService,
    private confirmationService: ConfirmationService,
    private driverMinimimalListStore: DriversMinimalListStore,
    private driverMinimalQuery: DriversMinimalListQuery,
    private dropDownService: DropDownService,
    private driverItemStore: DriversItemStore,
    private cdlService: CdlTService
  ) {}

  ngOnInit() {
    this.currentIndex = this.driversList.findIndex(
      (driver) => driver.id === this.activated_route.snapshot.data.driver.id
    );
    this.getDriverById(this.activated_route.snapshot.data.driver.id);
    this.initTableOptions(this.activated_route.snapshot.data.driver);
    this.detailCongif(this.activated_route.snapshot.data.driver);
    if (this.cdlActiveId > 0) {
      this.getCdlById(this.cdlActiveId);
    }
    this.tableService.currentActionAnimation
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
        if (res.animation) {
          this.detailCongif(res.data);
          this.initTableOptions(res.data);
          this.checkExpiration(res.data);

          this.cdRef.detectChanges();
        }
      });

    // Confirmation Subscribe
    this.confirmationService.confirmationData$
      .pipe(untilDestroyed(this))
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
            default: {
              break;
            }
          }
        },
      });

    this.detailsPageDriverService.pageDetailChangeId$
      .pipe(untilDestroyed(this))
      .subscribe((id) => {
        this.driverService
          .getDriverById(id)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (res: DriverResponse) => {
              this.currentIndex = this.driversList.findIndex(
                (driver) => driver.id === res.id
              );
              this.initTableOptions(res);
              if (this.cdlActiveId > 0) {
                this.getCdlById(this.cdlActiveId);
              }

              this.detailCongif(res);
              this.getDriverById(res.id);
              if (this.router.url.includes('details')) {
                this.router.navigate([`/driver/${res.id}/details`]);
              }
              this.notificationService.success(
                'Driver successfully changed',
                'Success:'
              );
              this.cdRef.detectChanges();
            },
            error: () => {
              this.notificationService.error(
                "Driver can't be loaded",
                'Error:'
              );
            },
          });
      });
  }

  /**Function template and names for header and other options in header */
  public detailCongif(data: DriverResponse | any) {
    this.checkExpiration(data);
    if (data?.status == 0) {
      this.statusDriver = true;
      this.showInc = true;
    } else {
      this.statusDriver = false;
      this.showInc = false;
    }

    this.driverDetailsConfig = [
      {
        id: 0,
        name: 'Driver Details',
        template: 'general',
        data: data,
      },
      {
        id: 1,
        name: 'CDL',
        template: 'cdl',
        req: false,
        status: this.statusDriver,
        hasDanger: this.hasDangerCDL,
        length: data?.cdls?.length ? data.cdls.length : 0,
        data: data,
      },
      {
        id: 2,
        name: 'Drug & Alcohol',
        template: 'drug-alcohol',
        req: true,
        status: this.statusDriver,
        hasDanger: false,
        length: data?.tests?.length ? data.tests.length : 0,
        data: data,
      },
      {
        id: 3,
        name: 'Medical',
        template: 'medical',
        req: false,
        status: this.statusDriver,
        hasDanger: this.hasDangerMedical,
        length: data?.medicals?.length ? data.medicals.length : 0,
        data: data,
      },
      {
        id: 4,
        name: 'MVR',
        template: 'mvr',
        req: true,
        status: this.statusDriver,
        hasDanger: this.hasDangerMvr,
        length: data?.mvrs?.length ? data.mvrs.length : 0,
        data: data,
      },
    ];
    this.driverId = data?.id ? data.id : null;
  }
  checkExpiration(data: DriverResponse) {
    this.hasDangerCDL = false;
    this.hasDangerMedical = false;
    this.hasDangerMvr = false;
    this.arrayCDL = [];
    this.arrayMedical = [];
    this.arrayMvrs = [];

    data?.cdls?.map((el) => {
      if (moment(el.expDate).isAfter(moment())) {
        this.arrayCDL.push(false);
      }
      if (moment(el.expDate).isBefore(moment())) {
        this.arrayCDL.push(true);
      }
    });

    data?.medicals?.map((el) => {
      if (moment(el.expDate).isAfter(moment())) {
        this.arrayMedical.push(false);
      }
      if (moment(el.expDate).isBefore(moment())) {
        this.arrayMedical.push(true);
      }
    });

    // if(data.mvrs.length>0){
    //   data?.mvrs.map((el)=>{
    //     if(moment(el.issueDate).isAfter(moment())){
    //       this.arrayMedical.push(false)
    //     }
    //     if(moment(el.issueDate).isBefore(moment())){
    //       this.arrayMedical.push(true)
    //     }
    //   })
    // }
    if (this.arrayCDL.includes(false)) {
      this.hasDangerCDL = false;
    } else {
      this.hasDangerCDL = true;
    }
    if (this.arrayMedical.includes(false)) {
      this.hasDangerMedical = false;
    } else {
      this.hasDangerMedical = true;
    }
  }

  /**Function for dots in cards */
  public initTableOptions(data: DriverResponse): void {
    this.arrayActiveCdl = [];
    this.isActiveCdl = false;
    this.cdlActiveId = 0;
    data?.cdls?.map((item) => {
      if (item.status == 1) {
        this.cdlActiveId = item.id;
      }

      if (item.status == 1) {
        this.arrayActiveCdl.push(true);
      } else {
        this.arrayActiveCdl.push(false);
      }
      if (this.arrayActiveCdl.includes(true)) {
        this.isActiveCdl = true;
      } else {
        this.isActiveCdl = false;
      }
    });
    this.dataTest = {
      disabledMutedStyle: null,
      toolbarActions: {
        hideViewMode: false,
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
          title: 'Send Message',
          name: 'dm',
          svg: 'assets/svg/common/ic_dm.svg',
          show: data.status == 1 ? true : false,
        },
        {
          title: 'Print',
          name: 'print',
          svg: 'assets/svg/common/ic_fax.svg',
          show: data.status == 1 || data.status == 0 ? true : false,
        },

        {
          title: 'Edit',
          name: 'edit',
          svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
          show: data.status == 1 ? true : false,
        },
        {
          title: data.status == 0 ? 'Activate' : 'Deactivate',
          name: data.status == 0 ? 'activate' : 'deactivate',
          svg: 'assets/svg/common/ic_deactivate.svg',
          activate: data.status == 0 ? true : false,
          deactivate: data.status == 1 ? true : false,
          show: data.status == 1 || data.status == 0 ? true : false,
        },
        {
          title: 'Delete',
          name: 'delete-item',
          type: 'driver',
          text: 'Are you sure you want to delete driver(s)?',
          svg: 'assets/svg/common/ic_trash_updated.svg',
          danger: true,
          show: data.status == 1 || data.status == 0 ? true : false,
        },
      ],
      export: true,
    };
  }

  public getDriverById(id: number) {
    this.driverService
      .getDriverById(id, true)
      .subscribe((item) => (this.driverObject = item));
  }
  public getCdlById(id: number) {
    this.cdlService
      .getCdlById(id)
      .pipe(untilDestroyed(this))
      .subscribe((item) => (this.dataCdl = item));
  }
  public onDriverActions(event: any) {
    this.dropDownService.dropActionsHeader(
      event,
      this.driverObject,
      this.driverId
    );
  }

  private changeDriverStatus(id: number) {
    let status = this.driverObject.status == 0 ? 'inactive' : 'active';
    this.driverService
      .changeDriverStatus(id, status)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            `Driver successfully Change Status`,
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error(
            `Driver with id: ${id}, status couldn't be changed`,
            'Error:'
          );
        },
      });
  }

  private deleteDriverById(id: number) {
    let status = this.driverObject.status == 0 ? 'inactive' : 'active';
    let last = this.driversList.at(-1);
    if (
      last.id ===
      this.driverMinimimalListStore.getValue().ids[this.currentIndex]
    ) {
      this.currentIndex = --this.currentIndex;
    } else {
      this.currentIndex = ++this.currentIndex;
    }
    this.driverService
      .deleteDriverByIdDetails(id, status)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          if (this.driverMinimimalListStore.getValue().ids.length < 1) {
            this.router.navigate(['/driver']);
          } else {
            this.router.navigate([
              `/driver/${this.driversList[this.currentIndex].id}/details`,
            ]);
          }
          this.notificationService.success(
            'Driver successfully deleted',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error(
            `Driver with id: ${id} couldn't be deleted`,
            'Error:'
          );
        },
      });
  }
  public onModalAction(action: string): void {
    if (action.includes('Drug')) {
      action = 'DrugAlcohol';
    }

    switch (action) {
      case 'CDL': {
        if (!this.isActiveCdl) {
          this.modalService.openModal(
            DriverCdlModalComponent,
            { size: 'small' },
            { id: this.driverId, type: 'new-licence' }
          );
        } else {
          const mappedEvent = {
            ...this.dataCdl,
            data: {
              state: this.dataCdl.state.stateShortName,
              expDate: this.dataCdl.expDate,
              cdlNumber: this.dataCdl.cdlNumber,
            },
          };
          this.modalService.openModal(
            ConfirmationModalComponent,
            { size: 'small' },
            {
              ...mappedEvent,
              template: 'cdl',
              type: 'delete',
              image: false,
            }
          );
        }
        break;
      }
      case 'DrugAlcohol': {
        this.modalService.openModal(
          DriverDrugAlcoholModalComponent,
          { size: 'small' },
          { id: this.driverId, type: 'new-drug' }
        );

        break;
      }
      case 'Medical': {
        this.modalService.openModal(
          DriverMedicalModalComponent,
          { size: 'small' },
          { id: this.driverId, type: 'new-medical' }
        );
        break;
      }
      case 'MVR': {
        this.modalService.openModal(
          DriverMvrModalComponent,
          { size: 'small' },
          { id: this.driverId, type: 'new-mvr' }
        );
        break;
      }
      default: {
        break;
      }
    }
  }

  /**Function retrun id */
  public identity(index: number, item: any): number {
    return index;
  }

  ngOnDestroy(): void {
    this.tableService.sendActionAnimation({});
  }
}
