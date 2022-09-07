import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject, takeUntil, filter } from 'rxjs';
import { DropDownService } from 'src/app/core/services/details-page/drop-down.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { ConfirmationService } from '../../../modals/confirmation-modal/confirmation.service';
import { SettingsLocationService } from '../../state/location-state/settings-location.service';
import { CompanyRepairShopService } from './state/company-repairshop.service';
import { formatCurrency } from '../../../../pipes/formatCurrency.pipe';
import { RepairShopResponse } from 'appcoretruckassist';
import { RepairTService } from '../../../repair/state/repair.service';
import { Confirmation } from '../../../modals/confirmation-modal/confirmation-modal.component';
import { dropActionNameDriver } from 'src/app/core/utils/function-drop.details-page';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-settings-repair-shop',
  templateUrl: './settings-repair-shop.component.html',
  styleUrls: ['./settings-repair-shop.component.scss'],
  providers: [formatCurrency],
})
export class SettingsRepairShopComponent implements OnInit, OnDestroy {
  public repairShopData: any;
  private destroy$ = new Subject<void>();
  public count: number = 0;
  public repairsActions: any;
  public repairShopDataId: any;
  constructor(
    private settingsLocationService: SettingsLocationService,
    private repairShopSrv: CompanyRepairShopService,
    private tableService: TruckassistTableService,
    private cdRef: ChangeDetectorRef,
    private dropDownService: DropDownService,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService,
    private formatCurrency: formatCurrency,
    private repairService: RepairTService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.tableService.currentActionAnimation
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.animation) {
          this.getRepairShopList();
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
              if (res.template === 'Company Repair Shop') {
                this.deleteRepairShopById(res.id);
              }
              break;
            }
            default: {
              break;
            }
          }
        },
      });
    this.repairShopData =
      this.activatedRoute.snapshot.data.companyrepairshop.pagination;
    this.initOptions();
  }
  public getRepairShopById(id: number) {
    this.repairService
      .getRepairShopById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((item) => (this.repairShopDataId = item));
  }
  public repairDropActions(any: any, actions: string) {
    this.getRepairShopById(any.id);
    setTimeout(() => {
      const name = dropActionNameDriver(any, actions);
      this.dropDownService.dropActionCompanyLocation(
        any,
        name,
        this.repairShopDataId
      );
    }, 150);
  }

  public deleteRepairShopById(id: number) {
    this.repairService
      .deleteRepairShopById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Repair shop successfully deleted',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error(
            `Repair shop with id: ${id} couldn't be deleted`,
            'Error:'
          );
        },
      });
  }
  public onAction(modal: { modalName: string; type: string }) {
    this.settingsLocationService.onModalAction(modal);
  }
  public getRepairShopList() {
    this.repairShopSrv
      .getCompanyRepairShopList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((item) => {
        this.repairShopData = item.pagination;
      });
  }
  public identity(index: number, item: any): number {
    return item.id;
  }
  /**Function for dots in cards */
  public initOptions(): void {
    this.repairsActions = {
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
  public generateTextForProgressBar(data: any): string {
    return (
      data.payPeriod.name +
      ' Rent ' +
      `-  ${this.formatCurrency.transform(data.rent)}`
    );
  }

  public getActiveServices(data: RepairShopResponse) {
    return data.serviceTypes.filter((item) => item.active);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.tableService.sendActionAnimation({});
  }
}
