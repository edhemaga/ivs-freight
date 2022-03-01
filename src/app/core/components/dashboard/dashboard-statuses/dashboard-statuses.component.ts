import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard-statuses',
  templateUrl: './dashboard-statuses.component.html',
  styleUrls: ['./dashboard-statuses.component.scss']
})
export class DashboardStatusesComponent implements OnInit {
  @Input() leadboardData: any;
  @Input() title: string;
  @Input() reduceSize: string;
  selectedBoard: any = 'all';
  boardList: any = [
    {
      id: 1,
      name: 'All boards',
      board: 'all'
    }
  ];
  selectedPeriod: any = 'all';

  constructor() {
  }

  ngOnInit(): void {
  }

}
