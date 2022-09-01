import { TrailerResponse } from './../../../../../../appcoretruckassist/model/trailerResponse';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TtFhwaInspectionModalComponent } from '../../modals/common-truck-trailer-modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TtRegistrationModalComponent } from '../../modals/common-truck-trailer-modals/tt-registration-modal/tt-registration-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { TrailerTService } from '../state/trailer.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { TrailerModalComponent } from '../../modals/trailer-modal/trailer-modal.component';
import { TrailerDetailsQuery } from '../state/trailer-details-state/trailer-details.query';
import { TtTitleModalComponent } from '../../modals/common-truck-trailer-modals/tt-title-modal/tt-title-modal.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-trailer-details',
  templateUrl: './trailer-details.component.html',
  styleUrls: ['./trailer-details.component.scss'],
  providers: [DetailsPageService],
})
export class TrailerDetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public trailerDetailsConfig: any[] = [];
  public trailerId: number = null;
  public dataHeaderDropDown: any;
  constructor(
    private activated_route: ActivatedRoute,
    private modalService: ModalService,
    private trailerService: TrailerTService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private notificationService: NotificationService,
    private detailsPageDriverSer: DetailsPageService,
    private tableService: TruckassistTableService,
    private trailerDetailsQuery: TrailerDetailsQuery
  ) {}

  ngOnInit(): void {
    this.initTableOptions();
    this.tableService.currentActionAnimation
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.animation) {
          this.trailerConf(res.data);

          this.cdRef.detectChanges();
        }
      });
    this.detailsPageDriverSer.pageDetailChangeId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => {
        let query;
        if (this.trailerDetailsQuery.hasEntity(id)) {
          query = this.trailerDetailsQuery.selectEntity(id);
        } else {
          query = this.trailerService.getTrailerById(id);
        }
        query.pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: TrailerResponse) => {
            this.trailerConf(res);
            this.router.navigate([`/trailer/${res.id}/details`]);
            this.notificationService.success(
              'Trailer successfully changed',
              'Success:'
            );
            this.cdRef.detectChanges();
          },
          error: () => {
            this.notificationService.error("Trailer can't be loaded", 'Error:');
          },
        });
      });
    this.trailerConf(this.activated_route.snapshot.data.trailer);
  }

  trailerConf(data: TrailerResponse) {
    this.trailerDetailsConfig = [
      {
        id: 0,
        name: 'Trailer Details',
        template: 'general',
        data: data,
      },
      {
        id: 1,
        name: 'Registration',
        template: 'registration',
        data: data,
        length: data?.registrations?.length ? data.registrations.length : 0,
      },
      {
        id: 2,
        name: 'FHWA Inspection',
        template: 'fhwa-insepction',
        data: data,
        length: data?.inspections?.length ? data.inspections.length : 0,
      },
      {
        id: 3,
        name: 'Title',
        template: 'title',
        data: data,
        length: data?.titles?.length ? data.titles.length : 0,
      },
      {
        id: 4,
        name: 'Lease / Purchase',
        template: 'lease-purchase',
        length: 1,
        data: data,
      },
    ];
    this.trailerId = data?.id ? data.id : null;
  }
  /**Function for dots in cards */
  public initTableOptions(): void {
    this.dataHeaderDropDown = {
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
  public onTrailerActions(event: any) {
    switch (event.type) {
      case 'edit': {
        this.modalService.openModal(
          TrailerModalComponent,
          { size: 'small' },
          {
            ...event,
            type: 'edit',
            disableButton: true,
            id: this.trailerId,
          }
        );
        break;
      }
      case 'delete': {
        this.trailerService
          .deleteTrailerById(event.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.notificationService.success(
                'Trailer successfully deleted',
                'Success:'
              );
            },
            error: () => {
              this.notificationService.error(
                `Trailer with id: ${event.id} couldn't be deleted`,
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
  public onModalAction(action: string): void {
    const trailer = this.activated_route.snapshot.data.trailer;
    switch (action.toLowerCase()) {
      case 'registration': {
        this.modalService.openModal(
          TtRegistrationModalComponent,
          { size: 'small' },
          {
            id: trailer.id,
            payload: trailer,
            type: 'add-registration',
            modal: 'trailer',
          }
        );
        break;
      }
      case 'fhwa inspection': {
        this.modalService.openModal(
          TtFhwaInspectionModalComponent,
          { size: 'small' },
          {
            id: trailer.id,
            payload: trailer,
            type: 'add-inspection',
            modal: 'trailer',
          }
        );
        break;
      }
      case 'title': {
        this.modalService.openModal(
          TtTitleModalComponent,
          { size: 'small' },
          {
            id: trailer.id,
            payload: trailer,
            type: 'add-title',
            modal: 'trailer',
          }
        );
        break;
      }
      default: {
        break;
      }
    }
  }
  /**Function return id */
  public identity(index: number, item: any): number {
    return item.id;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
