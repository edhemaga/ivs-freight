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

@Component({
  selector: 'app-ta-input-dropdown',
  templateUrl: './ta-input-dropdown.component.html',
  styleUrls: ['./ta-input-dropdown.component.scss'],
  providers: [TaInputService],
  animations: [input_dropdown_animation('showHideDropdownOptions')],
})
export class TaInputDropdownComponent
  implements OnInit, OnChanges, OnDestroy, ControlValueAccessor
{
  @ViewChild('t2') public popover: NgbPopover;
  @Input() template: string;
  @Input() inputConfig: ITaInput;
  @Input() canAddNew: boolean = false;
  @Input() options: any[] = []; // when send SVG, please premmaped object: add 'folder' | 'subfolder'
  @Output() selectedItem: EventEmitter<any> = new EventEmitter<any>();

  public activeItem: any;
  public originalOptions: any[] = [];
  private dropdownPosition: number = 0;

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
          this.onClearSearch();
        }
      });

    this.inputService.dropDownShowHideSubject
      .pipe(untilDestroyed(this))
      .subscribe((action: boolean) => {

        if (!action) {
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
        } else {
          this.inputConfig = {
            ...this.inputConfig,
            placeholder: this.getSuperControl.value
              ? this.getSuperControl.value
              : this.activeItem?.name,
          };
          this.getSuperControl.setValue(null);
        }
      });

    if (this.canAddNew) {
      this.inputService.addDropdownItemSubject
        .pipe(distinctUntilChanged(), untilDestroyed(this))
        .subscribe((action: boolean) => {
          if (action) {
            this.addNewItem();
          }
        });
    }

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
          this.popover.close();
          this.inputService.isDropDownItemSelectedOnEnter.next(true);
        }

        if(keyEvent === 9) {
          this.popover.open();
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
