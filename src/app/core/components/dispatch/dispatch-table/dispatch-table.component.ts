import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dispatch-table',
  templateUrl: './dispatch-table.component.html',
  styleUrls: ['./dispatch-table.component.scss']
})
export class DispatchTableComponent implements OnInit {

  data: any[] = [
    {
      add_new_truck: true,
      add_new_driver: true
    },
    {
      add_new_trailer: true
    },
    {
      add_new_truck: true,
      add_new_trailer: true
    },
    {
      add_new_truck: true
    },
    {
      add_new_trailer: true,
      add_new_driver: true
    },
    {
      add_new_truck: true
    },
    {
      add_new_trailer: true,
      add_new_driver: true
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
