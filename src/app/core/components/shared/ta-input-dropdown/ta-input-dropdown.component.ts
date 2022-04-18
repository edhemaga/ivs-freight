import { debounceTime } from 'rxjs';
import { ControlValueAccessor, NgControl } from '@angular/forms';

import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  Self,
  ViewEncapsulation,
} from '@angular/core';
import { input_dropdown_animation } from './ta-input-dropdown.animation';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { TaInputService } from '../ta-input/ta-input.service';
import { v4 as uuidv4 } from 'uuid';
import { ITaInput } from '../ta-input/ta-input.config';
@Component({
  selector: 'app-ta-input-dropdown',
  templateUrl: './ta-input-dropdown.component.html',
  styleUrls: ['./ta-input-dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [input_dropdown_animation('showHideDropdownOptions')],
})
export class TaInputDropdownComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @Input() template: string;
  @Input() inputConfig: ITaInput;
  @Input() canAddNew: boolean = false;
  @Input() options: any[] = [];

  public activeItem: any;
  public originalOptions: any[] = [];
  public isDropdownOptionsVisible: boolean = true;

  constructor(
    @Self() public superControl: NgControl,
    private inputService: TaInputService
  ) {
    this.superControl.valueAccessor = this;
  }

  ngOnInit(): void {
    this.originalOptions = this.options;

    this.getSuperControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((term) => this.search(term));

    this.inputService.onClearInputSubject
      .pipe(debounceTime(50), untilDestroyed(this))
      .subscribe((action: boolean) => {
        this.onClearSearch();
      });

    this.inputService.dropDownShowHideSubject
      .pipe(untilDestroyed(this))
      .subscribe((action: boolean) => {
        this.toggleDropdownOptions(action);
        console.log("DROPDOWN")
        console.log(action)
        if (!action) {
          const index = this.originalOptions.findIndex(
            (item) => item.name === this.getSuperControl.value
          );
          if (index === -1) {
            this.onClearSearch();
          }
        }
        else {
          this.inputConfig = {
            ...this.inputConfig,
            placeholder: this.getSuperControl.value
          }
          this.getSuperControl.setValue(null);
          console.log(this.activeItem)
          console.log(this.inputConfig)
        }
      });

    if (this.canAddNew) {
      this.inputService.addDropdownItemSubject
        .pipe(untilDestroyed(this))
        .subscribe((action: boolean) => {
          if (action) {
            this.addNewItem();
          }
        });
    }
  }

  get getSuperControl() {
    return this.superControl.control;
  }

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}

  private search(term: string): void {
    if (term?.length > 0) {
      this.options = this.originalOptions.filter((item) =>
        item.name.toLowerCase().includes(term.toLowerCase())
      );

      if (!this.options.length && !this.canAddNew) {
        this.options.push({
          id: 7654,
          name: 'No Results',
        });
      }

      if (!this.options.length && this.canAddNew) {
        this.options.push({
          id: 7655,
          name: 'Add New',
        });
      }
    } else {
      this.options = this.originalOptions;
    }
  }

  public onActiveItem(option: any): void {
    if (option.id === 7654) {
      // No Result
      return;
    } else if (option.id === 7655) {
      // Add New
      this.inputService.dropdownAddModeSubject.next(true);
      this.isDropdownOptionsVisible = false;
      return;
    } else {
      this.activeItem = option;
      this.getSuperControl.setValue(option.name);
      this.options = this.originalOptions;
    }
  }

  public toggleDropdownOptions(action: boolean): void {
    this.isDropdownOptionsVisible = action;
  }

  public onClearSearch(): void {
    this.options = this.originalOptions;
    this.activeItem = null;
    this.getSuperControl.setValue(null);
    this.inputConfig = {
      ...this.inputConfig,
      placeholder: '',
    };
  }

  public addNewItem(): void {
    const newItem = {
      id: uuidv4(),
      name: this.getSuperControl.value,
    };
    this.originalOptions = [...this.originalOptions, newItem];
    this.options = this.originalOptions;
    this.activeItem = newItem;
  }

  public identity(index: number, item: any): number {
    return item.id;
  }

  // Must be here, because of "untilDestroyed"
  ngOnDestroy(): void {}
}
