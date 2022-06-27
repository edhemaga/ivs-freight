import { TruckResponse } from './../../../../../../appcoretruckassist/model/truckResponse';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TruckQuery } from './../state/truck.query';
import { Subject } from 'rxjs';
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { TruckTService } from '../state/truck.service';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { TtRegistrationModalComponent } from '../../modals/common-truck-trailer-modals/tt-registration-modal/tt-registration-modal.component';
import { TtFhwaInspectionModalComponent } from '../../modals/common-truck-trailer-modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { TruckModalComponent } from '../../modals/truck-modal/truck-modal.component';
@Component({
  selector: 'app-truck-details',
  templateUrl: './truck-details.component.html',
  styleUrls: ['./truck-details.component.scss'],
  providers:[DetailsPageService]
})
export class TruckDetailsComponent implements OnInit, OnDestroy {
  // @Input() data:any=null;
  public truckDetailsConfig: any[] = [];
  public dataTest: any;
  registrationLength: number;
  inspectionLength: number;
  titleLength: number;
  public data: any;
  public truckId: number = null;
  constructor(
    private truckTService: TruckTService,
    private notificationService: NotificationService,
    private activated_route: ActivatedRoute,
    private detailsPageDriverSer: DetailsPageService,
    private modalService: ModalService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private tableService: TruckassistTableService
  ) {}

  ngOnInit(): void {
    this.initTableOptions();
    this.tableService.currentActionAnimation
    .pipe(untilDestroyed(this))
    .subscribe((res: any) => {
      if (res.animation) {
        this.truckConf(res.data);

        this.cdRef.detectChanges();
      }
    });
    // this.data = this.activated_route.snapshot.data.truck;
    this.detailsPageDriverSer.pageDetailChangeId$
      .pipe(untilDestroyed(this))
      .subscribe((id) => {
        this.truckTService
          .getTruckById(id)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (res: TruckResponse) => {
              this.truckConf(res);
              this.router.navigate([`/truck/${res.id}/details`]);
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
    return item.id;
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
          class: 'regular-text',
          contentType: 'edit',
        },

        {
          title: 'Delete',
          name: 'delete-item',
          type: 'truck',
          text: 'Are you sure you want to delete truck(s)?',
          class: 'delete-text',
          contentType: 'delete',
        },
      ],
      export: true,
    };
  }

  public onModalAction(action: string): void {
    switch (action.toLowerCase()) {
      case 'registration': {
        this.modalService.openModal(
          TtRegistrationModalComponent,
          { size: 'small' },
          { id:this.truckId, type: 'add-registration', modal: 'truck' }
        );
        break;
      }
      case 'fhwa inspection': {
        this.modalService.openModal(
          TtFhwaInspectionModalComponent,
          { size: 'small' },
          { id: this.truckId, type: 'add-inspection', modal: 'truck' }
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
        data:data
      },
      {
        id: 1,
        name: 'Registration',
        template: 'registration',
        length: data.registrations.length,
        data: data,
      },
      {
        id: 2,
        name: 'FHWA Inspection',
        template: 'fhwa-insepction',
        length: data.inspections.length,
        data: data,
      },
      {
        id: 3,
        name: 'Title',
        template: 'title',
        length: data.titles.length,
        data: data,
      },
      {
        id: 4,
        name: 'Lease / Purchase',
        template: 'lease-purchase',
        length: 1,
      },
    ];

    this.truckId = data?.id ? data.id : null;
  }

  public onTrackActions(event: any) {
    
    console.log(event);
    switch (event.type) {
      case 'edit': {
        this.modalService.openModal(
          TruckModalComponent,
          { size: 'small' },
          {
            ...event,
            type: 'edit',
            disableButton: true,
            id:this.truckId
          }
        );
        break;
      }
    
      case 'delete-item': {
        this.truckTService
          .deleteTruckById(event.id)
          .pipe(untilDestroyed(this))
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

  ngOnDestroy(): void {}
}
