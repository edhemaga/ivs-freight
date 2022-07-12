import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-map-list',
  templateUrl: './map-list.component.html',
  styleUrls: ['./map-list.component.scss']
})
export class MapListComponent implements OnInit {

  @Input() sortTypes: any[] = [];
  @Input() columns: any;
  @Output() changeSortCategory: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeSortDirection: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchData: EventEmitter<any> = new EventEmitter<any>();
  public mapListExpanded: boolean = true;
  public searchForm!: FormGroup;
  public sortDirection: string = 'asc';
  public activeSortType: any = {};
  visibleColumns: any[] = [];
  pinedColumns: any[] = [];
  notPinedColumns: any[] = [];
  actionColumns: any[] = [];
  private tooltip: any;

  constructor(
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    console.log('map list ngOnInit');

    console.log('sortTypes', this.sortTypes);
    console.log('columns', this.columns);

    this.activeSortType = this.sortTypes[0];

    this.searchForm = this.formBuilder.group({
      search: ''
    });

    this.searchForm.valueChanges.subscribe((changes) => {
      console.log('valueChanges', changes);
      this.searchData.emit(changes.search);
    });

    this.setVisibleColumns();
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

  changeSortingDirection() {
    this.sortDirection = this.sortDirection == 'asc' ? 'desc' : 'asc';

    this.changeSortDirection.emit(this.sortDirection);
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

  setVisibleColumns() {
    this.visibleColumns = [];
    this.pinedColumns = [];
    this.notPinedColumns = [];
    this.actionColumns = [];

    this.columns.map((column, index) => {
      if (!column.hasOwnProperty('isPined')) {
        column.isPined = false;
      }

      if (index === 0 || index === 1) {
        column.isPined = true;
      }

      if (!column.hidden) {
        this.visibleColumns.push(column);
      }
    });

    this.visibleColumns.map((v) => {
      /* Pined Columns */
      if (v.isPined) {
        this.pinedColumns.push(v);
      }

      /* Not Pined Columns */
      if (!v.isPined && !v.isAction) {
        this.notPinedColumns.push(v);
      }

      /* Action  Columns */
      if (v.isAction) {
        this.actionColumns.push(v);
      }
    });
    
    console.log('visibleColumns', this.visibleColumns);
    console.log('pinedColumns', this.pinedColumns);
    console.log('notPinedColumns', this.notPinedColumns);
    console.log('actionColumns', this.actionColumns);

    this.ref.detectChanges();
  }
}
