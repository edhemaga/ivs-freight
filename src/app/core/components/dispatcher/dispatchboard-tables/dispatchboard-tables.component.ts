import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dispatchboard-tables',
  templateUrl: './dispatchboard-tables.component.html',
  styleUrls: ['./dispatchboard-tables.component.scss']
})
export class DispatchboardTablesComponent implements OnInit {
  @Input() gridData: any[] = [];
  data: any[] = new Array(500).fill(1);

  constructor() { }

  ngOnInit(): void {
  }
}
