import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-payroll-statuses',
  templateUrl: './payroll-statuses.component.html',
  styleUrls: ['./payroll-statuses.component.scss'],
})
export class PayrollStatusesComponent implements OnInit {
  @Input() options: any;
  @Input() active: boolean;
  constructor() {}

  ngOnInit(): void {}
}
