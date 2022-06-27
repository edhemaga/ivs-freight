import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Self,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ITaInput } from '../ta-input/ta-input.config';
import { TaInputService } from '../ta-input/ta-input.service';

@Component({
  selector: 'app-ta-input-dropdown-label',
  templateUrl: './ta-input-dropdown-label.component.html',
  styleUrls: ['./ta-input-dropdown-label.component.scss'],
})
export class TaInputDropdownLabelComponent
  implements OnInit, OnChanges, ControlValueAccessor
{
  @Input() options: any[] = [];
  @Input() inputConfig: ITaInput;

  @Output() selectedItem: EventEmitter<any> = new EventEmitter<any>();

  public originalOptions: any[] = [];

  constructor(
    @Self() public superControl: NgControl,
    private inputService: TaInputService,
    private changeDetectionRef: ChangeDetectorRef
  ) {
    this.superControl.valueAccessor = this;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.options.length) {
      this.originalOptions = [...this.options];
    } else {
      this.options.push({
        id: 1,
        name: 'Green',
        color: 'green',
        count: 30,
      });
    }
  }

  ngOnInit() {}

  get getSuperControl() {
    return this.superControl.control;
  }

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}

  public identity(index: number, item: any): number {
    return item.id;
  }
}
