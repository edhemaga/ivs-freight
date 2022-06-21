import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RepairShopResponse } from 'appcoretruckassist';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { ShopQuery } from '../state/shop-state/shop.query';

@Component({
  selector: 'app-shop-repair-card-view',
  templateUrl: './shop-repair-card-view.component.html',
  styleUrls: ['./shop-repair-card-view.component.scss'],
 
})
export class ShopRepairCardViewComponent implements OnInit {
  @Input() shopResponse: RepairShopResponse | any;
  @Input() templateCard: boolean;
  public noteControl: FormControl = new FormControl();
  public count: number;
  public tabs: any;
  public shopsDropdowns: any[] = [];
  public shopsList: any[] = this.shopQuery.getAll();
  constructor(
    private shopQuery: ShopQuery,
    private detailsPageDriverSer: DetailsPageService
  ) {}

  ngOnInit(): void {
    this.noteControl.patchValue(this.shopResponse.note);
    this.getShopsDropdown();
    this.getActiveServices();
    this.tabsSwitcher();
  }
  /**Function return id */
  public identity(index: number, item: any): number {
    return item.id;
  }

  public getShopsDropdown() {
    this.shopsDropdowns = this.shopQuery.getAll().map((item) => {
      return {
        id: item.id,
        name: item.name,
        status: item.status,
        svg: item.pinned ? 'star' : null,
        folder: 'common',
        active: item.id === this.shopResponse.id,
      };
    });  
  }

  public onSelectedShop(event: any) {
    if (event.id !== this.shopResponse.id) {
      this.shopsList = this.shopQuery.getAll().map((item) => {
        return {
          id: item.id,
          name: item.name,
          status: item.status,
          svg: item.pinned ? 'star' : null,
          folder: 'common',
          active: item.id === event.id,
        };
      });
      this.detailsPageDriverSer.getDataDetailId(event.id);
    }
  }

  public onChangeShop(action: string) {
    let currentIndex = this.shopsList
      .map((shop) => shop.id)
      .indexOf(this.shopResponse.id);
    switch (action) {
      case 'previous': {
        currentIndex = --currentIndex;
        if (currentIndex != -1) {
          this.detailsPageDriverSer.getDataDetailId(
            this.shopsList[currentIndex].id
          );
          this.onSelectedShop({ id: this.shopsList[currentIndex].id });
        }
        break;
      }
      case 'next': {
        currentIndex = ++currentIndex;
        if (currentIndex !== -1 && this.shopsList.length > currentIndex) {
          this.detailsPageDriverSer.getDataDetailId(
            this.shopsList[currentIndex].id
          );
          this.onSelectedShop({ id: this.shopsList[currentIndex].id });
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  public getActiveServices() {
    let res = this.shopResponse.serviceTypes.filter((item) => item.active);
    this.count = res.length;
    return this.count;
  }
  public tabsSwitcher() {
    this.tabs = [
      {
        id: 223,
        name: '1M',
      },
      {
        name: '3M',
        checked: false,
      },
      {
        id: 412,
        name: '6M',
        checked: false,
      },
      {
        id: 515,
        name: '1Y',
        checked: false,
      },
      {
        id: 1210,
        name: 'YTD',
        checked: false,
      },
      {
        id: 1011,
        name: 'ALL',
        checked: false,
      },
    ];
  }
}
