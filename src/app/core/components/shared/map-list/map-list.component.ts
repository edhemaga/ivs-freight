import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-map-list',
  templateUrl: './map-list.component.html',
  styleUrls: ['./map-list.component.scss']
})
export class MapListComponent implements OnInit {

  @Input() sortTypes: any[] = [];
  @Output() changeSortCategory: EventEmitter<any> = new EventEmitter<any>();
  public mapListExpanded: boolean = true;
  public searchForm!: FormGroup;
  public sortDirection: string = 'asc';
  public activeSortType: any = {};
  private tooltip: any;

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    console.log('map list ngOnInit');

    console.log('sortTypes', this.sortTypes);

    this.activeSortType = this.sortTypes[0];

    this.searchForm = this.formBuilder.group({
      search: ''
    });
  }

  resizeMapList() {
    this.mapListExpanded = !this.mapListExpanded;
  }

  openPopover(t2) {
    t2.open();
    this.tooltip = t2;
  }

  showMoreOptions(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  changeSortDirection() {
    this.sortDirection = this.sortDirection == 'asc' ? 'desc' : 'asc';
  }
  
  changeSortType(item) {
    this.sortTypes.map((data: any, index) => {
      if (data.isActive) {
        data.isActive = false;
      }
    });
    
    item.isActive = true;
    this.activeSortType = item;
    this.tooltip.close();

    console.log('changeSortType item', item);

    this.changeSortCategory.emit(item);
  }

}
