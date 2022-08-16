import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard-state-usa',
  templateUrl: './dashboard-state-usa.component.html',
  styleUrls: ['./dashboard-state-usa.component.scss']
})
export class DashboardStateUsaComponent implements OnInit {
  @Input() statesColor: any;
  hoveredItem: any;
  hoveredContry: string = "";
  hoveredContryLetter: string = "";

  constructor() {
  }

  ngOnInit(): void {
  }

  setPopoverData(country: string, countryLetters?: string): void {
    this.hoveredItem = this.statesColor[country];
    this.hoveredContry = `#${country}`;
    this.hoveredContryLetter = `#${countryLetters}`;
  }

}
