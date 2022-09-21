import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { RepairShopResponse } from 'appcoretruckassist';
import { ShopQuery } from '../state/shop-state/shop.query';
import { RepairShopMinimalListQuery } from '../state/shop-details-state/shop-minimal-list-state/shop-minimal.query';
import { Subject, takeUntil } from 'rxjs';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { DetailsPageService } from '../../../services/details-page/details-page-ser.service';
import { RepairTService } from '../state/repair.service';

@Component({
  selector: 'app-shop-repair-card-view',
  templateUrl: './shop-repair-card-view.component.html',
  styleUrls: ['./shop-repair-card-view.component.scss'],
})
export class ShopRepairCardViewComponent
  implements OnInit, OnChanges, OnDestroy
{
  private destroy$ = new Subject<void>();
  @Input() shopResponse: any;
  @Input() templateCard: boolean;
  public noteControl: FormControl = new FormControl();
  public count: number;
  public tabs: any;
  public shopsDropdowns: any[] = [];
  public shopsList: any[] = this.repairShopMinimalQuery.getAll();
  public repairShopObject: any;
  constructor(
    private shopQuery: ShopQuery,
    private detailsPageDriverSer: DetailsPageService,
    private tableService: TruckassistTableService,
    private cdRef: ChangeDetectorRef,
    private repairShopMinimalQuery: RepairShopMinimalListQuery,
    private shopService: RepairTService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.shopResponse?.currentValue != changes.shopResponse?.previousValue
    ) {
      this.getActiveServices(changes.shopResponse.currentValue);
      this.getShopsDropdown();
      this.shopResponse = changes.shopResponse?.currentValue;
      this.noteControl.patchValue(changes.shopResponse.currentValue.note);
    }
    this.getRepairShopById(changes.shopResponse.currentValue.id);
    this.repairShopMinimalQuery
      .selectAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((item) => (this.shopsList = item));
  }
  ngOnInit(): void {
    this.tableService.currentActionAnimation
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.animation) {
          this.shopResponse = res.data;
          this.cdRef.detectChanges();
        }
      });
    this.tabsSwitcher();
  }

  /**Function return id */
  public identity(index: number, item: any): number {
    return item.id;
  }
  public getRepairShopById(id: number) {
    this.shopService
      .getRepairShopById(id, true)
      .pipe(takeUntil(this.destroy$))
      .subscribe((item) => (this.repairShopObject = item));
  }
  public getShopsDropdown() {
    this.shopsDropdowns = this.repairShopMinimalQuery.getAll().map((item) => {
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
      this.shopsList = this.repairShopMinimalQuery.getAll().map((items) => {
        return {
          id: items.id,
          name: items.name,
          status: items.status,
          svg: items.pinned ? 'star' : null,
          folder: 'common',
          active: items.id === event.id,
        };
      });
      this.detailsPageDriverSer.getDataDetailId(event.id);
    }
  }

  public onChangeShop(action: string) {
    let currentIndex = this.shopsList.findIndex(
      (shop) => shop.id === this.shopResponse.id
    );
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

  public getActiveServices(data: RepairShopResponse) {
    let res = data.serviceTypes.filter((item) => item.active);
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.tableService.sendActionAnimation({});
  }
}
