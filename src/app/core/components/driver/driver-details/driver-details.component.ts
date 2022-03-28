import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DriversQuery } from '../state/driver.query';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.scss'],
})
export class DriverDetailsComponent implements OnInit {
  constructor(
    private driversQuery: DriversQuery,
    private activated_route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activated_route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          let user_id = params.get('id');
          console.log(user_id);
          return of(this.driversQuery.getAll().find(driver => driver.id === parseInt(user_id)));
        })
      )
      .subscribe((res) => {
        console.log('REASPONSIVE ', res);
      });
  }
}
