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
  @Input() dropdownActions: any[] = [];
  @Output() clickedMarker: EventEmitter<string> = new EventEmitter<string>();
  @Output() bodyActions: EventEmitter<any> = new EventEmitter();
  public locationFilterOn: boolean = false;

  constructor() { }

  ngOnInit(): void {
    if ( !this.sortCategory?.name ) {
      this.sortCategory = {name: 'Business Name', id: 1, sortName: 'name'};
    }
  }

  selectCard() {
    this.clickedMarker.emit(this.index);
  }

  showMoreOptions(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  callBodyAction(action) {
    this.bodyActions.emit(action);
  }

}
