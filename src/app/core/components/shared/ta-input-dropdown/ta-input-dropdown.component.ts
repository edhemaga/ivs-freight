import { debounceTime } from 'rxjs';
import { ControlValueAccessor, NgControl } from '@angular/forms';

import {
  ChangeDetectionStrategy,
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
import { TaInputResetService } from '../ta-input/ta-input-reset.service';

@Component({
  selector: 'app-ta-input-dropdown',
  templateUrl: './ta-input-dropdown.component.html',
  styleUrls: ['./ta-input-dropdown.component.scss'],
  providers: [TaInputService],
  animations: [input_dropdown_animation('showHideDropdownOptions')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaInputDropdownComponent
  implements OnInit, OnDestroy, OnChanges, ControlValueAccessor
{
  @ViewChild(TaInputComponent) inputRef: TaInputComponent;
  @ViewChild('t2') public popoverRef: NgbPopover;

  @Input() template: string;

  @Input() inputConfig: ITaInput;
  @Input() canAddNew: boolean = false;
  @Input() isOpenSomethingElse: boolean = false;
  @Input() sort: string;

  @Input() activeItem: any;
  @Input() options: any[] = []; // when send SVG, please premmaped object: add 'folder' | 'subfolder'
  @Input() preloadMultiselectItems: any[] = [];

  @Input() isDetailsActive: boolean = false;

  @Output() selectedItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() saveNewItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectedItems: EventEmitter<any> = new EventEmitter<any>();

  public originalOptions: any[] = [];
  private dropdownPosition: number = -1;

  // Multiselect dropdown options
  public multiselectItems: any[] = [];
  public isMultiSelectInputFocus: boolean = false;
  public multiSelectLabel: string = null;
  public lastActiveMultiselectItem: any = null;

  // Add mode
  public isInAddMode: boolean = false;

  constructor(
    @Self() public superControl: NgControl,
    private inputService: TaInputService,
    private inputResetService: TaInputResetService,
    private changeDetectionRef: ChangeDetectorRef
  ) {
    this.superControl.valueAccessor = this;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Options from backend
    if (changes.options?.currentValue != changes.options?.previousValue) {
      switch (this.sort) {
        case 'active-drivers': {
          this.options = this.options.sort((x, y) =>
            x?.status === y?.status ? 0 : x ? -1 : 1
          );
          this.originalOptions = [...this.options];
          break;
        }
        default: {
          this.originalOptions = [...this.options];
          break;
        }
      }
    }

    // MultiSelect Selected Items From Backend
    if (
      changes.preloadMultiselectItems?.currentValue?.length !=
        changes.preloadMultiselectItems?.previousValue?.length &&
      this.inputConfig.multiselectDropdown
    ) {
      const timeout = setTimeout(() => {
        this.preloadMultiselectItems.forEach((item) => {
          this.onMultiselectSelect(item, this.template);
        });
        clearTimeout(timeout);
      }, 50);
    }

    // Details Pages
    if (this.template === 'details-template' && this.isDetailsActive) {
      const timeout = setTimeout(() => {
        this.inputRef.setInputCursorAtTheEnd(this.inputRef.input.nativeElement);
        const option = this.options.find((item) => item.active);
        this.activeItem = option;
        this.getSuperControl.setValue(option.name);

        const timeout2 = setTimeout(() => {
          this.popoverRef.open();
          clearTimeout(timeout2);
        }, 150);
        clearTimeout(timeout);
      });
    }
  }

  ngOnInit(): void {
    if (this.inputConfig.multiselectDropdown) {
      this.multiSelectLabel = this.inputConfig.label;
    }

    // Search
    this.getSuperControl.valueChanges
      .pipe(debounceTime(50), untilDestroyed(this))
      .subscribe((searchText) => {
        this.search(searchText);
      });

    // Clear Input
    this.inputService.onClearInput$
      .pipe(debounceTime(50), untilDestroyed(this))
      .subscribe((action: boolean) => {
        if (action) {
          this.popoverRef.close();
          this.onClearSearch();
        }
      });

    // Reset Input
    this.inputResetService.resetInputSubject
      .pipe(debounceTime(50), untilDestroyed(this))
      .subscribe((action) => {
        this.inputRef.touchedInput = false;
      });

    this.dropDownShowHideEvent();
    this.dropDownKeyboardNavigationEvent();
  }

  get getSuperControl() {
    return this.superControl.control;
  }

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}

  private dropDownShowHideEvent() {
    this.inputService.dropDownShowHide$
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

          if (this.isInAddMode) {
            this.inputConfig = {
              ...this.inputConfig,
              placeholder: null,
            };
          }
        }

        if (
          this.inputConfig.customClass?.includes('details-pages') &&
          !action
        ) {
          this.selectedItem.emit(this.activeItem);
        }
      });
  }

  private dropDownKeyboardNavigationEvent() {
    this.inputService.dropDownKeyNavigation$
      .pipe(untilDestroyed(this))
      .subscribe((keyEvent) => {
        if (keyEvent === 40) {
          this.dropdownNavigation(1);
        }

        if (keyEvent === 38) {
          this.dropdownNavigation(-1);
        }

        if (keyEvent === 13) {
          const selectedItem = $('.dropdown-option-hovered').text().trim();
          if (selectedItem !== 'Add New') {
            const existItem = this.options
              .map((item) => {
                if (item.name) {
                  return {
                    id: item.id,
                    name: item.name,
                  };
                } else if (item.code) {
                  return {
                    id: item.id,
                    name: item.code.concat(' - ', item.description),
                  };
                }
              })
              .find(
                (item) => item.name.toLowerCase() === selectedItem.toLowerCase()
              );

            if (this.inputConfig.multiselectDropdown) {
              this.onMultiselectSelect(existItem, this.template);
            } else {
              this.getSuperControl.setValue(existItem.name);
              this.selectedItem.emit(existItem);
              this.activeItem = existItem;
              this.inputService.dropDownItemSelectedOnEnter$.next(true);
            }
            this.popoverRef.close();
          } else {
            this.onAddNewEvent();
          }
        }

        if (keyEvent === 9) {
          this.popoverRef.open();
        }
      });
  }

  private search(searchText: string): void {
    // Single Dropdown
    if (this.template !== 'groups') {
      if (
        searchText?.length &&
        this.getSuperControl.value &&
        this.activeItem?.name !== this.getSuperControl.value
      ) {
        this.options = this.originalOptions.filter((item) =>
          item.name
            ? item.name.toLowerCase().includes(searchText.toLowerCase())
            : item.code
                .concat(' - ', item.description)
                .toLowerCase()
                .includes(searchText.toLowerCase())
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
        searchText?.length &&
        this.activeItem?.name !== this.getSuperControl.value
      ) {
        this.options = this.originalOptions
          .map((element) => {
            return {
              ...element,
              groups: element.groups.filter((subElement) =>
                subElement.name.toLowerCase().includes(searchText.toLowerCase())
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
      if (!this.isOpenSomethingElse) {
        this.onAddNewEvent();
        this.isInAddMode = true;
        const timeout = setTimeout(() => {
          this.isInAddMode = false;
          clearTimeout(timeout);
        }, 500);
        return;
      } else {
        this.selectedItem.emit(option);
      }
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
    this.saveNewItem.emit(newItem);
  }

  public onAddNewEvent() {
    this.inputConfig = {
      ...this.inputConfig,
      commands: {
        active: true,
        type: 'confirm-cancel',
        firstCommand: {
          popup: {
            name: 'Confirm',
            backgroundColor: '#536BC2',
          },
          name: 'confirm',
          svg: 'assets/svg/ic_spec-confirm.svg',
        },
        secondCommand: {
          popup: {
            name: 'Cancel',
            backgroundColor: '#6c6c6c',
          },
          name: 'cancel',
          svg: 'assets/svg/ic_x.svg',
        },
      },
      placeholder: null,
    };
    this.inputService.dropdownAddMode$.next(true);
    this.popoverRef.close();
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

  public onCommandInput(event: string) {
    if (event === 'confirm') {
      this.addNewItem();
    } else {
      this.getSuperControl.patchValue(null);
    }

    this.inputConfig = {
      ...this.inputConfig,
      commands: null,
    };
  }

  public identity(index: number, item: any): number {
    return item.id;
  }

  // ----------------------------------  Multiselect Dropdown ----------------------------------
  public onMultiselectSelect(option: any, action: string): void {
    this.isMultiSelectInputFocus = false;
    this.inputConfig.label = null;

    switch (action) {
      case 'multiselect': {
        if (this.multiselectItems.some((item) => item.id === option.id)) {
          return;
        }

        this.options = this.options.map((item) => {
          if (item.id === option.id) {
            return {
              ...item,
              active: true,
            };
          } else {
            if (!item.active) {
              return {
                ...item,
                active: false,
              };
            } else {
              return {
                ...item,
                active: true,
              };
            }
          }
        });

        this.multiselectItems = this.options.filter((item) => item.active);

        this.selectedItems.emit(
          this.multiselectItems.map((item) => {
            const { id, name } = item;
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
              ...item,
              active: true,
            };
          } else {
            if (!item.active) {
              return {
                ...item,
                active: false,
              };
            } else {
              return {
                ...item,
                active: true,
              };
            }
          }
        });

        this.multiselectItems = this.options.filter((item) => item.active);

        this.selectedItems.emit(
          this.multiselectItems.map((item) => {
            const { id, code, description } = item;
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

    this.options = this.options.sort(
      (x, y) => Number(y.active) - Number(x.active)
    );
    this.originalOptions = [...this.options];

    this.lastActiveMultiselectItem = this.options
      .filter((item) => item.active)
      .slice(-1)[0];

    this.inputRef.focusInput = false;
    this.inputRef.input.nativeElement.blur();
    this.inputConfig = {
      ...this.inputConfig,
      multiSelectDropdownActive: true,
    };
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

    this.options = this.options.sort(
      (x, y) => Number(y.active) - Number(x.active)
    );

    this.originalOptions = this.options;
    this.multiselectItems.splice(index, 1);

    if (!this.multiselectItems.length) {
      this.inputConfig.multiSelectDropdownActive = null;
      this.lastActiveMultiselectItem = null;
      this.inputConfig.label = this.multiSelectLabel;
    }

    this.selectedItems.emit(
      this.multiselectItems.map((item) => {
        const { id, name } = item;
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
    this.options = this.options.map((item) => {
      return {
        ...item,
        active: false,
      };
    });
    this.originalOptions = this.options;
    this.selectedItems.emit([]);
    this.lastActiveMultiselectItem = null;
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

  // Must be here, because of "untilDestroyed"
  ngOnDestroy(): void {}
}
