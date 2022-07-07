import {
  Component,
  EventEmitter,
  Input,
  Output,
  Self,
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
export class TaInputDropdownLabelComponent implements ControlValueAccessor {
  @ViewChild('t2') t2Ref: NgbPopover;
  @ViewChild(TaInputComponent) inputRef: TaInputComponent;

  @Input() options: any[] = [];
  @Input() colors: any[] = [];
  @Input() inputConfig: ITaInput;
  @Input() selectedAccountLabel: any = null;

  @Output() selectedColorLabel: EventEmitter<any> = new EventEmitter<any>();
  @Output() labelEvent: EventEmitter<{ action: string; label: string }> =
    new EventEmitter<{ action: string; label: string }>();

  public newLabel: FormControl = new FormControl(null);
  public dropdownConfig: ITaInput = null;

  constructor(
    @Self() public superControl: NgControl,
    private inputService: TaInputService
  ) {
    this.superControl.valueAccessor = this;
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
      specificDropdownLabel: true,
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
    switch (action) {
      case 'account-label': {
        this.selectedAccountLabel = event;

        const timeout = setTimeout(() => {
          this.inputRef.setInputCursorAtTheEnd(
            this.inputRef.input.nativeElement,
            100
          );
          this.t2Ref.open();
          clearTimeout(timeout);
        }, 100);

        break;
      }
      default: {
        break;
      }
    }
  }

  /**
   *
   * SELECT FROM COLOR DROPDOWN
   */
  public onSelectColorLabel(event: Event, label: any) {
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
      dropdownLabelSelected: label,
    };

    this.selectedColorLabel.emit(label);
  }

  /**
   *
   * SAVE LABEL NAME
   */
  public onLabelNameEvent(event: string) {
    if (event === 'cancel') {
      this.labelEvent.emit({
        action: event,
        label: this.getSuperControl.value,
      });
      this.newLabel.patchValue(null);
      return;
    }
    this.labelEvent.emit({ action: event, label: this.newLabel.value });
    this.getSuperControl.patchValue(this.newLabel.value);
    this.newLabel.patchValue(null);
  }

  public identity(index: number, item: any): number {
    return item.id;
  }

  ngOnDestroy() {}
}
