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
    console.log('item', this.item);
    console.log('index', this.index);
    console.log('type', this.type);
    console.log('title', this.title);
    console.log('isSelected', this.isSelected);
    console.log('status', this.status);
    console.log('address', this.address);
    console.log('rating', this.rating);
    console.log('sortCategory', this.sortCategory);
  }

  selectCard() {
    console.log('selectCard');
    this.clickedMarker.emit(this.index);
  }

}
