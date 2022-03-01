import {takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import { AppLeadBoardService } from 'src/app/core/services/shared/app-leadboard.service';

@Component({
  selector: 'app-dashboard-history',
  templateUrl: './dashboard-history.component.html',
  styleUrls: ['./dashboard-history.component.scss']
})
export class DashboardHistoryComponent implements OnInit, OnDestroy {
  selectedPeriod: any = 'ytd';
  selectedItem: any = 'dispatcher';
  leadboardData: any = [];
  allOthersData: any = [];
  timeList: any = [
    {
      id: 1,
      name: 'All time',
      period: 'all'
    },
    {
      id: 2,
      name: 'Today',
      period: 'today'
    },
    {
      id: 3,
      name: 'WTD',
      period: 'wtd'
    },
    {
      id: 4,
      name: 'MTD',
      period: 'mtd'
    },
    {
      id: 5,
      name: 'YTD',
      period: 'ytd'
    },
    // {
    //   id: 6,
    //   name: "Custom"
    // }
  ];
  itemList: any = [
    {
      id: 1,
      name: 'Dispatch.',
      type: 'dispatcher'
    },
    {
      id: 2,
      name: 'Broker',
      type: 'broker'
    },
    {
      id: 3,
      name: 'Shipper',
      type: 'shipper'
    },
    {
      id: 4,
      name: 'Driver',
      type: 'driver'
    },
    {
      id: 5,
      name: 'Truck',
      type: 'truck'
    },
    // {
    //   id: 6,
    //   name: "Owner"
    // }
  ];
  switchData: any = [
    {
      id: 'loads',
      name: 'Load',
      checked: false,
    },
    {
      id: 'revenue',
      name: 'Revenue',
      checked: true,
    },
  ];
  selectedType = 'revenue';
  topCount = 'all';
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private leadboard: AppLeadBoardService) {
  }

  ngOnInit(): void {
    this.getLeadBoardMainList();
  }

  getLeadBoardMainList(): void {
    this.leadboard.getLeadBoardList(this.selectedItem, this.topCount, this.selectedPeriod)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.leadboardData = res.list;
        this.allOthersData = res.allOthers;
        this.sortLeadboard();
      });
  }


  changeTopCount() {
    this.topCount = this.topCount == 'top10' ? 'all' : 'top10';
    this.getLeadBoardMainList();
  }

  switchType(data: any) {
    if (data !== undefined && data[0] !== undefined) {
      data.map(item => {
        if (item.checked) {
          this.selectedType = item.id;
        }
        this.sortLeadboard();
      });
    }
  }

  sortLeadboard(): void {
    this.leadboardData.sort((a, b) => {
      return b[this.selectedType] - a[this.selectedType];
    }).map(item => {
      const maxValue = this.leadboardData[0][this.selectedType];
      item.percentage = ((item[this.selectedType] / maxValue) * 100 * 3).toFixed(3);
      return item;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
