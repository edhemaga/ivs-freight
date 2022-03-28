import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DriversQuery } from '../state/driver.query';
import { switchMap } from 'rxjs/operators';
import { of, Subject, takeUntil } from 'rxjs';
import { Driver } from '../state/driver.model';

@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DriverDetailsComponent implements OnInit, OnDestroy {
  public driverDetailsConfig: any[] = [];

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private driversQuery: DriversQuery,
    private activated_route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activated_route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          let user_id = params.get('id');
          return of(
            this.driversQuery
              .getAll()
              .find((driver) => driver.id === parseInt(user_id))
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        console.log('REASPONSIVE ', res);
        this.setDetailsConfig(res);
      });
  }

  private setDetailsConfig(reasponse: Driver) {
    const cdlData = reasponse.licenseData.map(data => {
      return {
        ...data,
        showDetails: false
      }
    })
    const medicalData = reasponse.medicalData.map(data => {
      return {
        ...data,
        showDetails: false
      }
    });
    const mvrData = reasponse.mvrData.map(data => {
      return {
        ...data,
        showDetails: false
      }
    });
    
    this.driverDetailsConfig = [
      {
        id: 0,
        name: 'General',
        template: 'general',
        data: [],
      },
      {
        id: 1,
        name: 'CDL',
        template: 'cdl',
        data: cdlData,
      },
      {
        id: 2,
        name: 'Drug & Alcohol',
        template: 'drugAlcohol',
        data: [],
      },
      {
        id: 3,
        name: 'Medical',
        template: 'medical',
        data: medicalData,
      },
      {
        id: 4,
        name: 'MVR',
        template: 'mvr',
        data: mvrData,
      },
    ];
    console.log('CDL ', cdlData);
    console.log('MEDICAL ', medicalData);
    console.log('MVR ', mvrData);
  }

  public identity(index: number, item: any): number {
    return item.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
