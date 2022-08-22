import {
  Component,
  EventEmitter,
  Input,
  Output,
  Self,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ITaInput } from '../ta-input/ta-input.config';

@UntilDestroy()
@Component({
  selector: 'app-ta-input-dropdown-label',
  templateUrl: './ta-input-dropdown-label.component.html',
  styleUrls: ['./ta-input-dropdown-label.component.scss'],
})
export class TaInputDropdownLabelComponent implements ControlValueAccessor {
  @ViewChild('t2') t2Ref: NgbPopover;

  @Input() options: any[] = [];
  @Input() selectedLabel: any;
  @Input() colors: any[] = [];
  @Input() selectedLabelColor: any;

  @Input() inputConfig: ITaInput;

  @Output() pickExistLabel: EventEmitter<any> = new EventEmitter<any>();
  @Output() pickColorLabel: EventEmitter<any> = new EventEmitter<any>();

  @Output() saveLabel: EventEmitter<{ data: any; action: string }> =
    new EventEmitter<{ data: string; action: string }>();

  public switchMode: string = 'Label';

  constructor(@Self() public superControl: NgControl) {
    this.superControl.valueAccessor = this;
  }

  get getSuperControl() {
    return this.superControl.control;
  }

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}

  /**
   * SELECT FROM ITEMS DROPDOWN
   */
  public onSelectDropdown(event: any, action: string) {
    console.log('Label select dropdown: ', event, action, this.switchMode);
    if (this.switchMode === 'Color' && action === 'color') {
      this.pickColorLabel.emit(event);
    }

    if (this.switchMode === 'Label' && action === 'label') {
      console.log('USO SAM');
      this.pickExistLabel.emit(event);
    }
  }

  /**
   * Select label mode
   */
  public onSelectLabelMode(event: string) {
    this.switchMode = event;
  }

  /**
   * SAVE LABEL NAME
   */
  public onSaveLabel(event: any) {
    if (event.action === 'edit') {
      this.saveLabel.emit({ data: event.data, action: event.action });
    }

    if (event.action === 'new') {
      this.saveLabel.emit({ data: event.data, action: event.action });
    }
  }

  public identity(index: number, item: any): number {
    return item.id;
  }

  ngOnDestroy() {}
}
