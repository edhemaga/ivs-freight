import { DriverTabData } from 'src/app/core/model/driver';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-accounting-index',
  templateUrl: './accounting-index.component.html',
  styleUrls: ['./accounting-index.component.scss'],
})
export class AccountingIndexComponent implements OnInit {
  @Input() inputData: any;
  public tableOptions: any;
  public accountingColumns: any[] = [];
  public driversList: any[];
  public driverColumns: any[] = [];
  public loadingItems = true;
  public selectedTab = 'payroll';
  public typesSelected = [];
  public selectedOpenedTab = 'open';
  public selectedUser: any;
  tableData: any[] = [
    {
      title: 'Payroll',
      field: 'payroll',
      data: [],
      extended: false,
      hideLength: false,
      gridColumns: [],
      extendedGridColumns: [],
    },
    {
      title: 'Fuel',
      field: 'fuel',
      data: [],
      extended: false,
      hideLength: false,
      gridColumns: [],
      extendedGridColumns: [],
    },
    {
      title: 'Ledger',
      field: 'ledger',
      data: [],
      extended: false,
      hideLength: false,
      gridColumns: [],
      extendedGridColumns: [],
    },
    {
      title: 'IFTA',
      field: 'ifta',
      data: [],
      extended: false,
      hideLength: false,
      gridColumns: [],
      extendedGridColumns: [],
    },
    {
      title: 'Tax',
      field: 'tax',
      data: [],
      extended: false,
      hideLength: false,
      gridColumns: [],
      extendedGridColumns: [],
    },
  ];

  constructor() {}

  ngOnInit(): void {
    // this.getDrivers();
  }

  public selectFromList(e) {
    console.log(e);
    this.selectedUser = undefined;
    setTimeout(() => {
      this.selectedUser = e;
    }, 500);
  }

  public switchTab(e) {
    console.log(e);
  }

  public getDrivers(): void {}

  ngOnDestroy(): void {}
}
