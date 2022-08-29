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
  @Input() items: any;
  @Input() selectValue: any;
  @Output() changeVal = new EventEmitter();
  constructor() {}

  ngOnInit(): void { 
    if (this.selectValue == null) {
      this.selectValue = {
        id: 0,
        name: 'All',
      };
    }
  }

  public change(event, elem) {
    this.changeVal.emit(event);
    elem.blur();
  }
}
