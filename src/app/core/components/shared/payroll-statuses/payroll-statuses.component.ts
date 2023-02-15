import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-payroll-statuses',
    templateUrl: './payroll-statuses.component.html',
    styleUrls: ['./payroll-statuses.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule],
})
export class PayrollStatusesComponent implements OnInit {
    @Input() options: any;
    @Input() active: boolean;
    constructor() {}

    ngOnInit(): void {}
}
