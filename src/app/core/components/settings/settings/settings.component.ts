import { Subject, takeUntil } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingsStoreService } from '../state/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {

  public data: boolean = false;
  private destroy$ = new Subject<void>();
  constructor(private settingsService: SettingsStoreService) {}
  
  ngOnInit(): void {
    this.settingsService.noDataSubject$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.data = data;
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
