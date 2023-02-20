import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-ta-currency-progress-bar',
    templateUrl: './ta-currency-progress-bar.component.html',
    styleUrls: ['./ta-currency-progress-bar.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class TaCurrencyProgressBarComponent implements OnInit, OnChanges {
    @Input() totalAmount: number;
    @Input() paidSoFarAmount: number;
    @Input() progressBarName: string;
    @Input() template: string;

    public activePercentageOfPaid: number = 0;
    public status = null;
    ngOnChanges() {
        //Need here for broker currency
        this.calculateCurrencyPercentage();
    }
    ngOnInit() {
        // this.calculateCurrencyPercentage();
    }

    public calculateCurrencyPercentage() {
        this.activePercentageOfPaid =
            (this.paidSoFarAmount / this.totalAmount) * 100;

        if (
            this.activePercentageOfPaid > 0 &&
            this.activePercentageOfPaid < 30
        ) {
            this.status = {
                status: 'short',
                minPercentage: 0,
                maxPercentage: 33,
                colorFilled: '#E57373',
                colorEmpty: '#FFEBEE',
            };
        } else if (
            this.activePercentageOfPaid > 30 &&
            this.activePercentageOfPaid < 60
        ) {
            this.status = {
                status: 'medium',
                minPercentage: 33.1,
                maxPercentage: 66,
                colorFilled: '#FFB74D',
                colorEmpty: '#FFECD1',
            };
        } else if (
            this.activePercentageOfPaid > 60 &&
            this.activePercentageOfPaid <= 100
        ) {
            this.status = {
                status: 'long',
                minPercentage: 66.1,
                maxPercentage: 100,
                colorFilled: '#AAAAAA',
                colorEmpty: '#DADADA',
            };
        } else {
            this.status = null;
        }
    }
}
