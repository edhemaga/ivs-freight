import { ActivatedRoute } from '@angular/router';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectorRef,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { SettingsCompanyService } from '../state/company-state/settings-company.service';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { CompanyResponse } from 'appcoretruckassist';
import { CompanyQuery } from '../state/company-state/company-settings.query';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-settings-company',
  templateUrl: './settings-company.component.html',
  styleUrls: ['./settings-company.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DetailsPageService],
})
export class SettingsCompanyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public isModalOpen$: boolean;
  // public isModalOpen$: boolean; // TODO: FILL DATA WITH REAL DATA, IF NO DATA, SHOW NO_DATA_COMPONENT !!!
  public data: any;
  public dataDivison: any;
  public optionsCmp: any;
  public dataCompany: any;

  constructor(
    private SettingsCompanyService: SettingsCompanyService,
    private activated: ActivatedRoute,
    private detailsPageSer: DetailsPageService,
    private notificationService: NotificationService,
    private cdRef: ChangeDetectorRef,
    private tableService: TruckassistTableService,
    private settingCompanyQuery: CompanyQuery
  ) {}

  ngOnInit(): void {
    this.settingCompanyQuery
      .getAll()
      .map((item) => (this.dataCompany = item.divisions));

    this.tableService.currentActionAnimation
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.animation) {
          this.dataCompany = res.data.divisions;
          this.getData(res.data);
          this.getCompanyDivision();
          this.cdRef.detectChanges();
        }
      });
    this.getData(this.activated.snapshot.data.company);
    this.settingCompanyQuery.getAll().map((item) => {
      if (item?.companyPayrolls?.length) {
        this.isModalOpen$ = false;
      } else {
        this.isModalOpen$ = true;
      }
    });
    this.getCompanyDivision();
    this.detailsPageSer.pageDetailChangeId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => {
        this.SettingsCompanyService.getCompanyDivisionById(id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res: CompanyResponse) => {
              this.getData(res);
              this.notificationService.success(
                'Company Division successfully changed',
                'Success:'
              );
              this.cdRef.detectChanges();
            },
            error: () => {
              this.getData(this.activated.snapshot.data.company);
              this.notificationService.success(
                'Company successfully changed',
                'Success:'
              );
            },
          });
      });
  }

  public getData(data: CompanyResponse) {
    this.data = data;
  }
  public getCompanyDivision() {
    this.optionsCmp = this.dataCompany?.map((item) => {
      return {
        ...item,
        id: item.id,
        name: item.companyName,
        active: !item.isDivision,
      };
    });
  }
  public selectCompany(event: any) {
    this.optionsCmp = this.dataCompany.map((item) => {
      return {
        ...item,
        id: item.id,
        name: item.companyName,
        active: item.id === event.id,
      };
    });
    this.detailsPageSer.getDataDetailId(event.id);
  }
  ngOnDestroy(): void {
    this.tableService.sendActionAnimation({});

    this.destroy$.next();
    this.destroy$.complete();
  }
}
