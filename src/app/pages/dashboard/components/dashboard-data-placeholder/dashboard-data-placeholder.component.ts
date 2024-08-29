import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-dashboard-data-placeholder',
    templateUrl: './dashboard-data-placeholder.component.html',
    styleUrls: ['./dashboard-data-placeholder.component.scss'],
})
export class DashboardDataPlaceholderComponent implements OnInit {
    @Input() searchPlaceholder?: boolean = false;
    @Input() fullHeight?: boolean;

    constructor() {}

    ngOnInit(): void {}
}
