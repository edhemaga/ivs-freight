import {takeUntil} from 'rxjs/operators';
import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Subject} from 'rxjs';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import moment from "moment";
import { AppFuelService } from 'src/app/core/services/shared/app-fuel.service';
import { SharedService } from 'src/app/core/services/shared/shared.service';

@Component({
  selector: 'app-dashboard-fuel',
  templateUrl: './dashboard-fuel.component.html',
  styleUrls: ['./dashboard-fuel.component.scss'],
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
    trigger('balanceRefresher', [
      state('*', style({
        color: "#fff"
      })),
      transition('* => *', [
        animate('600ms', style({color: "#24C1A1", transform: "scale(1.05)"}))
      ]),
    ]),
  ]
})

export class DashboardFuelComponent implements OnInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;
  searchExpanded = false;
  selectedTruckId = 1;
  accountNumber: number;
  balanceRefresher: boolean;
  pageIndex: number = 1;
  pageSize: number = 20;
  public truckList: any = [
    {
      id: 1,
      truckId: '#2134567'
    },
    {
      id: 2,
      truckId: '#454544'
    },
    {
      id: 3,
      truckId: '#334333'
    },
    {
      id: 4,
      truckId: '#323232'
    }
  ];
  public fuelTotal: number = 0;
  public fuelData: any = [];
  lastScrollEnd = 0;
  updateFuelList: boolean = false;
  fuelMainListData: any[] = [];
  fuelDateContainer: any = {};
  fuelDateArray: any[] = [];
  fuelDates: any = {};
  fullIndexesFuel: number = 0;
  private destroy$: Subject<void> = new Subject<void>();
  private balanceInt: any;

  constructor(private fuelService: AppFuelService, private shared: SharedService, private changeRef: ChangeDetectorRef) {
  }

  public get inverseOfTranslation(): string {
    if (!this.viewport || !this.viewport["_renderedContentOffset"]) {
      return "-0px";
    }
    let offset = this.viewport["_renderedContentOffset"];
    return `-${offset}px`;
  }

  public get fuelDataKeys() {
    return Object.keys(this.fuelDateContainer);
  }

  ngOnInit(): void {
    this.getFuelData();
    this.setBalanceInterval();
    if (!this.accountNumber) this.getAccountCompanyId();
    else this.getCompanyFuelBalance();
  }

  onScrollChanged(e: any) {
    console.log("HEELOOO");
    const itemInfo = e.target.getBoundingClientRect();

    if (e.target.scrollTop >= (e.target.scrollHeight - itemInfo.height)) {
      if (!this.updateFuelList) {
        this.updateFuelList = true;
        this.pageIndex++;
        //this.lastScrollEnd = this.viewport.getRenderedRange().end;
        this.getFuelData();
      }
    }

    return;
    if (this.viewport.getRenderedRange().end > 0) {
      if (e >= this.viewport.getRenderedRange().end && this.lastScrollEnd != this.viewport.getRenderedRange().end) {
        this.pageIndex++;
        this.lastScrollEnd = this.viewport.getRenderedRange().end;
        this.getFuelData();
      }
    }
  }

  public setBalanceInterval() {
    this.balanceInt = setInterval(() => {
      if (this.accountNumber) this.getCompanyFuelBalance();
    }, 900000);
  }

  public getCompanyFuelBalance() {
    this.fuelService.getFuelAvailableCredit(this.accountNumber)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (item: any) => {
          this.balanceRefresher = !this.balanceRefresher;
          this.fuelTotal = parseFloat(item.toFixed(2));
        }
      )
  }

  public getAccountCompanyId() {
    this.fuelService.getAccountCompanyId(1)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (item: any) => {
          this.fuelMainListData = item.pagination.data;
          this.accountNumber = item.pagination.data[0].id;
          this.getCompanyFuelBalance();
        }
      )
  }

  public getFuelData() {
    this.fuelService.getFuellist(this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (item: any) => {
          this.fuelData = this.fuelData.concat(item.pagination.data.map(item => {
            const fuelDate = moment(item.transactionDate).format("DD/MM/YYYY");
            if (fuelDate in this.fuelDates) {
              this.fuelDates[fuelDate]["indx"] = this.fullIndexesFuel;
              this.fuelDates[fuelDate]["fullCount"]++;
            } else {
              this.fuelDates[fuelDate] = {
                indx: this.fullIndexesFuel,
                fullCount: 0
              }
            }

            this.fullIndexesFuel++;

            let itemCount = 0;
            let price = 0;
            let qty = 0;
            item.fuelItem?.map(fuelItem => {
              itemCount = itemCount + fuelItem.subtotal;
              price = price + fuelItem.price;
              qty = qty + fuelItem.qty;
            });
            item.fuelTotal = itemCount.toFixed(2);
            item.fuelDate = fuelDate;
            item.totalPrice = price.toFixed(2);
            item.totalQty = qty.toFixed(2);

            return item;
          }));

          this.updateFuelList = false;

          this.changeRef.detectChanges();
        }
      );
  }

  public setExpanded(data): void {
    this.searchExpanded = data.changeStyle;
  }

  ngOnDestroy() {
    clearInterval(this.balanceInt);
    this.destroy$.next();
    this.destroy$.complete();
  }

}
