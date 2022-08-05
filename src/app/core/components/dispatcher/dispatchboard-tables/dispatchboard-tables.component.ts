import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dispatchboard-tables',
  templateUrl: './dispatchboard-tables.component.html',
  styleUrls: ['./dispatchboard-tables.component.scss']
})
export class DispatchboardTablesComponent implements OnInit {
  data: any[] = new Array(500).fill(1);
  @ViewChild('appNote', {static: false}) public appNote: any;

  constructor() { }

  ngOnInit(): void {
  }
}
