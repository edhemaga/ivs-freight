import { Component, EventEmitter, Input, Output } from '@angular/core';

interface RadioButton {
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
export class TaInputRadiobuttonsComponent {
  @Input() buttons: RadioButton[] = null;
  @Output() changedValue: EventEmitter<RadioButton> =
    new EventEmitter<RadioButton>(null);

  public onChange(button: RadioButton): void {
    const active = this.buttons.findIndex(
      (item) => item.value === button.value
    );

    if (active !== -1) {
      this.buttons.filter((item) => (item.isActive = false));
      this.buttons[active].isActive = true;
    }
    this.changedValue.emit(button);
  }

  public identity(index: number, item: any): string {
    return item.value;
  }
}
