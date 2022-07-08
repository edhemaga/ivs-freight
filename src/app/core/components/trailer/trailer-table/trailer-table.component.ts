import { Component, OnInit, OnDestroy } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { closeAnimationAction } from 'src/app/core/utils/methods.globals';
import { getTrailerColumnDefinition } from 'src/assets/utils/settings/trailer-columns';
import { TtFhwaInspectionModalComponent } from '../../modals/common-truck-trailer-modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TtRegistrationModalComponent } from '../../modals/common-truck-trailer-modals/tt-registration-modal/tt-registration-modal.component';
import { TrailerModalComponent } from '../../modals/trailer-modal/trailer-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { TrailerQuery } from '../state/trailer.query';
import { TrailerTService } from '../state/trailer.service';
import { TrailerState } from '../state/trailer.store';

@Component({
  selector: 'app-trailer-table',
  templateUrl: './trailer-table.component.html',
  styleUrls: ['./trailer-table.component.scss'],
})
export class TrailerTableComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'active';
  resetColumns: boolean;

  public trailer: TrailerState[] = [];

  constructor(
    private modalService: ModalService,
    private tableService: TruckassistTableService,
    private trailerQuery: TrailerQuery,
    private trailerService: TrailerTService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initTableOptions();
    this.getTrucksData();

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.resetColumns = response;

          this.sendTrailerData();
        }
      });

    // Add Trailer
    this.tableService.currentActionAnimation
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
        if (res.animation === 'add') {
          this.viewData.push(this.mapTrailerData(res.data));

          this.viewData = this.viewData.map((trailer: any) => {
            if (trailer.id === res.id) {
              trailer.actionAnimation = 'add';
            }

            return trailer;
          });

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
          }, 1000);
        } else if (res.animation === 'update') {
          this.viewData = this.viewData.map((trailer: any) => {
            if (trailer.id === res.id) {
              trailer = this.mapTrailerData(res.data);
              trailer.actionAnimation = 'update';
            }

            return trailer;
          });

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
          }, 1000);
        } else if (res.animation === 'update-status') {
          let trailerIndex: number;

          this.viewData = this.viewData.map((trailer: any, index: number) => {
            if (trailer.id === res.id) {
              trailer.actionAnimation = 'update';
              trailerIndex = index;
            }

            return trailer;
          });

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            this.viewData.splice(trailerIndex, 1);
            clearInterval(inetval);
          }, 1000);
        }
      });

    // Delete Selected Rows
    this.tableService.currentDeleteSelectedRows
      .pipe(untilDestroyed(this))
      .subscribe((response: any[]) => {
        if (response.length) {
          this.trailerService
            .deleteTrailerList(response)
            .pipe(untilDestroyed(this))
            .subscribe(() => {
              this.viewData = this.viewData.map((trailer: any) => {
                response.map((r: any) => {
                  if (trailer.id === r.id) {
                    trailer.actionAnimation = 'delete';
                  }
                });

                return trailer;
              });

              this.notificationService.success(
                'Trailers successfully deleted',
                'Success:'
              );

              const inetval = setInterval(() => {
                this.viewData = closeAnimationAction(true, this.viewData);

                clearInterval(inetval);
              }, 1000);

              this.tableService.sendRowsSelected([]);
              this.tableService.sendResetSelectedColumns(true);
            });
        }
      });
  }

  public initTableOptions(): void {
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
          title: 'Edit Trailer',
          name: 'edit-trailer',
          class: 'regular-text',
          contentType: 'edit',
        },
        {
          title: 'Add Registration',
          name: 'add-registration',
          class: 'regular-text',
          contentType: 'add',
        },
        {
          title: 'Add Inspection',
          name: 'add-inspection',
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
          type: 'trailer',
          text: 'Are you sure you want to delete trailer(s)?',
          class: 'delete-text',
          contentType: 'delete',
        },
      ],
      export: true,
    };
  }

  getTrucksData() {
    this.sendTrailerData();
  }

  sendTrailerData() {
    this.tableData = [
      {
        title: 'Active',
        field: 'active',
        length: 15,
        data: this.getTabData(),
        extended: false,
        gridNameTitle: 'Trailer',
        stateName: 'trailers',
        gridColumns: this.getGridColumns('trailers', this.resetColumns),
      },
      {
        title: 'Inactive',
        field: 'inactive',
        length: 25,
        data: this.getTabData(),
        extended: false,
        gridNameTitle: 'Trailer',
        stateName: 'trailers',
        gridColumns: this.getGridColumns('trailers', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setTrailerData(td);
  }

  private getGridColumns(stateName: string, resetColumns: boolean): any[] {
    const userState: any = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );

    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      return getTrailerColumnDefinition();
    }
  }

  setTrailerData(td: any) {
    this.viewData = td.data;
    this.columns = td.gridColumns;

    this.viewData = this.viewData.map((data) => {
      return this.mapTrailerData(data);
    });
  }

  mapTrailerData(data: any) {
    return {
      ...data,
      isSelected: false,
      textMake: data?.trailerMake?.name ? data.trailerMake.name : '',
      textModel: data?.model ? data?.model : '',
      ownerName: data?.owner?.name ? data.owner.name : '',
      textColor: data?.color?.code ? data.color.code : '',
      svgIcon: data?.trailerType?.name
        ? data.trailerType.name
        : '' /* Treba da bude svg ne text */,
      textLength: data?.trailerLength?.name ? data.trailerLength.name : '',
      textLicPlate: data?.licensePlate
        ? data.licensePlate
        : data?.registrations?.length
        ? data.registrations[0].licensePlate
        : '',
      textInspectionData: {
        start: data?.fhwaInspection
          ? data.fhwaInspection
          : data?.inspections?.length
          ? data.inspections[0].issueDate
          : null,
        end: null,
      },
    };
  }
  getTabData() {
    this.trailer = this.trailerQuery.getAll();

    return this.trailer?.length ? this.trailer : [];
  }

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      this.modalService.openModal(TrailerModalComponent, {
        size: 'small',
      });
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;
      this.setTrailerData(event.tabData);
    }
  }

  public onTableBodyActions(event: any) {
    switch (event.type) {
      case 'edit-trailer': {
        this.modalService.openModal(
          TrailerModalComponent,
          { size: 'small' },
          {
            ...event,
            type: 'edit',
            disableButton: true,
          }
        );
        break;
      }
      case 'add-registration': {
        this.modalService.openModal(
          TtRegistrationModalComponent,
          { size: 'small' },
          {
            ...event,
            modal: 'trailer',
          }
        );
        break;
      }
      case 'add-inspection': {
        this.modalService.openModal(
          TtFhwaInspectionModalComponent,
          { size: 'small' },
          {
            ...event,
            modal: 'trailer',
          }
        );
        break;
      }
      case 'activate-item': {
        this.trailerService
          .changeTrailerStatus(event.id)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: () => {
              this.notificationService.success(
                'Trailer successfully changed status',
                'Success:'
              );

              this.getTrucksData();
            },
            error: () => {
              this.notificationService.error(
                `Trailer with id: ${event.id}, status couldn't be changed`,
                'Error:'
              );
            },
          });
        break;
      }
      case 'delete-item': {
        this.trailerService
          .deleteTrailerById(event.id)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: () => {
              this.notificationService.success(
                'Trailer successfully deleted',
                'Success:'
              );

              this.viewData = this.viewData.map((trailer: any) => {
                if (trailer.id === event.id) {
                  trailer.actionAnimation = 'delete';
                }

                return trailer;
              });

              const inetval = setInterval(() => {
                this.viewData = closeAnimationAction(true, this.viewData);

                clearInterval(inetval);
              }, 1000);
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

  ngOnDestroy(): void {
    this.tableService.sendActionAnimation({});
  }
}
