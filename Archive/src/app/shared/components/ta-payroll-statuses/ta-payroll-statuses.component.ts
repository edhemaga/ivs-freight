import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-ta-payroll-statuses',
    templateUrl: './ta-payroll-statuses.component.html',
    styleUrls: ['./ta-payroll-statuses.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule],
})
export class TaPayrollStatusesComponent implements OnInit {
    @Input() options: any;
    @Input() active: boolean;
    constructor() {}

    ngOnInit(): void {}
}
