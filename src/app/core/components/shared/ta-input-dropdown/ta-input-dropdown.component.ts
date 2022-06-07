import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ControlValueAccessor, NgControl } from '@angular/forms';

import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Self,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { input_dropdown_animation } from './ta-input-dropdown.animation';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { TaInputService } from '../ta-input/ta-input.service';
import { v4 as uuidv4 } from 'uuid';
import { ITaInput } from '../ta-input/ta-input.config';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { TaInputComponent } from '../ta-input/ta-input.component';

@Component({
  selector: 'app-ta-input-dropdown',
  templateUrl: './ta-input-dropdown.component.html',
  styleUrls: ['./ta-input-dropdown.component.scss'],
  providers: [TaInputService],
  animations: [input_dropdown_animation('showHideDropdownOptions')],
})
export class TaInputDropdownComponent
  implements OnInit, OnDestroy, OnChanges, ControlValueAccessor
{
  @ViewChild(TaInputComponent) inputRef: TaInputComponent;
  @ViewChild('t2') public popoverRef: NgbPopover;
  @Input() template: string;
  @Input() inputConfig: ITaInput;
  @Input() canAddNew: boolean = false;
  @Input() options: any[] = []; // when send SVG, please premmaped object: add 'folder' | 'subfolder'
  @Output() selectedItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectedItems: EventEmitter<any> = new EventEmitter<any>();

  public activeItem: any;
  public originalOptions: any[] = [];
  private dropdownPosition: number = 0;

  // Multiselect dropdown options
  public multiselectItems: any[] = [];
  public isMultiSelectInputFocus: boolean = false;
  public multiSelectLabel: string = null;

  constructor(
    @Self() public superControl: NgControl,
    private inputService: TaInputService,
    private changeDetectionRef: ChangeDetectorRef
  ) {
    this.superControl.valueAccessor = this;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.options) {
      this.originalOptions = [...this.options];
    }
  }

  ngOnInit(): void {
    if (this.inputConfig.multiselectDropdown) {
      this.multiSelectLabel = this.inputConfig.label;
    }

    if (this.options) {
      this.originalOptions = [...this.options];
    }

    this.getSuperControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((term) => {
        this.search(term);
      });

    this.inputService.onClearInputSubject
      .pipe(debounceTime(50), untilDestroyed(this))
      .subscribe((action: boolean) => {
        if (action) {
          this.popoverRef.close();
          this.onClearSearch();
        }
      });

    this.dropDownShowHideEvent();
    this.dropDownKeyboardNavigationEvent();
    this.addNewItemInDropDownEvent();
  }

  get getSuperControl() {
    return this.superControl.control;
  }

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}

  private addNewItemInDropDownEvent() {
    if (this.canAddNew) {
      this.inputService.addDropdownItemSubject
        .pipe(distinctUntilChanged(), untilDestroyed(this))
        .subscribe((action: boolean) => {
          if (action) {
            this.addNewItem();
          }
        });
    }
  }

  private dropDownShowHideEvent() {
    this.inputService.dropDownShowHideSubject
      .pipe(untilDestroyed(this))
      .subscribe((action: boolean) => {

        this.isMultiSelectInputFocus = action;

        if (!action) {
          this.popoverRef.open();
          if (this.activeItem) {
            this.getSuperControl.setValue(this.activeItem.name);
            this.changeDetectionRef.detectChanges();
          } else {
            const index = this.originalOptions.findIndex(
              (item) => item.name === this.getSuperControl.value
            );
            if (index === -1) {
              this.onClearSearch();
            }
          }
          this.popoverRef.close();
        } else {
          this.inputConfig = {
            ...this.inputConfig,
            placeholder: this.getSuperControl.value
              ? this.getSuperControl.value
              : this.activeItem?.name,
          };

          this.getSuperControl.setValue(null);
          this.popoverRef.close();
        }
      });
  }

  private dropDownKeyboardNavigationEvent() {
    this.inputService.dropDownNavigatorSubject
      .pipe(untilDestroyed(this))
      .subscribe((keyEvent) => {
        if (keyEvent === 40) {
          this.dropdownNavigation(1);
        }

        if (keyEvent === 38) {
          this.dropdownNavigation(-1);
        }

        if (keyEvent === 13) {
          const selectedItem = $('.dropdown-option-hovered > div').text();
          const existItem = this.options.find(
            (item) => item.name.toLowerCase() === selectedItem.toLowerCase()
          );
          this.activeItem = existItem;
          this.getSuperControl.setValue(existItem.name);
          this.selectedItem.emit(existItem);
          this.popoverRef.close();
          this.inputService.isDropDownItemSelectedOnEnter.next(true);
        }

        if (keyEvent === 9) {
          this.popoverRef.open();
        }
      });
  }

  private search(term: string): void {
    // Single Dropdown
    if (this.template !== 'groups') {
      if (
        term?.length &&
        this.activeItem?.name !== this.getSuperControl.value
      ) {
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
    // Group Dropdown Items
    else {
      if (
        term?.length &&
        this.activeItem?.name !== this.getSuperControl.value
      ) {
        this.options = this.originalOptions
          .map((element) => {
            return {
              ...element,
              groups: element.groups.filter((subElement) =>
                subElement.name.toLowerCase().includes(term.toLowerCase())
              ),
            };
          })
          .filter((item) => item.groups.length);

        if (!this.options.length && !this.canAddNew) {
          this.options.push({
            groups: [
              {
                id: 7654,
                name: 'No Results',
              },
            ],
          });
        }
      } else {
        this.options = this.originalOptions;
      }
    }
  }

  public onActiveItem(option: any): void {
    if (option.id === 7654) {
      // No Result
      return;
    } else if (option.id === 7655) {
      // Add New
      this.inputService.dropdownAddModeSubject.next(true);
      return;
    } else {
      this.activeItem = option;
      this.getSuperControl.setValue(option.name);
      this.options = this.originalOptions;
      this.selectedItem.emit(option);
    }
  }

  public onClearSearch(): void {
    this.options = this.originalOptions;
    this.activeItem = null;
    this.getSuperControl.setValue(null);
    this.inputConfig = {
      ...this.inputConfig,
      placeholder: '',
    };
    this.selectedItem.emit(null);
  }

  public addNewItem(): void {
    const newItem = {
      id: uuidv4(),
      name: this.getSuperControl.value,
    };
    this.originalOptions = [...this.originalOptions, newItem];
    this.options = this.originalOptions;
    this.activeItem = newItem;
    this.selectedItem.emit(newItem);
  }

  // Multiselect Dropdown
  public onMultiselectSelect(option: any, action: string): void {
    this.isMultiSelectInputFocus = false;
    this.inputConfig.label = null;
    switch (action) {
      case 'multiselect': {
        if (this.multiselectItems.some((item) => item.id === option.id)) {
          return;
        }

        this.options = this.originalOptions.map((item) => {
          if (item.id === option.id) {
            return {
              ...option,
              active: true,
            };
          }
          return item;
        });

        this.multiselectItems = this.options.filter((item) => item.active);
        this.originalOptions = this.options;
        this.selectedItems.emit(
          this.multiselectItems.map((item) => {
            const { active, id, name } = item;
            return {
              id,
              name,
            };
          })
        );
        break;
      }
      case 'multiselect-res-endors': {
        if (this.multiselectItems.some((item) => item.id === option.id)) {
          return;
        }

        this.options = this.originalOptions.map((item) => {
          if (item.id === option.id) {
            return {
              ...option,
              active: true,
            };
          }
          return item;
        });

        this.multiselectItems = this.options.filter((item) => item.active);
        this.originalOptions = this.options;
        this.selectedItems.emit(
          this.multiselectItems.map((item) => {
            const { active, id, code, description } = item;
            return {
              id,
              code,
              description,
            };
          })
        );
        break;
      }
      default: {
        break;
      }
    }
    this.inputRef.focusInput = false;
    this.inputRef.input.nativeElement.blur();

    const timeout = setTimeout(() => {
      this.inputConfig.multiSelectDropdownActive = true;
      clearTimeout(timeout);
    }, 150);
  }

  public removeMultiSelectItem(index: number) {
    this.options = this.originalOptions.map((item) => {
      if (item.id === this.multiselectItems[index].id) {
        return {
          ...this.multiselectItems[index],
          active: false,
        };
      }
      return item;
    });

    this.originalOptions = this.options;
    this.multiselectItems.splice(index, 1);

    if (!this.multiselectItems.length) {
      this.inputConfig.multiSelectDropdownActive = null;
      this.inputConfig.label = this.multiSelectLabel;
    }

    this.selectedItems.emit(
      this.multiselectItems.map((item) => {
        const { active, id, name } = item;
        return {
          id,
          name,
        };
      })
    );
  }

  public delteAllMultiSelectItems(event: any) {
    this.multiselectItems = [];
    this.inputConfig.multiSelectDropdownActive = null;
    this.inputConfig.label = this.multiSelectLabel;
    this.options = this.options.map(item => {
      return {
        ...item,
        active: false
      }
    });
    this.originalOptions = this.options;
    this.selectedItems.emit([]);
  }

  public toggleMultiselectDropdown(event: any) {
    this.isMultiSelectInputFocus = !this.isMultiSelectInputFocus;

    if (this.isMultiSelectInputFocus) {
      this.inputRef.setInputCursorAtTheEnd(this.inputRef.input.nativeElement);

      const timeout = setTimeout(() => {
        this.popoverRef.open();
        clearTimeout(timeout);
      }, 150);
    } else {
      this.inputRef.focusInput = false;
      this.popoverRef.close();
    }
  }

  /**
   *
   * Navigate through dropdown with keyboard arrows
   */
  private dropdownNavigation(step: number) {
    this.dropdownPosition += step;

    if (this.dropdownPosition > this.options.length - 1) {
      this.dropdownPosition = 0;
    }

    if (this.dropdownPosition < 0) {
      this.dropdownPosition = this.options.length - 1;
    }

    let cssClass = 'dropdown-option-hovered';
    let dropdownContainer: any = $('.dropdown-options');
    let dropdownOption: any = $('.dropdown-option');

    let elOffset =
      dropdownOption.height() * this.dropdownPosition +
      (this.dropdownPosition !== 0 ? this.dropdownPosition * 6 : 0);
    let viewport = dropdownContainer.scrollTop() + dropdownContainer.height();

    if (
      elOffset < dropdownContainer.scrollTop() ||
      elOffset + dropdownOption.height() > viewport
    )
      $(dropdownContainer).scrollTop(elOffset);

    dropdownOption
      .removeClass(cssClass)
      .eq(this.dropdownPosition)
      .addClass(cssClass);
  }

  public identity(index: number, item: any): number {
    return item.id;
  }

  // Must be here, because of "untilDestroyed"
  ngOnDestroy(): void {}
}
