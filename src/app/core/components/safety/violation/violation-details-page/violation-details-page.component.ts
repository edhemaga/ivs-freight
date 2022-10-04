import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LoadResponse, RoadsideInspectionResponse } from 'appcoretruckassist';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { RoadsideDetailsListQuery } from '../state/roadside-details-state/roadside-details-list-state/roadside-details-list.query';
import { takeUntil, take, Subject } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { RoadsideService } from '../state/roadside.service';

@Component({
  selector: 'app-violation-details-page',
  templateUrl: './violation-details-page.component.html',
  styleUrls: ['./violation-details-page.component.scss'],
  providers: [DetailsPageService],
})
export class ViolationDetailsPageComponent implements OnInit {
  public violationInitCongif: any[] = [];
  public violationData: any;
  private destroy$ = new Subject<void>();
  public violationDrop: any;
  public violationId: number;
  constructor(
    private act_route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private detailsPageService: DetailsPageService,
    private rsdlq: RoadsideDetailsListQuery,
    private roadSer: RoadsideService
  ) {}

  ngOnInit(): void {
    this.initOptions();
    this.detailsPageService.pageDetailChangeId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => {
        let query;
        if (this.rsdlq.hasEntity(id)) {
          query = this.rsdlq.selectEntity(id).pipe(take(1));
        } else {
          query = this.roadSer.getRoadsideById(id);
        }
        query.pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: LoadResponse) => {
            this.violationConfig(res);
            this.router.navigate([`/safety/violation/${res.id}/details`]);
            this.notificationService.success(
              'Violation successfully changed',
              'Success:'
            );
          },
          error: () => {
            this.notificationService.error(
              "Violation can't be loaded",
              'Error:'
            );
          },
        });
      });
    this.violationConfig(this.act_route.snapshot.data.roadItem);
  }
  /**Function for dots in cards */
  public initOptions(): void {
    this.violationDrop = {
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
          name: 'print',
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
          title: 'Add Citation',
          name: 'add-citation',
          svg: 'assets/svg/common/ic_plus.svg',
          show: true,
        },
      ],
      export: true,
    };
  }
  /**Default names for header */
  public violationConfig(data: RoadsideInspectionResponse) {
    this.violationInitCongif = [
      {
        id: 0,
        name: 'Roadside Insp. Details',
        template: 'general',
        data: data,
        secondName: '',
      },
      {
        id: 1,
        name: 'Team',
        template: 'violation',
        data: data,
        hide: true,
        customText: 'Time Weight',
        hasArrow: false,
        length: data?.violations?.length ? data.violations.length : 0,
        counterViolation: data?.timeWeight ? data.timeWeight : 0,
        secondName: 'Violation',
      },
      {
        id: 2,
        name: 'Citation',
        template: 'citation',
        data: data,
        length: 12,
        secondName: '',
      },
    ];
    this.violationId = data?.id ? data.id : null;
  }

  /**Function return id */
  public identity(index: number, item: any): number {
    return item.id;
  }
}
