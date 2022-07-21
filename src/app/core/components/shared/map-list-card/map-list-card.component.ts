import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-map-list-card',
  templateUrl: './map-list-card.component.html',
  styleUrls: ['./map-list-card.component.scss']
})
export class MapListCardComponent implements OnInit {

  @Input() isSelected: boolean = false;
  @Input() status: any = 1;
  @Input() title: string = '';
  @Input() address: any = {};
  @Input() rating: any = {};
  @Input() item: any = {};
  @Input() index: any = {};
  @Input() type: string = '';
  @Input() sortCategory: any = {};
  @Input() locationFilterOn: boolean = false;
  @Output() clickedMarker: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
    
  }

  selectCard() {
    this.clickedMarker.emit(this.index);
  }

}
