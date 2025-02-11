import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import {
    ControlValueAccessor,
    FormsModule,
    NgControl,
    ReactiveFormsModule,
} from '@angular/forms';

import { debounceTime, skip, Subject, takeUntil } from 'rxjs';

// bootstrap
import {
    NgbPopover,
    NgbPopoverModule,
    NgbModule,
} from '@ng-bootstrap/ng-bootstrap';

// animation
import { inputDropdownAnimation } from '@shared/components/ta-input-dropdown/animations/input-dropdown.animation';

// uuid
import { v4 as uuidv4 } from 'uuid';

// config
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

// components
import { TaAppTooltipComponent } from '@shared/components/ta-app-tooltip/ta-app-tooltip.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaProfileImagesComponent } from '@shared/components/ta-profile-images/ta-profile-images.component';
import { LoadModalProgressBarComponent } from '@pages/load/pages/load-modal/components/load-modal-progress-bar/load-modal-progress-bar.component';
import { LoadStatusStringComponent } from '@pages/load/components/load-status-string/load-status-string.component';

// utils
import { ImageBase64Service } from '@shared/services/image-base64.service';

// pipes
import { FormControlPipe } from '@shared/components/ta-input/pipes/form-control.pipe';
import { DropdownCountPipe } from '@shared/components/ta-input-dropdown/pipes/dropdown-count.pipe';
import { HighlightSearchPipe } from '@shared/pipes/highlight-search.pipe';
import { TaSvgPipe } from '@shared/pipes/ta-svg.pipe';
import { LoadStatusColorPipe } from '@shared/pipes/load-status-color.pipe';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// directives
import { HoverSvgDirective } from '@shared/directives/';

// svg routes
import { InputDropdownSvgRoutes } from '@shared/components/ta-input-dropdown/utils/svg-routes/input-dropdown-svg-routes';

// enums
import { EGeneralActions } from '@shared/enums';

