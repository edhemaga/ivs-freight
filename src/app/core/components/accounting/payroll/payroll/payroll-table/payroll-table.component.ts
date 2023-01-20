import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-payroll-table',
  templateUrl: './payroll-table.component.html',
  styleUrls: ['./payroll-table.component.scss']
})
export class PayrollTableComponent implements OnInit {
  @Input() tableSettings: any[];
  @Input() tableData: any[];
  constructor() { }

  ngOnInit(): void {
  }

}
