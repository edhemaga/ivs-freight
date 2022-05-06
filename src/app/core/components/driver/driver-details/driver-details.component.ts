import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { of, Subject, switchMap, takeUntil } from 'rxjs';
import { Driver } from '../state/driver.model';
import { DriversQuery } from '../state/driver.query';

@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    const cdlData = reasponse.licenseData.map((data) => {
      return {
        ...data,
        showDetails: false,
      };
    });
    const medicalData = reasponse.medicalData.map((data) => {
      return {
        ...data,
        showDetails: false,
      };
    });
    const mvrData = reasponse.mvrData.map((data) => {
      return {
        ...data,
        showDetails: false,
      };
    });

    this.driverDetailsConfig = [
      {
        id: 0,
        name: 'Driver Details',
        template: 'general',
        data: {
          reasponse,
          assignedTo: {
            truck: '36545',
            trailer: 'R45784',
          },
          additionalInfo: {
            dob: reasponse.dob,
            ssn: reasponse.ssn,
            company: 'KSKA FREIGHT, INC',
            ein: '12-3456789',
          },
          employmentHistory: {},
          bankInfo: {
            routing: '052001633',
            account: '0000000006213',
          },
          cards: {
            twicExp: '04/12/24',
            fuelCard: '485-71-8131',
          },
          emergencyContact: {
            brother: 'Marko Markovic',
            phone: '(479) 347-7270',
          },
          note: 'How to pursue pleasure rationally encounter consequences that are extremely painful.',
        },
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
        template: 'drug-alcohol',
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
  }

  public identity(index: number, item: any): number {
    return item.id;
  }
   
  

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
