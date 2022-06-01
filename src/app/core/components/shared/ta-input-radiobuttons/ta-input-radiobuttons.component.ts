import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

interface RadioButton {
  id: string;
  label: string;
  value: string;
  name: string; // must be same for all radio buttons
  checked: boolean;
  isActive?: boolean; // this field change in this component
}

@Component({
  selector: 'app-ta-input-radiobuttons',
  templateUrl: './ta-input-radiobuttons.component.html',
  styleUrls: ['./ta-input-radiobuttons.component.scss'],
})
export class TaInputRadiobuttonsComponent implements OnInit {
  @Input() buttons: RadioButton[] = null;
  @Output() changedValue: EventEmitter<RadioButton[]> = new EventEmitter< RadioButton[]>(null);
  checked:boolean;
  public onChange(button: RadioButton): void {
    this.buttons.filter((item) => (item.checked = false));
    button.checked = true;
    this.changedValue.emit(this.buttons);
  }
  ngOnInit(){
    let count = 0;
    for (const d of this.buttons) {
      if (!d.checked) {
        count++;
      }
    }
    this.checked = count === this.buttons.length;
  }

  public identity(index: number, item: any): string {
    return item.value;
  }
}
