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
  @Input() sortCategory: any = {};
  @Input() locationFilterOn: boolean = false;
  @Input() dropdownActions: any[] = [];
  @Output() bodyActions: EventEmitter<any> = new EventEmitter();

  public copiedPhone: boolean = false;
  public copiedEmail: boolean = false;
  public copiedAddress: boolean = false;
  public showAllDays: boolean = false;
  
  constructor(
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  expandInfo() {
    this.item.isExpanded = !this.item.isExpanded;
    this.ref.detectChanges();
  }

  public copyText(val: any, copVal: string) {
    switch (copVal) {
      case 'phone':
        this.copiedPhone = true;
        setTimeout(() => {
          this.copiedPhone = false;
        }, 2100);
        break;
        
      case 'email':
        this.copiedEmail = true;
        setTimeout(() => {
          this.copiedEmail = false;
        }, 2100);
        break;
        
        case 'address':
          this.copiedAddress = true;
          setTimeout(() => {
            this.copiedAddress = false;
          }, 2100);
          break;
    }

    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    // selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  toggleWorkingHours() {
    this.showAllDays = !this.showAllDays;
  }

  showMoreOptions(event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  callBodyAction(action) {
    this.bodyActions.emit(action);
  }
}
