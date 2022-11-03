import { debounceTime, Subject, takeUntil } from 'rxjs';
import { ControlValueAccessor, NgControl } from '@angular/forms';

import {
  AfterViewInit,
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
import { TaInputService } from '../ta-input/ta-input.service';
import { v4 as uuidv4 } from 'uuid';
import { ITaInput } from '../ta-input/ta-input.config';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { TaInputComponent } from '../ta-input/ta-input.component';
import { TaInputResetService } from '../ta-input/ta-input-reset.service';
import { ImageBase64Service } from '../../../utils/base64.image';

@Component({
  selector: 'app-ta-input-dropdown',
  templateUrl: './ta-input-dropdown.component.html',
  styleUrls: ['./ta-input-dropdown.component.scss'],
  providers: [TaInputService],
  animations: [input_dropdown_animation('showHideDropdownOptions')],
})
export class TaInputDropdownComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges, ControlValueAccessor
{
  private destroy$ = new Subject<void>();
  @ViewChild('input') inputRef: TaInputComponent;
  @ViewChild('t2') public popoverRef: NgbPopover;

  @Input() template: string; // different templates for body rendering
  @Input() multiselectTemplate: string;

  @Input() inputConfig: ITaInput;
  @Input() canAddNew: boolean; // add new item in options
  @Input() canOpenModal: boolean; // open modal with Add New button
  @Input() sort: string; // sort-template for different options

  @Input() activeItem: any; // currently active item
  @Input() activeItemColor: any; // currently active color in dropdown

  @Input() labelMode: 'Label' | 'Color';

  @Input() options: any[] = []; // when send SVG, please premmaped object: add 'folder' | 'subfolder'
  @Input() preloadMultiselectItems: any[] = [];

  @Input() isDetailsPages: boolean; // only for details pages
  @Input() incorrectValue: boolean; // applicant review option

  @Output() selectedItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectedItems: EventEmitter<any> = new EventEmitter<any>();

  @Output() selectedItemColor: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectedLabelMode: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeDropdown: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() saveItem: EventEmitter<{ data: any; action: string }> =
    new EventEmitter<{ data: any; action: string }>();

  @Output() incorrectEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() placeholderIconEvent: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  public originalOptions: any[] = [];

  // Multiselect dropdown options
  public multiselectItems: any[] = [];
  public isMultiSelectInputFocus: boolean = false;
  public multiSelectLabel: string = null;
  public lastActiveMultiselectItem: any = null;

  // Add mode
  public isInAddMode: boolean = false;

  // Dropdown navigation with keyboard
  private dropdownPosition: number = -1;

  // For Dispatchboard hover options
  public hoveredOption: number = -1;

  constructor(
    @Self() public superControl: NgControl,
    private inputService: TaInputService,
    private inputResetService: TaInputResetService,
    public imageBase64Service: ImageBase64Service
  ) {
    this.superControl.valueAccessor = this;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Sorting backend options
    if (changes.options?.currentValue != changes.options?.previousValue) {
      switch (this.sort) {
        case 'active-drivers': {
          this.options = this.options.sort(
            (x, y) => Number(y.status) - Number(x.status)
          );

          this.originalOptions = [...this.options];
          break;
        }
        default: {
          if (
            this.canAddNew &&
            !this.options.find((item) => item.id === 7655)
          ) {
            this.options.unshift({
              id: 7655,
              name: 'Add New',
            });
          }
          this.originalOptions = this.options;
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
      if (changes.preloadMultiselectItems?.currentValue?.length) {
        const timeout = setTimeout(() => {
          this.preloadMultiselectItems.forEach((item) => {
            this.onMultiselectSelect(item);
          });
          clearTimeout(timeout);
        }, 50);
      } else {
        this.deleteAllMultiSelectItems(
          changes.inputConfig?.currentValue?.label
        );
      }
    }

    // Details Pages
    if (this.template === 'details-template' && this.isDetailsPages) {
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

    if (
      this.inputConfig.name === 'Address' ||
      this.inputConfig.name === 'RoutingAddress'
    ) {
      if (this.getSuperControl.value && this.inputRef?.focusInput) {
        this.popoverRef?.open();
      } else {
        this.popoverRef?.close();
      }
    }
  }

  ngAfterViewInit() {
    if (this.inputConfig.autoFocus) {
      const timeout = setTimeout(() => {
        this.popoverRef.open();
        clearTimeout(timeout);
      }, 450);
    }
  }

  ngOnInit(): void {
    // Multiselect
    if (this.inputConfig.multiselectDropdown) {
      this.multiSelectLabel = this.inputConfig.label;
    }

    // Search
    this.getSuperControl.valueChanges
      .pipe(debounceTime(50), takeUntil(this.destroy$))
      .subscribe((searchText) => {
        if (this.labelMode === 'Color') {
          return;
        }
        this.search(searchText);
      });

    // Clear Input
    this.inputService.onClearInput$
      .pipe(debounceTime(50), takeUntil(this.destroy$))
      .subscribe((action: boolean) => {
        if (action) {
          this.popoverRef.close();
          // label dropdown
          if (this.inputConfig.dropdownLabel) {
            this.clearDropdownLabel();
          }
          // normal dropdown
          else {
            this.onClearSearch();
          }
        }
      });

    // Reset Input
    this.inputResetService.resetInputSubject
      .pipe(debounceTime(50), takeUntil(this.destroy$))
      .subscribe(() => {
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
      .pipe(takeUntil(this.destroy$))
      .subscribe((action: boolean) => {
        // Multiselect dropdown
        if (this.inputConfig.multiselectDropdown) {
          this.isMultiSelectInputFocus = action;
        }

        if (this.labelMode !== 'Color') {
          // Focus Out
          if (!action) {
            this.popoverRef.open();

            // Prevent user to typing dummmy data if activeItem doesn't exist
            if (this.activeItem) {
              this.getSuperControl.setValue(this.activeItem.name);
            } else {
              const index = this.originalOptions.findIndex(
                (item) => item.name === this.getSuperControl.value
              );
              if (index === -1) {
                this.onClearSearch();
              }
            }
            this.popoverRef.close();
          }
          // Focus In
          else {
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
        }

        // Details pages
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
      .pipe(takeUntil(this.destroy$))
      .subscribe((keyCode) => {
        // Navigate down
        if (keyCode === 40) {
          this.dropdownNavigation(1);
        }
        // Navigate up
        if (keyCode === 38) {
          this.dropdownNavigation(-1);
        }
        // Press 'enter'
        if (keyCode === 13) {
          let selectedItem = $('.dropdown-option-hovered').text().trim();

          // Address Select
          if (
            (this.inputConfig.name == 'Address' ||
              this.inputConfig.name == 'RoutingAddress') &&
            (!selectedItem || selectedItem == '')
          ) {
            selectedItem = this.options[0].name;
          }
          // Add New Option
          if (selectedItem === 'Add New') {
            this.addNewConfig();
          }
          // Normal Pick Dropdown
          else {
            const existItem = this.options
              .map((item) => {
                // Address
                if (
                  item.name &&
                  (this.inputConfig.name == 'Address' ||
                    this.inputConfig.name == 'RoutingAddress')
                ) {
                  return {
                    id: item.id,
                    name: item.name,
                    address: item.address,
                    longLat: item.longLat,
                  };
                }
                // Image (must be before type code, because color has same prop like other dropdown pop)
                else if (item.logoName) {
                  return { ...item };
                }
                // Code
                else if (item.code) {
                  return {
                    id: item.id,
                    name: item.code.concat(' - ', item.description),
                  };
                }
                // Default
                else {
                  if (item.name) {
                    return {
                      id: item.id,
                      name: item.name,
                    };
                  }
                }
              })
              .find(
                (item) => item.name.toLowerCase() === selectedItem.toLowerCase()
              );

            // MultiSelect Dropdown
            if (this.inputConfig.multiselectDropdown) {
              this.onMultiselectSelect(existItem);
            }

            // Normal Dropdown
            else {
              this.inputConfig = {
                ...this.inputConfig,
                blackInput: true,
              };

              this.getSuperControl.setValue(existItem.name);
              this.selectedItem.emit(existItem);
              this.activeItem = existItem;
              this.inputService.dropDownItemSelectedOnEnter$.next(true);

              if (this.inputConfig.name !== 'RoutingAddress') {
                const timeout = setTimeout(() => {
                  this.inputConfig = {
                    ...this.inputConfig,
                    blackInput: false,
                  };
                  clearTimeout(timeout);
                }, 150);
              }
            }
            this.popoverRef.close();
          }
        }

        if (keyCode === 9) {
          this.popoverRef.open();
        }
      });
  }

  private search(searchText: string): void {
    // Single Dropdown
    if (this.template !== 'groups' && this.template !== 'load-broker-contact') {
      if (
        searchText?.length &&
        this.getSuperControl.value &&
        this.activeItem?.name !== this.getSuperControl.value
      ) {
        this.options = this.originalOptions.filter((item) =>
          item.name
            ? item.name.toLowerCase().includes(searchText.toLowerCase())
            : item.code
            ? item.code
                .concat(' - ', item.description)
                .toLowerCase()
                .includes(searchText.toLowerCase())
            : searchText.toLowerCase()
        );

        if (
          ['truck', 'trailer'].includes(
            this.inputConfig?.dropdownImageInput?.template
          )
        ) {
          this.inputConfig = {
            ...this.inputConfig,
            dropdownImageInput: {
              ...this.inputConfig?.dropdownImageInput,
              remove: true,
            },
          };
        }

        if (!this.options.length) {
          this.options.push({
            id: 7654,
            name: 'No Results',
          });
        }
      } else {
        this.options = this.originalOptions;

        if (
          ['truck', 'trailer'].includes(
            this.inputConfig?.dropdownImageInput?.template
          )
        ) {
          this.inputConfig = {
            ...this.inputConfig,
            dropdownImageInput: {
              ...this.inputConfig?.dropdownImageInput,
              remove: false,
            },
          };
        }
      }
    }
    // Group Dropdown Items
    else {
      if (
        searchText?.length &&
        this.activeItem?.name !== this.getSuperControl.value
      ) {
        if (this.template === 'groups') {
          this.options = this.originalOptions
            .map((element) => {
              return {
                ...element,
                groups: element.groups.filter((subElement) =>
                  subElement.name
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
                ),
              };
            })
            .filter((item) => item.groups.length);
        }

        if (this.template === 'load-broker-contact') {
          this.options = this.originalOptions.map((element) => {
            return {
              ...element,
              contacts: element?.contacts?.filter((subElement) =>
                subElement.name.toLowerCase().includes(searchText.toLowerCase())
              ),
            };
          });
        }

        if (!this.options.length) {
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
    // Disable to picking banned or dnu user
    if (option?.dnu || option?.ban) {
      return;
    }
    // No Result
    if (option.id === 7654) {
      return;
    }
    // Add New
    else if (option.id === 7655) {
      if (this.canOpenModal) {
        this.selectedItem.emit({ ...option, canOpenModal: true });
      } else {
        // DropDown label
        if (this.inputConfig.dropdownLabel) {
          this.inputConfig.dropdownLabelNew = true;
          this.inputRef.editInputMode = true;
          this.selectedLabelMode.emit('Color');
          this.inputConfig.commands.active = true;
          this.inputRef.setInputCursorAtTheEnd(
            this.inputRef.input.nativeElement
          );
          this.selectedItem.emit(option);
        }
        // Normal Dropdown
        else {
          this.addNewConfig();
        }
      }
    }
    // Pick the item
    else {
      // Dropdown labels option selected
      if (this.inputConfig.dropdownLabel) {
        if (this.labelMode === 'Label') {
          this.activeItem = option;
          this.getSuperControl.setValue(option.name);
          this.options = this.originalOptions;
          this.selectedItem.emit(option);
        }

        if (this.labelMode === 'Color') {
          this.activeItemColor = option;

          this.selectedItemColor.emit(this.activeItemColor);
        }
      }

      // Normal Dropdown option selected
      else {
        this.inputConfig = {
          ...this.inputConfig,
          blackInput: true,
        };

        this.activeItem = option;
        this.getSuperControl.setValue(option.name);
        this.options = this.originalOptions;
        this.selectedItem.emit(option);

        if (this.inputConfig.name !== 'RoutingAddress') {
          const timeout = setTimeout(() => {
            this.inputConfig = {
              ...this.inputConfig,
              blackInput: false,
            };
            clearTimeout(timeout);
          }, 150);
        }
      }
    }
  }

  public onClearSearch(): void {
    this.options = this.originalOptions;
    this.activeItem = null;
    this.getSuperControl.patchValue(null);
    this.inputConfig = {
      ...this.inputConfig,
      placeholder: '',
      dropdownImageInput: null,
    };
    this.selectedItem.emit(null);
  }

  public clearDropdownLabel() {
    this.activeItem = null;
    this.activeItemColor = null;
    this.selectedItem.emit(null);
    this.selectedItemColor.emit(null);
    this.selectedLabelMode.emit('Label');
  }

  public commandEvent(event: { data: any; action: string; mode: string }) {
    if (event.action === 'Edit Input') {
      this.selectedLabelMode.emit('Color');
    }
    if (event.action === 'Toggle Dropdown') {
      this.popoverRef.toggle();
    }
    if (event.action === 'confirm' && event.mode === 'new') {
      this.addNewItem();
    }

    if (event.action === 'Placeholder Icon Event') {
      this.placeholderIconEvent.emit(true);
    }

    if (event.action === 'confirm' && event.mode === 'edit') {
      this.updateItem();
    }

    if (event.action === 'cancel') {
      this.saveItem.emit({
        data: this.activeItem,
        action: 'cancel',
      });
      this.selectedLabelMode.emit('Label');
    }
  }

  public addNewItem(): void {
    this.activeItem = {
      id: uuidv4(),
      name: this.getSuperControl.value,
    };

    this.saveItem.emit({ data: this.activeItem, action: 'new' });

    if (this.inputConfig.dropdownLabel) {
      this.selectedLabelMode.emit('Label');
      this.inputRef.touchedInput = true;
    }
  }

  public updateItem(): void {
    this.activeItem = {
      ...this.activeItem,
      name: this.getSuperControl.value,
      colorId: this.activeItemColor
        ? this.activeItemColor.id
        : this.activeItem.colorId,
      color: this.activeItemColor
        ? this.activeItemColor.name
        : this.activeItem.color,
      code: this.activeItemColor
        ? this.activeItemColor.code
        : this.activeItem.code,
    };

    this.saveItem.emit({
      data: this.activeItem,
      action: 'edit',
    });
    this.selectedLabelMode.emit('Label');
  }

  public addNewConfig() {
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

    this.inputConfig.dropdownLabelNew = true; // share this config with label
    this.inputService.dropDownAddMode$.next(true);
    this.popoverRef.close();

    this.isInAddMode = true;
    const timeout = setTimeout(() => {
      this.isInAddMode = false;
      clearTimeout(timeout);
    }, 500);
  }

  /**
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

  public onIncorrectInput(event: boolean) {
    this.incorrectEvent.emit(event);
  }

  public identity(index: number, item: any): number {
    return item.id;
  }

  // ----------------------------------  Multiselect Dropdown ----------------------------------
  public onMultiselectSelect(option: any): void {
    this.isMultiSelectInputFocus = false;
    this.inputConfig.label = null;

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
        return {
          ...item,
        };
      })
    );

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
    } else {
      this.lastActiveMultiselectItem = this.options
        .filter((item) => item.active)
        .slice(-1)[0];
    }

    this.selectedItems.emit(
      this.multiselectItems.map((item) => {
        return { ...item };
      })
    );
  }

  public deleteAllMultiSelectItems(currentLabel?: string) {
    this.multiselectItems = [];
    this.inputConfig.multiSelectDropdownActive = null;
    this.inputConfig.label = currentLabel
      ? currentLabel
      : this.multiSelectLabel;
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

  public toggleMultiselectDropdown() {
    if (this.inputConfig.isDisabled) {
      return;
    }
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

  onBlurInput(e) {
    this.closeDropdown.emit(e);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
