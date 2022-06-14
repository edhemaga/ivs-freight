import { DriverMvrModalComponent } from './driver-modals/driver-mvr-modal/driver-mvr-modal.component';
import { DriverMedicalModalComponent } from './driver-modals/driver-medical-modal/driver-medical-modal.component';
import { DriverDrugAlcoholModalComponent } from './driver-modals/driver-drugAlcohol-modal/driver-drugAlcohol-modal.component';
import { DriverCdlModalComponent } from './driver-modals/driver-cdl-modal/driver-cdl-modal.component';
import { ModalService } from './../../shared/ta-modal/modal.service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DriverTService } from '../state/driver.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { DriverResponse } from 'appcoretruckassist';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverDetailsComponent implements OnInit, OnDestroy {
  public driverDetailsConfig: any[] = [];
  public dataTest: any;
  public driverId: number = null;

  constructor(
    private activated_route: ActivatedRoute,
    private modalService: ModalService,
    private driverService: DriverTService,
    private router: Router,
    private notificationService: NotificationService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initTableOptions();
    this.detailCongif(this.activated_route.snapshot.data.driver);

    this.driverService.driverDetailChangeId$
      .pipe(untilDestroyed(this))
      .subscribe((id) => {
        this.driverService
          .getDriverById(id)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (res: DriverResponse) => {
              this.detailCongif(res);
              this.router.navigate([`/driver/${res.id}/details`]);
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
  detailCongif(data: DriverResponse) {
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
        length: data.cdls?.length,
        data: data.cdls,
      },
      {
        id: 2,
        name: 'Drug & Alcohol',
        template: 'drug-alcohol',
        length: data.tests?.length,
        data: data.tests,
      },
      {
        id: 3,
        name: 'Medical',
        template: 'medical',
        length: data.medicals?.length,
        data: data.medicals,
      },
      {
        id: 4,
        name: 'MVR',
        template: 'mvr',
        length: data.mvrs?.length,
        data: data.mvrs,
      },
    ];
    this.driverId = data.id;
  }

  /**Function for dots in cards */
  public initTableOptions(): void {
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
          class: 'regular-text',
          contentType: 'dm',
        },
        {
          title: 'Print',
          name: 'print',
          class: 'regular-text',
          contentType: 'print',
        },

        {
          title: 'Edit',
          name: 'edit',
          class: 'regular-text',
          contentType: 'edit',
        },
        {
          title: 'Deactivate',
          name: 'deactivate',
          class: 'regular-text',
          contentType: 'deactivate',
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

  public onModalAction(action: string): void {
    if (action.includes('Drug')) {
      action = 'DrugAlcohol';
    }
    switch (action) {
      case 'CDL': {
        this.modalService.openModal(
          DriverCdlModalComponent,
          { size: 'small' },
          { id: this.driverId, type: 'new-licence' }
        );
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
    return item.id;
  }

  ngOnDestroy(): void {}
}
