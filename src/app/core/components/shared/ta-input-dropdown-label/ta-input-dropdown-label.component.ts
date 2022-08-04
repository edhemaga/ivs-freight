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
import { ControlValueAccessor, NgControl, FormControl } from '@angular/forms';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { untilDestroyed } from 'ngx-take-until-destroy';
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
  @ViewChild('t2') t2Ref: NgbPopover;
  @ViewChild(TaInputComponent) inputRef: TaInputComponent;

  @Input() options: any[] = [];
  @Input() colors: any[] = [];
  @Input() inputConfig: ITaInput;
  @Input() selectedLabel: any = null;

  @Output() selectedColorLabel: EventEmitter<any> = new EventEmitter<any>();
  @Output() saveLabel: EventEmitter<{ action: string; label: string }> =
    new EventEmitter<{ action: string; label: string }>();
  @Output() pickExistLabel: EventEmitter<any> = new EventEmitter<any>();

  public newLabel: FormControl = new FormControl(null);
  public dropdownConfig: ITaInput = null;

  constructor(
    @Self() public superControl: NgControl,
    private inputService: TaInputService
  ) {
    this.superControl.valueAccessor = this;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedLabel?.currentValue) {
      this.dropdownConfig = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Label',
        placeholder: 'Label Name',
        placeholderIcon: 'ic_dynamic_label',
        dropdownWidthClass: 'w-col-12',
        isDropdown: true,
        dropdownLabelSelected: changes.selectedLabel.currentValue,
      };
    }
  }

  ngOnInit() {
    // Dropdown Labels
    this.getSuperControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (!value) {
          this.inputConfig = {
            ...this.inputConfig,
            placeholder: 'Label Name',
          };
        } else {
          this.inputConfig = {
            ...this.inputConfig,
            placeholder: null,
          };
        }
      });

    this.dropdownConfig = {
      name: 'Input Dropdown',
      type: 'text',
      label: 'Label',
      placeholder: 'Label Name',
      placeholderIcon: 'ic_dynamic_label',
      dropdownWidthClass: 'w-col-12',
      isDropdown: true,
    };
  }

  get getSuperControl() {
    return this.superControl.control;
  }

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}

  /**
   *
   * SELECT FROM ITEMS DROPDOWN
   */
  public onSelectDropdown(event: any, action: string) {
    this.selectedLabel = event;

    if (this.selectedLabel?.name !== 'Add New') {
      this.pickExistLabel.emit(this.selectedLabel);
    } else {
      const timeout = setTimeout(() => {
        this.inputRef.setInputCursorAtTheEnd(
          this.inputRef.input.nativeElement,
          100
        );
        this.t2Ref.open();
        clearTimeout(timeout);
      }, 100);
    }
  }

  /**
   *
   * SELECT FROM COLOR DROPDOWN
   */
  public onSelectColorLabel(event: Event, color: any) {
    event.preventDefault();
    event.stopPropagation();
    const timeout = setTimeout(() => {
      this.inputRef.focusInput = true;
      this.inputRef.setInputCursorAtTheEnd(
        this.inputRef.input.nativeElement,
        100
      );
      clearTimeout(timeout);
    }, 50);
    this.dropdownConfig = {
      ...this.dropdownConfig,
      dropdownLabelSelected: color,
    };

    this.selectedColorLabel.emit(color);
  }

  /**
   *
   * SAVE LABEL NAME
   */
  public onLabelNameEvent(event: string) {
    if (event === 'cancel') {
      this.saveLabel.emit({
        action: event,
        label: this.getSuperControl.value,
      });
      this.newLabel.patchValue(null);
      return;
    }

    this.saveLabel.emit({ action: event, label: this.newLabel.value });
    this.getSuperControl.patchValue(this.newLabel.value);
    this.newLabel.patchValue(null);
  }

  public identity(index: number, item: any): number {
    return item.id;
  }

  ngOnDestroy() {}
}
