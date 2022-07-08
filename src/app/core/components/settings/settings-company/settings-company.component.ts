import { map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { SettingsStoreService } from './../state/settings.service';
import { Observable, of } from 'rxjs';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CompanyResponse } from 'appcoretruckassist';
import { CompanyQuery } from '../state/company-state/company-settings.query';
import { companySettingsResolver } from '../state/company-state/company-settings.resolver';
@Component({
  selector: 'app-settings-company',
  templateUrl: './settings-company.component.html',
  styleUrls: ['./settings-company.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DetailsPageService],
})
export class SettingsCompanyComponent implements OnInit, OnDestroy {
  public isModalOpen$: boolean;
  // public isModalOpen$: boolean; // TODO: FILL DATA WITH REAL DATA, IF NO DATA, SHOW NO_DATA_COMPONENT !!!
  public data: any;
  public dataDivison: any;
  public optionsCmp: any;
  public dataCompany: any;

  constructor(
    private settingsStoreService: SettingsStoreService,
    private activated: ActivatedRoute,
    private detailsPageSer: DetailsPageService,
    private notificationService: NotificationService,
    private cdRef: ChangeDetectorRef,
    private settingCompanyQuery: CompanyQuery
  ) {}

  ngOnInit(): void {
    this.getData(this.activated.snapshot.data.company);
    this.settingCompanyQuery.getAll().map((item) => {
      this.dataCompany = item.divisions;
      if (item.companyPayrolls.length) {
        this.isModalOpen$ = false;
      } else {
        this.isModalOpen$ = true;
      }
    });
    this.getCompanyDivision();
    this.detailsPageSer.pageDetailChangeId$
      .pipe(untilDestroyed(this))
      .subscribe((id) => {
        this.settingsStoreService
          .getCompanyDivisionById(id)
          .pipe(untilDestroyed(this))
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
    this.optionsCmp = this.dataCompany.map((item) => {
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
  ngOnDestroy(): void {}
}
