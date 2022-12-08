import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-load-modal-progress-bar',
    templateUrl: './load-modal-progress-bar.component.html',
    styleUrls: ['./load-modal-progress-bar.component.scss'],
})
export class LoadModalProgressBarComponent implements OnChanges {
    @Input() totalAmount: number;
    @Input() availableCredit: number;
    @Input() inputFocus: boolean;
    @Input() disable: boolean;

    public status = null;
    public activePercentageOfPaid: number = 0;

    ngOnChanges(changes: SimpleChanges) {
        if (
            changes.availableCredit.previousValue !==
            changes.availableCredit.currentValue
        )
            this.calculateCurrencyPercentage();
    }

    private calculateCurrencyPercentage() {
        if (this.availableCredit === 0) {
            this.activePercentageOfPaid = 100;
            this.status = {
                status: this.disable ? 'disable' : 'low',
                colorFilled: this.disable ? '#919191' : '#E57373',
            };
            return;
        } else {
            this.activePercentageOfPaid =
                (this.availableCredit / this.totalAmount) * 100;
        }

        if (
            this.activePercentageOfPaid >= 0 &&
            this.activePercentageOfPaid < 30
        ) {
            this.status = {
                status: this.disable ? 'disable' : 'low',
                colorFilled: this.disable ? '#919191' : '#E57373',
            };
        } else if (
            this.activePercentageOfPaid > 30 &&
            this.activePercentageOfPaid < 60
        ) {
            this.status = {
                status: this.disable ? 'disable' : 'medium',
                colorFilled: this.disable ? '#919191' : '#FFB74D',
            };
        } else if (
            this.activePercentageOfPaid > 60 &&
            this.activePercentageOfPaid <= 100
        ) {
            this.status = {
                status: this.disable ? 'disable' : 'high',
                colorFilled: this.disable ? '#919191' : '#4DB6A2',
            };
        } else {
            this.status = null;
        }
    }
}