@Component({
    selector: 'app-ta-input-dropdown',
    templateUrl: './ta-input-dropdown.component.html',
    styleUrls: ['./ta-input-dropdown.component.scss'],
    standalone: true,
    providers: [FormControlPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [inputDropdownAnimation('showHideDropdownOptions')],
    imports: [
        // Module
        CommonModule,
        FormsModule,
        NgbPopoverModule,
        ReactiveFormsModule,
        NgbModule,
        AngularSvgIconModule,

        // Component
        TaInputComponent,
        TaAppTooltipComponent,
        TaProfileImagesComponent,
        LoadModalProgressBarComponent,
        LoadStatusStringComponent,

        // Pipe
        TaSvgPipe,
        FormControlPipe,
        DropdownCountPipe,
        HighlightSearchPipe,
        LoadStatusColorPipe,

        // Directive
        HoverSvgDirective,
    ],
})
export class TaInputDropdownComponent
    implements OnInit, AfterViewInit, OnChanges, OnDestroy, ControlValueAccessor
{
    @ViewChild('input') inputRef: TaInputComponent;
    @ViewChild('t2') public popoverRef: NgbPopover;

    // different templates for body rendering
    public _template: string = null;
    _canAddNew: boolean;
    @Input() set template(value: string) {
        this._template = value;
        if (value === 'details-template' && this.isDetailsPages) {
            this.clearTimeoutDropdown = setTimeout(() => {
                this.inputRef.setInputCursorAtTheEnd(
                    this.inputRef.input.nativeElement
                );
                const option = this._options.find((item) => item.active);
                this._activeItem = option;
                this.getSuperControl.setValue(option.name);

                const timeout2 = setTimeout(() => {
                    this.popoverRef.open();
                    clearTimeout(timeout2);
                }, 150);
            });
        }
    }

    @Input() multiselectTemplate: string;
    @Input() inputConfig: ITaInput;
    @Input() set canAddNew(value: boolean) {
        this._canAddNew = value;
    } // ADD NEW item in options
    @Input() canOpenModal: boolean; // open modal with ADD NEW button

    // sort-template for different options
    public _sort: string = null;
    @Input() set sort(value: string) {
        this._sort = value;
    }
    // currently active item
    public _activeItem: any;
    @Input() set activeItem(value: any) {
        this.inputConfig = {
            ...this.inputConfig,
            blackInput: true,
        };
        this._activeItem = value;

        // With address
        if (
            this.inputConfig.name &&
            this.inputConfig.name.toLowerCase().includes('address') &&
            this._activeItem
        ) {
            if (Object.keys(this._activeItem).length > 0) {
                this.getSuperControl.patchValue(
                    value.address ? value.address : null
                );
            }

            if (!this.inputConfig.hideColorValidations) {
                this.clearTimeoutDropdown = setTimeout(() => {
                    this.inputConfig = {
                        ...this.inputConfig,
                        blackInput: false,
                    };
                    this.cdRef.detectChanges();
                }, 150);
            }
        }
        // Without address
        else {
            if (this._activeItem) {
                this.clearTimeoutDropdown = setTimeout(() => {
                    this.getSuperControl.patchValue(
                        value.number
                            ? value.number
                            : value.name
                              ? value.name
                              : (value.companyName ?? null)
                    );

                    if (!this.inputConfig.hideColorValidations) {
                        this.inputConfig = {
                            ...this.inputConfig,
                            blackInput: false,
                        };
                    }
                    this.cdRef.detectChanges();
                }, 150);
            }
        }
    }

    @Input() activeItemColor: any; // currently active color in dropdown
    @Input() labelMode: 'Label' | 'Color';

    // when send SVG, please premmaped object: add 'folder' | 'subfolder'
    public _options: any[] = [];
    @Input() set options(values: any[]) {
        if (values) this._options = [...values];

        switch (this._sort) {
            case 'active-drivers': {
                this._options = values.sort(
                    (x, y) => Number(y.status) - Number(x.status)
                );

                this.originalOptions = [...this._options];
                break;
            }
            default: {
                setTimeout(() => {
                    if (
                        this._canAddNew &&
                        !this._options.find((item) => item.id === 7655)
                    ) {
                        this._options.unshift({
                            id: 7655,
                            name: 'ADD NEW',
                        });
                    }

                    this.originalOptions = this._options;
                }, 100);
                break;
            }
        }
    }

    // MultiSelect Selected Items From Backend
    @Input() set preloadMultiselectItems(values: any[]) {
        if (this.inputConfig.multiselectDropdown) {
            if (!values) {
                this.deleteAllMultiSelectItems(this.inputConfig.label);
                return;
            }

            if (values?.length) {
                values.forEach((item) => {
                    this.onMultiselectSelect(item);
                });
            }
        }
    }
    @Input() isDetailsPages: boolean; // only for details pages
    @Input() incorrectValue: boolean; // applicant review option

    @Output() selectedItem: EventEmitter<any> = new EventEmitter<any>();
    @Output() selectedItems: EventEmitter<any> = new EventEmitter<any>();
    @Output() selectedItemColor: EventEmitter<any> = new EventEmitter<any>();
    @Output() selectedLabelMode: EventEmitter<any> = new EventEmitter<any>();
    @Output() closeDropdown: EventEmitter<boolean> =
        new EventEmitter<boolean>();
    @Output() saveItem: EventEmitter<{ data: any; action: string }> =
        new EventEmitter<{ data: any; action: string }>();
    @Output() incorrectEvent: EventEmitter<boolean> =
        new EventEmitter<boolean>();
    @Output() placeholderIconEvent: EventEmitter<boolean> =
        new EventEmitter<boolean>();
    @Output('pagination') paginationEvent: EventEmitter<number> =
        new EventEmitter<number>();
    @Output('activeGroup') activeGroupEvent: EventEmitter<number> =
        new EventEmitter<number>();
    @Output('clearInputEvent') clearInputEvent: EventEmitter<boolean> =
        new EventEmitter<any>();

    // Copy of Options
    public originalOptions: any[] = [];

    // Pagination
    public paginationNumber: number = 0;

    // Multiselect dropdown options
    public multiselectItems: any[] = [];
    public isMultiSelectInputFocus: boolean = false;
    public multiSelectLabel: string = null;
    public lastActiveMultiselectItem: any = null;

    // Add mode
    public isInAddMode: boolean = false;

    // For Dispatchboard hover options
    public hoveredOption: number = -1;

    // Dropdown navigation with keyboard
    private dropdownPosition: number = -1;

    // Dropdown Cleartimeout
    public clearTimeoutDropdown: any = null;

    // Destroy
    private destroy$ = new Subject<void>();

    // svg routes
    public inputDropdownSvgRoutes = InputDropdownSvgRoutes;

    constructor(
        @Self() public superControl: NgControl,
        public imageBase64Service: ImageBase64Service,
        private cdRef: ChangeDetectorRef
    ) {
        this.superControl.valueAccessor = this;
    }

    get getSuperControl() {
        return this.superControl.control;
    }

    writeValue(_: any): void {}

    registerOnChange(_: any): void {}

    registerOnTouched(_: any): void {}

    ngOnInit(): void {
        // Multiselect
        if (this.inputConfig.multiselectDropdown) {
            this.multiSelectLabel = this.inputConfig.label;
        }

        // Search
        this.getSuperControl.valueChanges
            .pipe(debounceTime(50), takeUntil(this.destroy$), skip(1))
            .subscribe((searchText) => {
                if (this.labelMode === 'Color') {
                    return;
                }
                this.search(searchText);
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.options && changes.options.currentValue) {
            this.originalOptions = changes.options.currentValue;
        }
    }

    ngAfterViewInit() {
        if (this.inputConfig.autoFocus) {
            this.clearTimeoutDropdown = setTimeout(() => {
                this.popoverRef.open();
            }, 450);
        }
    }

    public onScrollDropdown(event: any) {
        if (event.scrollTop + event.offsetHeight === event.scrollHeight) {
            this.paginationNumber += 1;

            this.paginationEvent.emit(this.paginationNumber);
        }
    }

    public onActiveItem(option: any, group?: any): void {
        // Prevent user to pick franchise, without group
        if (
            this._template === 'fuel-franchise' &&
            option?.isFranchise &&
            !group
        ) {
            return;
        }
        // Disable to picking banned or dnu user
        if (option?.dnu || option?.ban) {
            return;
        }
        // No Result
        if (option.id === 7654 || option.id === 7656) {
            return;
        }
        // ADD NEW
        else if (option.id === 7655) {
            // Open New Modal
            if (this.canOpenModal) {
                this.selectedItem.emit({ ...option, canOpenModal: true });
            }
            // Work with current modal
            else {
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
            this.inputConfig.selectedDropdown = true;
            // Dropdown labels option selected
            if (this.inputConfig.dropdownLabel) {
                if (this.labelMode === 'Label') {
                    this._activeItem = option;
                    this.getSuperControl.setValue(option.name);
                    this._options = this.originalOptions;
                    this.selectedItem.emit(option);
                }

                if (this.labelMode === 'Color') {
                    this.activeItemColor = option;

                    this.selectedItemColor.emit(this.activeItemColor);
                }
            }
            // Normal Dropdown option selected
            else {
                this._activeItem = option;

                this._options = this.originalOptions;

                if (this.inputConfig.name !== 'RoutingAddress') {
                    this.getSuperControl.patchValue(
                        option?.number ? option.number : option.name
                    );

                    if (this._template === 'fuel-franchise') {
                        this.getSuperControl.patchValue(
                            group ? option.name : option.businessName
                        );
                        const { id } = option;
                        group
                            ? this.selectedItem.emit({
                                  ...option,
                                  ...group,
                                  storeId: id,
                              })
                            : this.selectedItem.emit(option);
                    } else {
                        group
                            ? this.selectedItem.emit({
                                  ...option,
                                  ...group,
                              })
                            : this.selectedItem.emit(option);
                    }
                }
            }
            this.getSuperControl.markAsDirty();

            this.popoverRef.close();
        }

        if (this._template === 'fuel-franchise') {
            this.clearTimeoutDropdown = setTimeout(() => {
                this.popoverRef.close();
            }, 100);
        }
    }

    public onClearSearch(): void {
        this._options = this.originalOptions;
        this._activeItem = null;
        this.inputConfig.selectedDropdown = false;
        this.getSuperControl.patchValue(null);
        this.inputConfig = {
            ...this.inputConfig,
            placeholder: '',
            dropdownImageInput: null,
        };
        this.selectedItem.emit(null);
    }

    public clearDropdownLabel() {
        this._activeItem = null;
        this.activeItemColor = null;
        this.selectedItem.emit(null);
        this.selectedItemColor.emit(null);
        this.selectedLabelMode.emit('Label');
    }

    public commandEvent(event: { data: any; action: string; mode: string }) {
        if (event.action === 'Edit Input') {
            this.selectedLabelMode.emit('Color');
            this.inputConfig.dropdownLabelNew = false;
        }
        if (event.action === 'Toggle Dropdown') {
            this.popoverRef.toggle();
        }
        if (event.action === 'confirm' && event.mode === 'new') {
            this.addNewItem();
        }

        if (event.action === 'confirm' && event.mode === EGeneralActions.EDIT) {
            this.updateItem();
        }

        if (event.action === 'Placeholder Icon Event') {
            this.placeholderIconEvent.emit(true);
        }

        if (event.action === EGeneralActions.CANCEL) {
            this.saveItem.emit({
                data: this._activeItem,
                action: EGeneralActions.CANCEL,
            });
            this.selectedLabelMode.emit('Label');
        }
    }

    public addNewItem(): void {
        this._activeItem = {
            id: uuidv4(),
            name: this.getSuperControl.value,
        };
        this.inputConfig.commands.active = false;
        this.inputRef.isVisibleCommands = false;
        this.inputRef.focusInput = false;

        this.saveItem.emit({ data: this._activeItem, action: 'new' });

        if (this.inputConfig.dropdownLabel) {
            this.selectedLabelMode.emit('Label');
            this.inputRef.touchedInput = true;
        }
    }

    public updateItem(): void {
        if (this.inputConfig.dropdownLabel) {
            this._activeItem = {
                ...this._activeItem,
                name: this.getSuperControl.value,
                colorId: this.activeItemColor
                    ? this.activeItemColor.id
                    : this._activeItem.colorId,
                color: this.activeItemColor
                    ? this.activeItemColor.name
                    : this._activeItem.color,
                code: this.activeItemColor
                    ? this.activeItemColor.code
                    : this._activeItem.code,
            };

            this.selectedLabelMode.emit('Label');
        } else {
            this._activeItem = {
                ...this._activeItem,
                name: this.getSuperControl.value,
            };
        }

        this.saveItem.emit({
            data: this._activeItem,
            action: EGeneralActions.EDIT,
        });
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
                        backgroundColor: '#3074d3',
                    },
                    name: 'confirm',
                    svg: 'assets/svg/ic_spec-confirm.svg',
                },
                secondCommand: {
                    popup: {
                        name: 'Cancel',
                        backgroundColor: '#2f2f2f',
                    },
                    name: EGeneralActions.CANCEL,
                    svg: 'assets/svg/ic_x.svg',
                },
            },
            placeholder: null,
        };

        this.popoverRef.close();

        this.isInAddMode = true;
        this.clearTimeoutDropdown = setTimeout(() => {
            this.isInAddMode = false;
        }, 200);
    }

    public onIncorrectInput(event: boolean) {
        this.incorrectEvent.emit(event);
    }

    public identity(index: number, item: any): number {
        return item.id;
    }

    public toggleNestedList(option: any) {
        if (option.open) {
            option.open = false;
            return;
        }
        this._options.filter((item) => (item.open = false));

        option.open = !option.open;

        if (option.open) {
            this.activeGroupEvent.emit(option);
        }
    }

    public onBlurInput(event: boolean) {
        this.closeDropdown.emit(event);
    }

    public onClearInputEvent(event: boolean) {
        this.clearInputEvent.emit(event);

        if (event) {
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
    }

    public showHideDropdown(action?: boolean) {
        if (this.inputConfig.multiselectDropdown) {
            this.isMultiSelectInputFocus = action;
        }

        if (this.labelMode !== 'Color') {
            // Focus Out
            if (!action) {
                if (this._template !== 'fuel-franchise') {
                    this.popoverRef.open();
                }

                // Prevent user to typing dummmy data if _activeItem doesn't exist
                if (this._activeItem) {
                    this.getSuperControl.setValue(this._activeItem.name);
                } else {
                    const index = this.originalOptions.findIndex(
                        (item) => item.name === this.getSuperControl.value
                    );

                    if (index === -1) {
                        this.onClearSearch();
                    }
                }
                if (this._template !== 'fuel-franchise') {
                    this.popoverRef.close();
                }
            }
            // Focus In
            else {
                this.inputConfig = {
                    ...this.inputConfig,
                    placeholder: this.getSuperControl.value
                        ? this.getSuperControl.value
                        : this._activeItem?.name,
                };

                this.getSuperControl.setValue(null);

                if (this.popoverRef) {
                    this.popoverRef.close();
                }

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
            this.selectedItem.emit(this._activeItem);
        }
    }

    public dropDownKeyNavigation({ keyCode, data }) {
        // Navigate down
        if (keyCode === 40) {
            this.dropdownNavigation(1);
        }
        // Navigate up
        if (keyCode === 38) {
            this.dropdownNavigation(-1);
        }

        // Press Escape
        if (keyCode === 27) {
            if (this.inputConfig?.commands?.active) {
                this.inputConfig.commands = null;
                this.inputRef.isVisibleCommands = false;
                this.inputRef.focusInput = false;
            }

            if (this.inputConfig.dropdownLabel) {
                this.getSuperControl.setErrors(null);
                this.inputConfig.dropdownLabelNew = false;
                this.inputConfig.commands.active = false;
                if (!this.inputConfig.hideColorValidations) {
                    this.inputConfig.blackInput = false;
                }
                this.inputRef.focusInput = false;
                this.inputRef.editInputMode = false;
                this.inputRef.input.nativeElement.blur();
                if (this.labelMode === 'Color') {
                    this.getSuperControl.patchValue(null);
                    this.selectedLabelMode.emit('Label');
                }
            }
        }
        // Press 'enter'
        if (keyCode === 13) {
            let selectedItem = $('.dropdown-option-hovered').text().trim();

            // // Open New Modal
            if (this.canOpenModal && selectedItem.toLowerCase() === 'add new') {
                this.selectedItem.emit({
                    id: 7655,
                    name: 'ADD NEW',
                    canOpenModal: true,
                });
            } else {
                if (this._options.length === 1 && !selectedItem) {
                    if (this._template === 'fuel-franchise') {
                        selectedItem = this._options[0]?.businessName
                            ? this._options[0]?.businessName
                            : this._options[0]?.name;
                    } else {
                        selectedItem = this._options[0]?.number
                            ? this._options[0]?.number.toString().trim()
                            : this._options[0].name.toString().trim();
                    }
                }

                this.pickupElementWithKeyboard(selectedItem, data);
            }
        }

        if (keyCode === 9) {
            if (
                this._options.length === 1 &&
                this._options[0].id !== 7655 &&
                this._options[0].id !== 7654
            ) {
                let selectedItem = null;

                if (this._template === 'fuel-franchise') {
                    selectedItem = this._options[0]?.businessName
                        ? this._options[0]?.businessName
                        : this._options[0]?.name;
                } else {
                    selectedItem = this._options[0]?.number
                        ? this._options[0]?.number.toString().trim()
                        : this._options[0].name.toString().trim();
                }

                this.pickupElementWithKeyboard(selectedItem, data);
            } else {
                this.popoverRef.open();
            }
        }
    }

    // ----------------------------------  Multiselect Dropdown ----------------------------------
    public onMultiselectSelect(option: any): void {
        this.isMultiSelectInputFocus = false;
        this.inputConfig.label = null;

        if (this.multiselectItems.some((item) => item.id === option.id)) {
            return;
        }

        this._options = this._options.map((item) => {
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

        this.multiselectItems = this._options.filter((item) => item.active);

        this.selectedItems.emit(this.multiselectItems);

        this._options = this._options.sort(
            (x, y) => Number(y.active) - Number(x.active)
        );
        this.originalOptions = [...this._options];

        this.lastActiveMultiselectItem = this._options
            .filter((item) => item.active)
            .slice(-1)[0];

        if (this.inputRef) {
            this.inputRef.focusInput = false;
            this.inputRef.input.nativeElement.blur();
        }

        this.inputConfig = {
            ...this.inputConfig,
            multiSelectDropdownActive: true,
        };
    }

    public removeMultiSelectItem(index: number) {
        this._options = this.originalOptions.map((item) => {
            if (item.id === this.multiselectItems[index].id) {
                return {
                    ...this.multiselectItems[index],
                    active: false,
                };
            }
            return item;
        });

        this._options = this._options.sort(
            (x, y) => Number(y.active) - Number(x.active)
        );

        this.originalOptions = this._options;
        this.multiselectItems.splice(index, 1);

        if (!this.multiselectItems.length) {
            this.inputConfig = {
                ...this.inputConfig,
                multiSelectDropdownActive: null,
            };

            this.lastActiveMultiselectItem = null;
            this.inputConfig.label = this.multiSelectLabel;
        } else {
            this.lastActiveMultiselectItem = this._options
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
        this.inputConfig = {
            ...this.inputConfig,
            multiSelectDropdownActive: null,
        };

        this.inputConfig.label = currentLabel
            ? currentLabel
            : this.multiSelectLabel;
        this._options = this._options.map((item) => {
            return {
                ...item,
                active: false,
            };
        });
        this.originalOptions = this._options;
        this.selectedItems.emit(null);

        this.lastActiveMultiselectItem = null;
    }

    public toggleMultiselectDropdown() {
        if (this.inputConfig.isDisabled) {
            return;
        }
        this.isMultiSelectInputFocus = !this.isMultiSelectInputFocus;

        if (this.isMultiSelectInputFocus) {
            this.inputRef.setInputCursorAtTheEnd(
                this.inputRef.input.nativeElement
            );

            this.clearTimeoutDropdown = setTimeout(() => {
                this.popoverRef.open();
            }, 150);
        } else {
            this.inputRef.focusInput = false;
            this.popoverRef.close();
        }
    }
    // ----------------------------------  End ----------------------------------

    private pickupElementWithKeyboard(selectedItem: string, data: any) {
        // Address Select
        if (
            (this.inputConfig.name == 'Address' ||
                this.inputConfig.name == 'RoutingAddress') &&
            (!selectedItem || selectedItem == '')
        ) {
            selectedItem = this._options[0].name;
        }

        // Input Dropdown Bank Name
        if (
            !selectedItem &&
            this.inputConfig.name === 'Input Dropdown Bank Name'
        ) {
            this.addNewItem();
        }

        // Input Dropdown Label
        if (!selectedItem && this.inputConfig.dropdownLabel) {
            this.commandEvent({
                data: this.getSuperControl.value,
                action: 'confirm',
                mode: data.dropdownLabelNew ? 'new' : EGeneralActions.EDIT,
            });
            this.clearTimeoutDropdown = setTimeout(() => {
                this.getSuperControl.setErrors(null);
                this.inputConfig.dropdownLabelNew = false;
                this.inputConfig.commands.active = false;
                if (!this.inputConfig.hideColorValidations) {
                    this.inputConfig.blackInput = false;
                }
                this.inputRef.focusInput = false;
                this.inputRef.editInputMode = false;
                this.inputRef.input.nativeElement.blur();
            }, 150);
        }

        // ADD NEW Option
        if (selectedItem === 'ADD NEW') {
            this.addNewConfig();

            if (this.inputConfig.dropdownLabel) {
                // DropDown label
                if (this.inputConfig.dropdownLabel) {
                    this.inputConfig.dropdownLabelNew = true;
                    this.inputRef.editInputMode = true;
                    this.selectedLabelMode.emit('Color');
                    this.inputConfig.commands.active = true;
                    this.inputRef.setInputCursorAtTheEnd(
                        this.inputRef.input.nativeElement
                    );
                    this.inputConfig.blackInput = true;
                    this.selectedItem.emit({
                        id: 7655,
                        name: 'ADD NEW',
                    });
                }
            }
            selectedItem = null;
        }
        // Normal Pick Dropdown
        else {
            const existItem = this._options
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

                    // Load Dispatches TTD
                    else if (
                        [
                            'load-dispatches-ttd',
                            'load-broker',
                            'load-shipper',
                        ].includes(this._template)
                    ) {
                        return { ...item };
                    }

                    // Image (must be before type code, because color has same prop like other dropdown pop)
                    else if (item.logoName) {
                        return { ...item };
                    }

                    // Code
                    else if (item.code && item.description) {
                        return {
                            id: item.id,
                            name: item.code.concat(' - ', item.description),
                        };
                    }
                    // Dropdown Labels
                    else if (
                        item?.dropLabel ||
                        this.inputConfig.dropdownLabel
                    ) {
                        return { ...item };
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
                .find((item) => {
                    // Dropdown Label
                    if (
                        (item?.dropLabel || this.inputConfig.dropdownLabel) &&
                        selectedItem.substring(
                            0,
                            selectedItem.lastIndexOf(' ')
                        ) === item?.name.toLowerCase()
                    ) {
                        return item;
                    }

                    // Dropdown Load Dispatcher, Broker
                    if (
                        [
                            'load-broker',
                            'load-dispatcher',
                            'load-shipper',
                        ].includes(this._template) &&
                        selectedItem
                            ?.toLowerCase()
                            .includes(item?.name?.toLowerCase())
                    ) {
                        return item;
                    }
                    // Dropdown Load Dispatches
                    if (
                        this._template === 'load-dispatches-ttd' &&
                        selectedItem
                            ?.toLowerCase()
                            .includes(
                                item?.trailer?.trailerNumber.toLowerCase()
                            ) &&
                        selectedItem
                            ?.toLowerCase()
                            .includes(item?.truck?.truckNumber.toLowerCase()) &&
                        selectedItem
                            ?.toLowerCase()
                            .includes(
                                item?.driver?.firstName
                                    .concat(' ', item?.driver?.lastName)
                                    .toLowerCase()
                            )
                    ) {
                        return item;
                    }

                    // Default
                    if (
                        !this.inputConfig.dropdownLabel &&
                        this._template !== 'load-dispatches-ttd' &&
                        selectedItem?.toLowerCase() === item?.name.toLowerCase()
                    ) {
                        return item;
                    }
                });

            // MultiSelect Dropdown
            if (this.inputConfig.multiselectDropdown) {
                this.onMultiselectSelect(existItem);
            }
            // Normal Dropdown
            else {
                // Dropdown labels option selected
                if (this.inputConfig.dropdownLabel) {
                    if (this.labelMode === 'Label') {
                        this._activeItem = existItem;
                        this.getSuperControl.setValue(existItem.name);
                        this._options = this.originalOptions;
                        this.selectedItem.emit(existItem);
                        this.inputRef.dropdownToggler = false;
                        this.inputRef.focusInput = false;
                        this.inputRef.input.nativeElement.blur();
                    }

                    if (this.labelMode === 'Color') {
                        this.activeItemColor = existItem;

                        this.selectedItemColor.emit(this.activeItemColor);
                    }
                }
                // Normal
                else {
                    this.getSuperControl.setValue(existItem?.name);
                    this.selectedItem.emit(existItem);
                    this._activeItem = existItem;
                    this.inputRef.focusInput = false;
                    this.inputRef.input.nativeElement.blur();
                }
            }
            this.popoverRef.close();
        }
    }

    private search(searchText: string): void {
        // Single Dropdown
        if (
            ![
                'groups',
                'load-broker-contact',
                'fuel-franchise',
                'load-dispatches-ttd',
            ].includes(this._template)
        ) {
            if (
                searchText?.length &&
                this.getSuperControl.value &&
                this._activeItem?.name !== this.getSuperControl.value
            ) {
                this._options = this.originalOptions.filter((item) =>
                    item.name
                        ? item.name
                              .toLowerCase()
                              .includes(searchText.toLowerCase())
                        : item.code
                          ? item.code
                                .concat(' - ', item.description)
                                .toLowerCase()
                                .includes(searchText.toLowerCase())
                          : searchText.toLowerCase()
                );

                if (!this._options.length) {
                    this.getSuperControl.setErrors({ invalid: true });
                    this.inputConfig.isInvalidSearchInDropdown = true;
                } else {
                    this.getSuperControl.setErrors(null);
                    this.inputConfig.isInvalidSearchInDropdown = false;
                }

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

                if (!this._options.length) {
                    if (
                        this._template === 'svgtext-dispatch-template' &&
                        !this.inputConfig.isDispatchLocationDropdown
                    ) {
                        this._options.push({
                            id: 7655,
                            name: 'ADD NEW',
                        });
                    }

                    this._options.push({
                        id: 7654,
                        name: 'No Results',
                    });

                    this.inputConfig = {
                        ...this.inputConfig,
                        hideAllItemsInInputDropdown: true,
                    };

                    if (
                        (this.inputConfig.name === 'Address' ||
                            this.inputConfig.name === 'RoutingAddress') &&
                        this.inputRef.focusInput
                    ) {
                        this.popoverRef?.open();
                    }
                }
            } else {
                this._options = this.originalOptions;
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

                this.inputConfig = {
                    ...this.inputConfig,
                    hideAllItemsInInputDropdown: false,
                };
            }
        }
        // Group Dropdown Items
        else {
            if (
                searchText?.length &&
                this.getSuperControl.value?.toLowerCase()
            ) {
                if (this._template === 'groups') {
                    this._options = this.originalOptions
                        .map((element) => {
                            const filteredGroups = element.groups.filter(
                                (subElement) =>
                                    subElement.name
                                        .toLowerCase()
                                        .includes(searchText.toLowerCase())
                            );
                            return {
                                ...element,
                                groups: filteredGroups,
                                items: filteredGroups,
                            };
                        })
                        .filter((item) => item.groups.length);
                    if (!this._options.length) {
                        this._options.push({
                            items: [
                                {
                                    id: 7654,
                                    name: 'No Results',
                                },
                            ],
                            groups: [
                                {
                                    id: 7654,
                                    name: 'No Results',
                                },
                            ],
                        });
                    }
                }

                if (this._template === 'load-broker-contact') {
                    this._options = this.originalOptions.map((element) => {
                        return {
                            ...element,
                            contacts: element?.contacts?.filter(
                                (subElement) => {
                                    return subElement?.fullName
                                        .toLowerCase()
                                        .includes(searchText?.toLowerCase());
                                }
                            ),
                        };
                    });
                }

                if (this._template === 'fuel-franchise') {
                    this._options = this.originalOptions.map((element) => {
                        return {
                            ...element,
                            stores: element?.stores?.filter((subElement) =>
                                subElement.name
                                    .toString()
                                    .toLowerCase()
                                    .includes(searchText.toLowerCase())
                            ),
                        };
                    });
                }

                if (this._template === 'load-dispatches-ttd') {
                    this._options = this.originalOptions.filter((item) => {
                        if (
                            item.fullName
                                ?.toLowerCase()
                                .includes(searchText.toLowerCase())
                        ) {
                            return item;
                        }
                    });

                    if (!this._options.length) {
                        this._options.push({
                            id: 7654,
                            name: 'No Results',
                        });
                    }
                }
            } else {
                this._options = this.originalOptions;
            }
        }
    }

    /**
     * Navigate through dropdown with keyboard arrows
     */
    private dropdownNavigation(step: number) {
        this.dropdownPosition += step;

        if (this.dropdownPosition > this._options.length - 1) {
            this.dropdownPosition = 0;
        }

        if (this.dropdownPosition < 0) {
            this.dropdownPosition = this._options.length - 1;
        }

        let cssClass = 'dropdown-option-hovered';
        let dropdownContainer: any = $('.dropdown-options');
        let dropdownOption: any = $('.dropdown-option');

        let elOffset =
            dropdownOption.height() * this.dropdownPosition +
            (this.dropdownPosition !== 0 ? this.dropdownPosition * 6 : 0);

        let viewport =
            dropdownContainer.scrollTop() + dropdownContainer.height();

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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        clearTimeout(this.clearTimeoutDropdown);
    }
}
