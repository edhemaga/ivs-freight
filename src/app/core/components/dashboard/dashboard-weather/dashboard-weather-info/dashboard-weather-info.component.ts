import { AppWeatherService } from './../../../../services/shared/app-weather.service';
import {Component, OnInit} from '@angular/core';
import {forkJoin} from 'rxjs';
import {animate, style, transition, trigger} from '@angular/animations';
import { SharedService } from '../../../../services/shared/shared.service';

@Component({
  selector: 'app-dashboard-weather-info',
  templateUrl: './dashboard-weather-info.component.html',
  styleUrls: ['./dashboard-weather-info.component.scss'],
  animations: [
    trigger('barAnimation', [
      transition(':enter', [
        style({height: 100, bottom: 0}),
        animate('400ms', style({height: '*', bottom: '*'}))
      ])
    ])
  ]
})
export class DashboardWeatherInfoComponent implements OnInit {

  forecastDataToday: any = [];
  forecastDataTodayIndex = -1;
  forecastForAllFavoritesCities: any = [];
  searchExpanded: boolean;

  constructor(private weatherService: AppWeatherService, private shared: SharedService) {
  }

  ngOnInit(): void {
    this.getForecastForAllCities();
  }

  openDailyReport(item, index) {
    console.log(item);
    item.isInFavorites = true;
    this.forecastDataToday = item;
    this.forecastDataTodayIndex = index;
    this.calculatePercentage();
  }

  getForecastForAllCities() {
    const observableBatch = [];
    const user_company = JSON.parse(localStorage.getItem('userCompany'));
    if (user_company) {
      const cityAddress = `${user_company.doc.additional.address.city}, ${user_company.doc.additional.address.country}`;
      observableBatch.push(this.weatherService.getWeatherInfo(cityAddress));
    }

    const favoriteCities = localStorage.getItem('favoriteCities') ? JSON.parse(localStorage.getItem('favoriteCities')) : [];
    favoriteCities.map(item => {
      observableBatch.push(this.weatherService.getWeatherInfo(item));
    });

    forkJoin(observableBatch).subscribe(
      (result: any) => {
        if (Object.keys(result[0].days).length > 0) {
          result.map(item => {
            const address = item.resolvedAddress.split(', ');
            item.location = {
              city: address[0],
              region: address[1]
            };
            return item;
          });

          this.forecastDataToday = result[0];
          this.forecastDataToday.isCompanyAddress = true;
          this.forecastDataTodayIndex = 0;
          this.forecastForAllFavoritesCities = result;
          this.calculatePercentage();
        }
      });
  }

  calculatePercentage() {
    const lowHight = this.forecastDataToday.days.slice(0, 8).reduce((finArr, item) => {
      if (item.tempmin) {
        finArr.low.push(item.tempmin);
      }
      if (item.tempmax) {
        finArr.high.push(item.tempmax);
      }
      return finArr;
    }, {high: [], low: []});

    const minTemp = Math.min.apply(null, lowHight.low);
    const maxTemp = Math.max.apply(null, lowHight.high);
    const graphPixel = (160 / (maxTemp - minTemp)).toFixed(2);

    this.forecastDataToday.days.slice(0.8).map((item, indx) => {
      item.bottom = Math.abs((minTemp - item.tempmin) * parseFloat(graphPixel));
      item.height = (item.tempmax - item.tempmin) * parseFloat(graphPixel);
      return item;
    });
  }

  addToFavorites() {
    if (this.forecastDataToday.isCompanyAddress) {
      return;
    }
    const favoriteCities = localStorage.getItem('favoriteCities') ? JSON.parse(localStorage.getItem('favoriteCities')) : [];
    if (!this.forecastDataToday.isInFavorites) {
      this.forecastDataToday.isInFavorites = true;
      this.forecastDataTodayIndex = this.forecastForAllFavoritesCities.length;
      this.forecastForAllFavoritesCities.push(this.forecastDataToday);
      const cityLocation = `${this.forecastDataToday.location.city},${this.forecastDataToday.location.region}`;
      favoriteCities.push(cityLocation);
    } else {
      this.forecastDataToday.isInFavorites = false;
      this.forecastForAllFavoritesCities.splice(this.forecastDataTodayIndex, 1);
      favoriteCities.splice(this.forecastDataTodayIndex - 1, 1);

    }
    localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities));
  }

  removeFromFavorites(item, indx) {
    const favoriteCities = localStorage.getItem('favoriteCities') ? JSON.parse(localStorage.getItem('favoriteCities')) : [];
    item.isInFavorites = false;
    localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities));
    this.forecastForAllFavoritesCities.splice(indx, 1);
    favoriteCities.splice(indx - 1, 1);
    localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities));
  }

  public setExpanded(data): void {
    this.searchExpanded = data.changeStyle;
  }

  handleAddress(address) {
    const filtered_address = this.shared.selectAddress(null, address);
    const findedItem = this.forecastForAllFavoritesCities.findIndex(item => item.location.city == filtered_address.city && item.location.region.trim() == filtered_address.stateShortName.trim());
    if (findedItem > -1) {
      this.forecastDataToday = this.forecastForAllFavoritesCities[findedItem];
      this.calculatePercentage();
    } else {
      const cityAddress = `${filtered_address.city}, ${filtered_address.country}`;
      this.weatherService.getWeatherInfo(filtered_address.address).subscribe((item: any) => {
        const address = item.resolvedAddress.split(', ');
        item.location = {
          city: address[0],
          region: address[1]
        };
        this.forecastDataToday = item;
        this.calculatePercentage();
      });
    }
  }
}
