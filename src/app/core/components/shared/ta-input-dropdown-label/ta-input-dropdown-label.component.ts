import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  Self,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { TaInputComponent } from '../ta-input/ta-input.component';
import { ITaInput } from '../ta-input/ta-input.config';
import { TaInputService } from '../ta-input/ta-input.service';

@Component({
  selector: 'app-ta-input-dropdown-label',
  templateUrl: './ta-input-dropdown-label.component.html',
  styleUrls: ['./ta-input-dropdown-label.component.scss'],
})
export class TaInputDropdownLabelComponent
  implements OnChanges, ControlValueAccessor
{
  @ViewChild(TaInputComponent) inputRef: TaInputComponent;
  @Input() options: any[] = [];
  @Input() inputConfig: ITaInput;

  @Output() selectedColorLabel: EventEmitter<any> = new EventEmitter<any>();
  @Output() labelEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(@Self() public superControl: NgControl) {
    this.superControl.valueAccessor = this;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.options = [
      {
        id: 1,
        name: 'No Color',
        color: null,
        count: null,
      },
      {
        id: 2,
        name: 'Green',
        color: '#00FF00',
        count: 20,
      },
    ];
  }

  get getSuperControl() {
    return this.superControl.control;
  }

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}

  public onSelectLabel(event: Event, label: any) {
    event.stopPropagation();
    event.preventDefault();
    this.inputRef.isVisibleCommands = true;
    this.inputRef.focusInput = true;
    this.inputRef.setInputCursorAtTheEnd(this.inputRef.input.nativeElement);
    console.log('LABELL SELEECT');
    this.selectedColorLabel.emit(label);
  }

  public onLabelNameEvent(event: string) {
    this.labelEvent.emit(event);
  }

  public identity(index: number, item: any): number {
    return item.id;
  }

  public onClick() {
    console.log('ON CLICKKK');
  }
}
