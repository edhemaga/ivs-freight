import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard-state-usa',
  templateUrl: './dashboard-state-usa.component.html',
  styleUrls: ['./dashboard-state-usa.component.scss']
})
export class DashboardStateUsaComponent implements OnInit {
  @Input() statesColor: any;
  hoveredItem: any;

  constructor() {
  }

  ngOnInit(): void {
  }

  setPopoverData(country: string): void {
    this.hoveredItem = this.statesColor[country];
  }

}
