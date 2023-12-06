import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-dashboard-loading-placeholder',
    templateUrl: './dashboard-loading-placeholder.component.html',
    styleUrls: ['./dashboard-loading-placeholder.component.scss'],
})
export class DashboardLoadingPlaceholderComponent implements OnInit {
    @Input() performanceDoubleBoxPlaceholder: boolean = false;
    @Input() performanceSingleBoxPlaceholder: boolean = false;
    @Input() performanceChartsPlaceholder: boolean = false;
    @Input() listPlaceholder: boolean = false;

    public numberOfIterations: number[] = [];

    constructor() {}

    ngOnInit(): void {
        this.createNNumberOfIterations();
    }

    private createNNumberOfIterations(): void {
        const iterations = 6;

        this.numberOfIterations = Array(iterations)
            .fill(0)
            .map((_, i) => i);
    }
}
