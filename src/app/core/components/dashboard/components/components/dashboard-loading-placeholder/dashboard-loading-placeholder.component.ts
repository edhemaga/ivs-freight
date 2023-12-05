import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-dashboard-loading-placeholder',
    templateUrl: './dashboard-loading-placeholder.component.html',
    styleUrls: ['./dashboard-loading-placeholder.component.scss'],
})
export class DashboardLoadingPlaceholderComponent implements OnInit {
    @Input() performanceDoubleBoxPlaceholder: boolean = false;
    @Input() performanceSingleBoxPlaceholder: boolean = false;

    constructor() {}

    ngOnInit(): void {}
}
