import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { SettingsCompanyService } from '../../state/company-state/settings-company.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-settings-factoring',
  templateUrl: './settings-factoring.component.html',
  styleUrls: ['./settings-factoring.component.scss'],
})
export class SettingsFactoringComponent implements OnChanges, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() public factoringData: any;
  public factoringPhone: boolean;
  public factoringEmail: boolean;
  constructor(
    private settingsCompanyService: SettingsCompanyService,
    private notificationService: NotificationService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes?.factoringData?.currentValue !==
      changes?.factoringData?.previousValue
    ) {
      this.factoringData = changes?.factoringData?.currentValue;
    }
  }

  public onAction(modal: { modalName: string; type: string; company: any }) {
    this.settingsCompanyService.onModalAction(modal);
  }

  public onDeleteFactoringCompany() {
    this.settingsCompanyService
      .deleteFactoringCompanyById(
        this.factoringData.divisions.length ? null : this.factoringData.id
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfully delete factoring company',
            'Success'
          );
        },
        error: () => {
          this.notificationService.error(
            "Can't delete factoring company",
            'Error'
          );
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
