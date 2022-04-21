import { debounceTime, distinctUntilChanged, shareReplay } from 'rxjs';
import { ControlValueAccessor, NgControl } from '@angular/forms';

import {
  ChangeDetectorRef,
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
  providers: [TaInputService],
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
  public isDropdownOptionsVisible: boolean = false;

  constructor(
    @Self() public superControl: NgControl,
    private inputService: TaInputService,
    private changeDetection: ChangeDetectorRef
  ) {
    this.superControl.valueAccessor = this;
  }

  ngOnInit(): void {
    this.originalOptions = this.options;

    this.getSuperControl.valueChanges
      .pipe(distinctUntilChanged(),untilDestroyed(this))
      .subscribe((term) => {
        if(!this.activeItem) {
          this.search(term)
          console.log("VALUE CHANGES ", term);
          console.log("INPUT CONFIG ", this.inputConfig);
          console.log("CONTROL: ", this.getSuperControl.value)
        }
      });

    this.inputService.onClearInputSubject
      .pipe(debounceTime(50), distinctUntilChanged(), untilDestroyed(this))
      .subscribe((action: boolean) => {
        this.onClearSearch();
        console.log("CLEARING DROPDOWN")
      });

    this.inputService.dropDownShowHideSubject
      .pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((action: boolean) => {
        this.toggleDropdownOptions(action);
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
        }

        console.log("SHOWHIDE DROPDOWN ", action);
        console.log("INPUT CONFIG ", this.inputConfig);
        console.log("CONTROL: ", this.getSuperControl.value)
      });


    if (this.canAddNew) {
      this.inputService.addDropdownItemSubject
        .pipe(distinctUntilChanged(), untilDestroyed(this))
        .subscribe((action: boolean) => {
          if (action) {
            this.addNewItem();
          }
        console.log("ADDNEW DROPDOWN ", action);
        });
    }

    
  }

  public onDropDownShowHideSubject(action: boolean) {
    this.toggleDropdownOptions(action);
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
    }
  }

  public onClearInputSubject(action: boolean) {
    this.onClearSearch();
  }

  public addDropdownItemSubject(action: boolean) {
    if (action) {
      this.addNewItem();
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
    console.log("CLEAR")
    console.log(this.options)
    console.log(this.activeItem)
    console.log(this.getSuperControl)
    console.log(this.inputConfig)
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
