import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-dashboard-state-usa',
    templateUrl: './dashboard-state-usa.component.html',
    styleUrls: ['./dashboard-state-usa.component.scss'],
})
export class DashboardStateUsaComponent implements OnInit {
    @Input() statesColor: any;
    hoveredItem: any;
    hoveredContry: string = '';
    hoveredContryLetter: string = '';
    currentCountry: string = '';

    constructor(private ref: ChangeDetectorRef) {}

    ngOnInit(): void {}

    setPopoverData(country: string, countryLetters?: string): void {
        this.currentCountry = country;
        this.hoveredItem = this.statesColor[country];
        this.hoveredContry = `#${country}`;
        this.hoveredContryLetter = `#${countryLetters}`;
        this.ref.detectChanges();
    }

    removePopoverData() {
        this.hoveredItem = null;
        this.ref.detectChanges();
    }
}
