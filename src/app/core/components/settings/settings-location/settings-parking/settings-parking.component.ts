import { formatCurrency } from './../../../../pipes/formatCurrency.pipe';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DropDownService } from 'src/app/core/services/details-page/drop-down.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { dropActionNameDriver } from 'src/app/core/utils/function-drop.details-page';
import { Confirmation } from '../../../modals/confirmation-modal/confirmation-modal.component';
import { ConfirmationService } from '../../../modals/confirmation-modal/confirmation.service';
import { SettingsLocationService } from '../../state/location-state/settings-location.service';
import { CompanyParkingService } from './parking-state/company-parking.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-settings-parking',
  templateUrl: './settings-parking.component.html',
  styleUrls: ['./settings-parking.component.scss'],
  providers: [formatCurrency],
})
export class SettingsParkingComponent implements OnInit, OnDestroy {
  public parkingPhone: boolean;
  public parkingEmail: boolean;
  private destroy$ = new Subject<void>();
  public parkingData: any;
  public parkingDataById: any;
  public parkingActions: any;
  constructor(
    private settingsLocationService: SettingsLocationService,
    private companyParkingService: CompanyParkingService,
    private tableService: TruckassistTableService,
    private cdRef: ChangeDetectorRef,
    private dropDownService: DropDownService,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService,
    private formatCurrency: formatCurrency,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.tableService.currentActionAnimation
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.animation) {
          this.getParkingList();
          this.cdRef.detectChanges();
        }
      });

    // Confirmation Subscribe
    this.confirmationService.confirmationData$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Confirmation) => {
          switch (res.type) {
            case 'delete': {
              if (res.template === 'Company Parking') {
                this.deleteParkingById(res.id);
              }
              break;
            }
            default: {
              break;
            }
          }
        },
      });
    this.parkingData = this.activatedRoute.snapshot.data.parking.pagination;
    this.initOptions();
  }

  public onAction(modal: { modalName: string; type: any }) {
    this.settingsLocationService.onModalAction(modal);
  }
  public getParkingById(id: number) {
    this.settingsLocationService
      .getCompanyParkingById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((item) => (this.parkingDataById = item));
  }
  public optionsEvent(any: any, action: string) {
    this.getParkingById(any.id);

    setTimeout(() => {
      const name = dropActionNameDriver(any, action);
      this.dropDownService.dropActionCompanyLocation(
        any,
        name,
        this.parkingDataById
      );
    }, 100);
  }

  public deleteParkingById(id: number) {
    this.settingsLocationService
      .deleteCompanyParkingById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Parking successfully deleted',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error(
            `Parking with id: ${id} couldn't be deleted`,
            'Error:'
          );
        },
      });
  }
  public identity(index: number, item: any): number {
    return item.id;
  }
  /**Function for dots in cards */
  public initOptions(): void {
    this.parkingActions = {
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
          title: 'Edit',
          name: 'edit',
          svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
          show: true,
        },
        {
          title: 'Delete',
          name: 'delete-item',
          type: 'driver',
          text: 'Are you sure you want to delete driver(s)?',
          svg: 'assets/svg/common/ic_trash_updated.svg',
          danger: true,
          show: true,
        },
      ],
      export: true,
    };
  }

  public getParkingList() {
    this.companyParkingService
      .getParkingList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((item) => (this.parkingData = item.pagination));
  }
  public calculateParkingSlots(item: any) {
    return Number(item.parkingSlot) + Number(item.fullParkingSlot);
  }

  public generateTextForProgressBar(data: any): string {
    return (
      data.payPeriod.name +
      ' Rent ' +
      `-  ${this.formatCurrency.transform(data.rent)}`
    );
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.tableService.sendActionAnimation({});
  }
}
