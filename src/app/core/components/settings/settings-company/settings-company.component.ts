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
@Component({
  selector: 'app-settings-company',
  templateUrl: './settings-company.component.html',
  styleUrls: ['./settings-company.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DetailsPageService],
})
export class SettingsCompanyComponent implements OnInit, OnChanges, OnDestroy {
  public isModalOpen$: boolean; // TODO: FILL DATA WITH REAL DATA, IF NO DATA, SHOW NO_DATA_COMPONENT !!!
  public data: any;
  public dataDivison: any;
  public optionsCmp: any;
  public dataCompany: any;
  constructor(
    private settingsStoreService: SettingsStoreService,
    private activated: ActivatedRoute,
    private detailsPageSer: DetailsPageService,
    private notificationService: NotificationService,
    private cdRef: ChangeDetectorRef
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
  }
  ngOnInit(): void {
    this.getData(this.activated.snapshot.data.company);
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
    if (this.activated.snapshot.data.company) {
      this.isModalOpen$ = false;
    } else {
      this.isModalOpen$ = true;
    }
  }

  public getData(data: CompanyResponse) {
    this.data = data;
  }
  public getCompanyDivision() {
    this.optionsCmp = this.activated.snapshot.data.company.divisions.map(
      (item) => {
        return {
          ...item,
          id: item.id,
          name: item.companyName,
          active: !item.isDivision,
        };
      }
    );
  }
  public selectCompany(event: any) {
    this.optionsCmp = this.activated.snapshot.data.company.divisions.map(
      (item) => {
        return {
          ...item,
          id: item.id,
          name: item.companyName,
          active: item.id === event.id,
        };
      }
    );
    this.detailsPageSer.getDataDetailId(event.id);
  }
  ngOnDestroy(): void {}
}
