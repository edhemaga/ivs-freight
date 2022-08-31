import { TrucksMinimalListStore } from './../state/truck-details-minima-list-state/truck-details-minimal.store';
import { TruckItemStore } from './../state/truck-details-state/truck.details.store';
import { TrucksMinimalListQuery } from './../state/truck-details-minima-list-state/truck-details-minimal.query';
import { TruckMinimalResponse } from './../../../../../../appcoretruckassist/model/truckMinimalResponse';
import { TruckMinimalListResponse } from './../../../../../../appcoretruckassist/model/truckMinimalListResponse';
import { TruckResponse } from './../../../../../../appcoretruckassist/model/truckResponse';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
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
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { TruckModalComponent } from '../../modals/truck-modal/truck-modal.component';
import { TruckDetailsQuery } from '../state/truck-details-state/truck.details.query';
import { TtTitleModalComponent } from '../../modals/common-truck-trailer-modals/tt-title-modal/tt-title-modal.component';
import { Confirmation } from '../../modals/confirmation-modal/confirmation-modal.component';
import { ConfirmationService } from '../../modals/confirmation-modal/confirmation.service';
import { DropDownService } from 'src/app/core/services/details-page/drop-down.service';

@Component({
  selector: 'app-truck-details',
  templateUrl: './truck-details.component.html',
  styleUrls: ['./truck-details.component.scss'],
  providers: [DetailsPageService],
})
export class TruckDetailsComponent implements OnInit, OnDestroy {
  // @Input() data:any=null;
  private destroy$ = new Subject<void>();
  public truckDetailsConfig: any[] = [];
  public dataTest: any;
  registrationLength: number;
  inspectionLength: number;
  titleLength: number;
  public data: any;
  public truckObject: any;
  public truckList: any = this.truckMinimalListQuery.getAll();
  public currentIndex: number = 0;
  public truckId: number;
  constructor(
    private truckTService: TruckTService,
    private notificationService: NotificationService,
    private activated_route: ActivatedRoute,
    private detailsPageDriverSer: DetailsPageService,
    private modalService: ModalService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private truckDetailQuery: TruckDetailsQuery,
    private tableService: TruckassistTableService,
    private dropService: DropDownService,
    private confirmationService: ConfirmationService,
    private truckMinimalListQuery: TrucksMinimalListQuery,
    private truckItemStore: TruckItemStore,
    private truckMinimalStore: TrucksMinimalListStore
  ) {}

  ngOnInit(): void {
    this.currentIndex = this.truckList.findIndex(
      (truck) => truck.id === this.activated_route.snapshot.data.truck.id
    );
    this.getTruckById(this.activated_route.snapshot.data.truck.id);
    this.initTableOptions(this.activated_route.snapshot.data.truck);
    this.tableService.currentActionAnimation
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.animation) {
          this.truckConf(res.data);
          this.getTruckById(res.id);
          this.initTableOptions(res.data);
          this.cdRef.detectChanges();
        }
      });
    // Confirmation Subscribe
    this.confirmationService.confirmationData$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Confirmation) => {
          console.log(res + 'ovo je res');

          switch (res.type) {
            case 'delete': {
              if (res.template === 'truck') {
                this.deleteTruckById(res.id);
              }
              break;
            }
            case 'activate': {
              this.changeTruckStatus(res.id);
              break;
            }
            case 'deactivate': {
              this.changeTruckStatus(res.id);
              break;
            }
            default: {
              break;
            }
          }
        },
      });
    this.detailsPageDriverSer.pageDetailChangeId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => {
        this.truckTService
          .getTruckById(id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res: TruckResponse) => {
              this.currentIndex = this.truckList.findIndex(
                (truck) => truck.id === res.id
              );
              this.truckConf(res);
              this.getTruckById(res.id);
              this.initTableOptions(res);
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
  public getTruckById(id: number) {
    this.truckTService
      .getTruckById(id, true)
      .subscribe((item) => (this.truckObject = item));
  }
  public deleteTruckById(id: number) {
    let status = this.truckObject.status == 0 ? 'inactive' : 'active';

    let last = this.truckList.at(-1);
    if (last.id === this.truckMinimalStore.getValue().ids[this.currentIndex]) {
      this.currentIndex = --this.currentIndex;
    } else {
      this.currentIndex = ++this.currentIndex;
    }
    this.truckTService
      .deleteTruckByIdDetails(id, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (this.truckMinimalStore.getValue().ids.length >= 1) {
            this.router.navigate([
              `/truck/${this.truckList[this.currentIndex].id}/details`,
            ]);
          }
          this.notificationService.success(
            'Truck successfully deleted',
            'Success:'
          );
        },
        error: () => {
          this.router.navigate(['/truck']);
        },
      });
  }
  public changeTruckStatus(id: number) {
    let status = this.truckObject.status == 0 ? 'inactive' : 'active';
    this.truckTService
      .changeTruckStatus(id, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            `Truck successfully Change Status`,
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error(
            `Truck with id: ${id}, status couldn't be changed`,
            'Error:'
          );
        },
      });
  }
  public optionsDrop(event: any) {
    this.dropService.dropActionHeaderTruck(
      event,
      this.truckObject,
      this.truckId,
      null
    );
  }
  /**Function for dots in cards */
  public initTableOptions(data: TruckMinimalResponse): void {
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
          title: 'Print',
          name: 'print-truck',
          svg: 'assets/svg/common/ic_fax.svg',
          show: true,
        },

        {
          title: 'Edit',
          name: 'edit',
          svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
          show: true,
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
          type: 'truck',
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
        status: data?.status == 0 ? true : false,
      },
      {
        id: 1,
        name: 'Registration',
        template: 'registration',
        length: data?.registrations?.length ? data.registrations.length : 0,
        data: data,
        status: data?.status == 0 ? true : false,
      },
      {
        id: 2,
        name: 'FHWA Inspection',
        template: 'fhwa-insepction',
        length: data?.inspections?.length ? data.inspections.length : 0,
        data: data,
        status: data?.status == 0 ? true : false,
      },
      {
        id: 3,
        name: 'Title',
        template: 'title',
        length: data?.titles?.length ? data.titles.length : 0,
        data: data,
        status: data?.status == 0 ? true : false,
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
