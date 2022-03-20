import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-truckassist-search',
  templateUrl: './truckassist-search.component.html',
  styleUrls: ['./truckassist-search.component.scss'],
})
export class TruckassistSearchComponent implements OnInit {
  openSearch: boolean;
  searchText: string = '';

  constructor() {}

  ngOnInit(): void {}

  onTyping(){}
}
