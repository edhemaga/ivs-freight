import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-ta-select',
  templateUrl: './ta-select.component.html',
  styleUrls: ['./ta-select.component.scss'],
})
export class TaSelectComponent implements OnInit {
  @Input() items: any;
  @Input() placeholder: string;
  @Input() clearable = true;
  @Input() hasAvatar = false;
  @Input() width: string;
  @Input() searchable = true;
  @Input() selectValue: any;
  @Output() changeVal = new EventEmitter();
  @Input() label1: string;
  @Input() label2: string;
  tempSelected: any;

  constructor() {
  }

  ngOnInit(): void {
    if (this.selectValue == null) {
      this.selectValue = {
        id: 0,
        name: 'All'
      };
    }
    if (this.width !== undefined) {
      const el = document.getElementsByClassName('ta-select-wrapper') as HTMLCollectionOf<HTMLElement>;
      el[0].style.width = this.width + 'px';
    }

    this.tempSelected = JSON.parse(JSON.stringify(this.selectValue));
  }

  onFocus(e) {
    this.selectValue = {};
  }

  onBlur(e) {
    this.selectValue = this.tempSelected;
  }

  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    const full_name = item.dispatcherFirstName + ' ' + item.dispatcherLastName;
    return full_name.toLocaleLowerCase().indexOf(term) > -1;
  }

  public change(event, elem) {
    this.tempSelected = JSON.parse(JSON.stringify(event));
    this.changeVal.emit(event);
    elem.blur();
  }
}
