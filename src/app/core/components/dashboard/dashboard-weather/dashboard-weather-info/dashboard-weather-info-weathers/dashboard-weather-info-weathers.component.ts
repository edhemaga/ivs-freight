import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-dashboard-weather-info-weathers',
  templateUrl: './dashboard-weather-info-weathers.component.html',
  styleUrls: ['./dashboard-weather-info-weathers.component.scss']
})
export class DashboardWeatherInfoWeathersComponent implements OnInit {
  @Input() forecast: any;
  todayDate: any = new Date().getTime();

  constructor() {
  }

  ngOnInit(): void {
  }

}
