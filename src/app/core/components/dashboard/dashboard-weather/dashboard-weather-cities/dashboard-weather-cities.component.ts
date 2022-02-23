import {forkJoin} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import moment from 'moment-timezone';
import {animate, style, transition, trigger} from '@angular/animations';
import { SharedService } from '../../../../services/shared/shared.service';

@Component({
  selector: 'app-dashboard-weather-cities',
  templateUrl: './dashboard-weather-cities.component.html',
  styleUrls: ['./dashboard-weather-cities.component.scss'],
  animations: [
    trigger('shrinkItem', [
      transition(':enter', [
        style({width: 50, height: '32px', overflow: 'hidden', whiteSpace: 'pre'}),
        animate('200ms', style({width: '*'})),
      ]),
      transition(':leave', [
        style({width: 50, height: '32px', overflow: 'hidden', whiteSpace: 'pre'}),
        animate('200ms', style({width: 0})),
      ]),
    ]),
  ]
})
export class DashboardWeatherCitiesComponent implements OnInit {

  searchExpanded = false;
  cityData: any = [];

  constructor(private http: HttpClient, private shared: SharedService) {
  }

  ngOnInit(): void {
    this.getTimeForAllCities();
  }

  getTimezoneForCity(code) {
    const timestamp = new Date().getTime() / 1000 + new Date().getTimezoneOffset() * 60;
    const apiURL = `https://maps.googleapis.com/maps/api/timezone/json?location=${code}&timestamp=${timestamp}&key=AIzaSyCw4WQw1T4N6TjFWdS731mM09x88SGW81I`;
    return this.http.get(apiURL);
  }

  handleAddress(address) {
    const lat = address.geometry.location.lat();
    const lng = address.geometry.location.lng();
    const timestamp = new Date().getTime() / 1000 + new Date().getTimezoneOffset() * 60;
    const filtered_address = this.shared.selectAddress(null, address);
    const filtered_location = `${filtered_address.city}, ${filtered_address.stateShortName}`;

    const insideIndex = this.cityData.findIndex(item => item.cityLocation == filtered_location);
    if (insideIndex == -1) {
      this.getTimezoneForCity([lat, lng].join(',')).subscribe((res: any) => {
        const offsets = res.dstOffset * 1000 + res.rawOffset * 1000;

        const localdate = new Date(timestamp * 1000 + offsets);
        const utcOffset = moment(new Date()).tz(res.timeZoneId).utcOffset();

        this.cityData.push({
          date: localdate,
          cityLocation: filtered_location,
          timeZoneName: res.timeZoneName,
          utcOffset: utcOffset / 60,
          lat,
          lng
        });

        localStorage.setItem('timezoneCities', JSON.stringify(this.cityData));
      });
    }
  }

  getTimeForAllCities() {
    const observableBatch = [];

    const timezoneCities = localStorage.getItem('timezoneCities') ? JSON.parse(localStorage.getItem('timezoneCities')) : [];
    timezoneCities.map(item => {
      observableBatch.push(this.getTimezoneForCity([item.lat, item.lng].join(',')));
    });

    this.cityData = [];
    forkJoin(observableBatch).subscribe(
      (result) => {
        result.map((res: any, indx: number) => {
          const timestamp = new Date().getTime() / 1000 + new Date().getTimezoneOffset() * 60;
          const offsets = res.dstOffset * 1000 + res.rawOffset * 1000;
          const utcOffset = moment(new Date()).tz(res.timeZoneId).utcOffset();
          const localdate = new Date(timestamp * 1000 + offsets);
          timezoneCities[indx].date = localdate;
          timezoneCities[indx].utcOffset = utcOffset / 60;
          this.cityData.push(timezoneCities[indx]);
        });
      });
  }

  public setExpanded(data): void {
    this.searchExpanded = data.changeStyle;
  }

  public removeFromTimezoneCities(indx: number): void {
    this.cityData.splice(indx, 1);
    localStorage.setItem('timezoneCities', JSON.stringify(this.cityData));
  }

}
