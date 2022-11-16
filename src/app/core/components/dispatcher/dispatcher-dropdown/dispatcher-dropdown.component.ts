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

  selectValue: any = {id: -1};
  @Input() set items(value: any[]) {
    this.__items = JSON.parse(JSON.stringify(value));
    const savedDispatcher = parseInt(
      localStorage.getItem('dispatchUserSelect')
    );
    this.selectValue = value.find((item) => {
      if (isNaN(savedDispatcher)) {
        return item.selected;
      } else {
        return item.id == savedDispatcher;
      }
    });
  }

  @Output() changeVal = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  public change(event, elem) {
    console.log(event);
    this.changeVal.emit(event.id);
    elem.blur();
  }
}
