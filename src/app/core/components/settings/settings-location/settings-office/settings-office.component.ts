import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { formatCurrency } from 'src/app/core/pipes/formatCurrency.pipe';
import { DropDownService } from 'src/app/core/services/details-page/drop-down.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { dropActionNameDriver } from 'src/app/core/utils/function-drop.details-page';
import { Confirmation } from '../../../modals/confirmation-modal/confirmation-modal.component';
import { ConfirmationService } from '../../../modals/confirmation-modal/confirmation.service';
import { SettingsLocationService } from '../../state/location-state/settings-location.service';
import { CompanyTOfficeService } from './state/company-office.service';
@Component({
  selector: 'app-settings-office',
  templateUrl: './settings-office.component.html',
  styleUrls: ['./settings-office.component.scss'],
  providers: [formatCurrency],
})
export class SettingsOfficeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public officeActions: any;
  public officeData: any;
  constructor(
    private settingsLocationService: SettingsLocationService,
    private companyOfficeService: CompanyTOfficeService,
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
          this.getOfficeList();
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
              if (res.template === 'office') {
                this.deleteOfficeById(res.id);
              }
              break;
            }
            default: {
              break;
            }
          }
        },
      });
    this.officeData = this.activatedRoute.snapshot.data.office.pagination;
    this.initOptions();
  }

  public deleteOfficeById(id: number) {
    this.settingsLocationService
      .deleteCompanyOfficeById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Office successfully deleted',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error(
            `Office with id: ${id} couldn't be deleted`,
            'Error:'
          );
        },
      });
  }
  public onAction(modal: { modalName: string; type: any }) {
    this.settingsLocationService.onModalAction(modal);
  }

  public getOfficeList() {
    this.companyOfficeService
      .getOfficeList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((item) => (this.officeData = item.pagination));
  }

  public identityOfficeData(index: number, item: any): number {
    return item.id;
  }

  public identityCardData(index: number, item: any): number {
    return item.id;
  }

  public officeDropActions(any: any, actions: string) {
    setTimeout(() => {
      const name = dropActionNameDriver(any, actions);
      this.dropDownService.dropActionCompanyLocation(any, name, any.id);
    }, 100);
  }
  /**Function for dots in cards */
  public initOptions(): void {
    this.officeActions = {
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
      `- ${this.formatCurrency.transform(data.rent)}`
    );
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.tableService.sendActionAnimation({});
  }
}
