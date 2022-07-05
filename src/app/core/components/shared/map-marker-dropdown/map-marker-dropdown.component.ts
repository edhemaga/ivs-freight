import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { input_dropdown_animation } from '../ta-input-dropdown/ta-input-dropdown.animation';

@Component({
  selector: 'app-map-marker-dropdown',
  templateUrl: './map-marker-dropdown.component.html',
  styleUrls: ['./map-marker-dropdown.component.scss'],
  animations: [input_dropdown_animation('showHideDrop')]
})
export class MapMarkerDropdownComponent implements OnInit {
  
  @Input() title: string = '';
  @Input() item: any = {};
  @Input() type: string = '';

  constructor(
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  expandInfo() {
    this.item.isExpanded = !this.item.isExpanded;
    this.ref.detectChanges();
  }

}
