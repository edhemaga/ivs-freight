import { TruckResponse } from './../../../../../../appcoretruckassist/model/truckResponse';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
/* import { TruckQuery } from './../state/truck.query'; */
import { Subject, takeUntil } from 'rxjs';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TruckTService } from '../state/truck.service';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { TtRegistrationModalComponent } from '../../modals/common-truck-trailer-modals/tt-registration-modal/tt-registration-modal.component';
import { TtFhwaInspectionModalComponent } from '../../modals/common-truck-trailer-modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { TruckModalComponent } from '../../modals/truck-modal/truck-modal.component';
import { TruckDetailsQuery } from '../state/truck-details-state/truck.details.query';
import { TtTitleModalComponent } from '../../modals/common-truck-trailer-modals/tt-title-modal/tt-title-modal.component';

@Component({
  selector: 'app-truck-details',
  templateUrl: './truck-details.component.html',
  styleUrls: ['./truck-details.component.scss'],
  providers: [DetailsPageService],
})
export class TruckDetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public truckDetailsConfig: any[] = [];
  public dataTest: any;
  registrationLength: number;
  inspectionLength: number;
  titleLength: number;
  public data: any;

  constructor(
    private truckTService: TruckTService,
    private notificationService: NotificationService,
    private activated_route: ActivatedRoute,
    private detailsPageDriverSer: DetailsPageService,
    private modalService: ModalService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private truckDetailQuery: TruckDetailsQuery,
    private tableService: TruckassistTableService
  ) {}

  ngOnInit(): void {
    this.initTableOptions();
    this.tableService.currentActionAnimation
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.animation) {
          this.truckConf(res.data);

          this.cdRef.detectChanges();
        }
      });
    // this.data = this.activated_route.snapshot.data.truck;
    this.detailsPageDriverSer.pageDetailChangeId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => {
        let query;
        if (this.truckDetailQuery.hasEntity(id)) {
          query = this.truckDetailQuery.selectEntity(id);
        } else {
          query = this.truckTService.getTruckById(id);
        }
        query.pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: TruckResponse) => {
            this.truckConf(res);
            if (this.router.url.includes('details')) {
              this.router.navigate([`/truck/${res.id}/details`]);
            }

            this.notificationService.success(
              'Truck successfully changed',
              'Success:'
            );
            this.cdRef.detectChanges();
          },
          error: () => {
            this.notificationService.error("Truck can't be loaded", 'Error:');
          },
        });
      });
    this.truckConf(this.activated_route.snapshot.data.truck);
  }
  /**Function retrun id */
  public identity(index: number, item: any): number {
    return index;
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
        // {
        //   title: 'Send Message',
        //   name: 'dm',
        //   class: 'regular-text',
        //   contentType: 'dm',
        // },
        // {
        //   title: 'Print',
        //   name: 'print',
        //   class: 'regular-text',
        //   contentType: 'print',
        // },
        // {
        //   title: 'Deactivate',
        //   name: 'deactivate',
        //   class: 'regular-text',
        //   contentType: 'deactivate',
        // },
        {
          title: 'Edit',
          name: 'edit',
          svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
          show: true,
        },

        {
          title: 'Delete',
          name: 'delete-item',
          type: 'truck',
          text: 'Are you sure you want to delete truck(s)?',
          svg: 'assets/svg/common/ic_trash_updated.svg',
          danger: true,
          show: true,
        },
      ],
      export: true,
    };
  }

  public onModalAction(action: string): void {
    const truck = this.activated_route.snapshot.data.truck;
    switch (action.toLowerCase()) {
      case 'registration': {
        this.modalService.openModal(
          TtRegistrationModalComponent,
          { size: 'small' },
          {
            id: truck.id,
            payload: truck,
            type: 'add-registration',
            modal: 'truck',
          }
        );
        break;
      }
      case 'fhwa inspection': {
        this.modalService.openModal(
          TtFhwaInspectionModalComponent,
          { size: 'small' },
          {
            id: truck.id,
            payload: truck,
            type: 'add-inspection',
            modal: 'truck',
          }
        );
        break;
      }
      case 'title': {
        this.modalService.openModal(
          TtTitleModalComponent,
          { size: 'small' },
          { id: truck.id, payload: truck, type: 'add-title', modal: 'truck' }
        );
        break;
      }
      default: {
        break;
      }
    }
  }

  public truckConf(data: TruckResponse) {
    this.truckDetailsConfig = [
      {
        id: 0,
        name: 'Truck Details',
        template: 'general',
        data: data,
      },
      {
        id: 1,
        name: 'Registration',
        template: 'registration',
        length: data?.registrations?.length ? data.registrations.length : 0,
        data: data,
      },
      {
        id: 2,
        name: 'FHWA Inspection',
        template: 'fhwa-insepction',
        length: data?.inspections?.length ? data.inspections.length : 0,
        data: data,
      },
      {
        id: 3,
        name: 'Title',
        template: 'title',
        length: data?.titles?.length ? data.titles.length : 0,
        data: data,
      },
      {
        id: 4,
        name: 'Lease / Purchase',
        template: 'lease-purchase',
        length: 1,
      },
    ];
  }

  public onTrackActions(event: any) {
    const truck = this.activated_route.snapshot.data.truck;
    switch (event.type) {
      case 'edit': {
        this.modalService.openModal(
          TruckModalComponent,
          { size: 'small' },
          {
            ...event,
            type: 'edit',
            disableButton: true,
            id: truck.id,
          }
        );
        break;
      }

      case 'delete-item': {
        this.truckTService
          .deleteTruckById(event.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.notificationService.success(
                'Truck successfully deleted',
                'Success:'
              );
            },
            error: () => {
              this.notificationService.error(
                `Truck with id: ${event.id} couldn't be deleted`,
                'Error:'
              );
            },
          });
        break;
      }
      default: {
        break;
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
