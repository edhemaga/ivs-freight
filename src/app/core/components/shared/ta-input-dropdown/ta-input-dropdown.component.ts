import { debounceTime } from 'rxjs';
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
  encapsulation: ViewEncapsulation.None,
  animations: [input_dropdown_animation('showHideDropdownOptions')],
})
export class TaInputDropdownComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @Input() inputConfig: ITaInput;
  @Input() canAddNew: boolean = false;
  @Input() options: any[] = [];

  public activeItem: any;
  public originalOptions: any[] = [];
  public isDropdownOptionsVisible: boolean = true;

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
      .pipe(untilDestroyed(this))
      .subscribe((term) => this.search(term));

    this.inputService.onClearInputSubject
      .pipe(debounceTime(50), untilDestroyed(this))
      .subscribe((action: boolean) => {
        this.onClearSearch();
      });

    this.inputService.onFocusInputSubject
      .pipe(debounceTime(50), untilDestroyed(this))
      .subscribe((action: boolean) => {
        if (action && this.activeItem) {
          this.inputConfig = {
            ...this.inputConfig,
            placeholder: this.activeItem.name,
          };
          this.getSuperControl.setValue(null);
        }
      });

    this.inputService.dropDownShowHideSubject
      .pipe(untilDestroyed(this))
      .subscribe((action: boolean) => {
        console.log('HIDE SHOW DROP DOWN');
        console.log(action);
        this.toggleDropdownOptions(action);
      });

    this.inputService.addItemDropdownSubject
      .pipe(untilDestroyed(this))
      .subscribe((action: boolean) => {
        if (action) {
          this.addNewItem();
        }
      });
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
      this.options = [];
    } else if (option.id === 7655) {
      // Add New
      this.inputService.activateDropdownAddNewSubject.next(true);
      this.options = [];
      this.toggleDropdownOptions(false);
    } else {
     
      const timeout = setTimeout(() => {
        this.activeItem = option;
        this.getSuperControl.setValue(option.name);
        clearTimeout(timeout);
      },200)
     
      this.options = this.originalOptions;
    }
  }

  public toggleDropdownOptions(action: boolean): void {
    this.isDropdownOptionsVisible = action;
  }

  public onClearSearch(): void {
    this.options = this.originalOptions;
    this.activeItem = null;
    this.inputConfig = {
      ...this.inputConfig,
      placeholder: '',
    };
  }

  public addNewItem(): void {
    this.originalOptions.push({
      id: uuidv4(),
      name: this.getSuperControl.value,
    });
    this.options = this.originalOptions;
    this.activeItem = this.originalOptions[this.originalOptions.length - 1];
    this.inputService.activateDropdownAddNewSubject.next(false);
  }

  public identity(index: number, item: any): number {
    return item.id;
  }

  // Must be here, because of "untilDestroyed"
  ngOnDestroy(): void {}
}
