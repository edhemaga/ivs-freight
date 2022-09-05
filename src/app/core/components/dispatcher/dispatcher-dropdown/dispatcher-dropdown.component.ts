import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-dispatcher-dropdown',
  templateUrl: './dispatcher-dropdown.component.html',
  styleUrls: ['./dispatcher-dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DispatcherDropdownComponent implements OnInit {

  __items: any[];

  selectValue: any = {};
  @Input() set items(value: any[]) {
    this.__items = value;
    this.selectValue = value.find(item => item.selected);
  };

  @Output() changeVal = new EventEmitter();
  constructor() {}

  ngOnInit(): void { 
    // if (this.selectValue == null) {
    //   this.selectValue = {
    //     id: 0,
    //     name: 'All',
    //   };
    // }

    //this.selectValue
  }

  public change(event, elem) {
    this.changeVal.emit(event);
    elem.blur();
  }
}
