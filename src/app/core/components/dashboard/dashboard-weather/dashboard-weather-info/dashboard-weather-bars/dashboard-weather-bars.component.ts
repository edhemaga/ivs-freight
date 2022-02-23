import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard-weather-bars',
  templateUrl: './dashboard-weather-bars.component.html',
  styleUrls: ['./dashboard-weather-bars.component.scss']
})
export class DashboardWeatherBarsComponent implements OnInit {
  @Input() forecast: any;

  constructor() {
  }

  ngOnInit(): void {
  }

}
