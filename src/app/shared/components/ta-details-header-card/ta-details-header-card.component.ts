import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormsModule,
    UntypedFormControl,
    ReactiveFormsModule,
} from '@angular/forms';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

// enums
import { eGeneralActions, eStringPlaceholder } from '@shared/enums';

// pipes
import { DetailsActiveItemPipe } from '@shared/pipes/details-active-item.pipe';

// configs
import { DetailsHeaderCardInputConfig } from '@shared/components/ta-details-header-card/utils/configs';

// svg routes
import { DetailsHeaderCardSvgRoutes } from '@shared/components/ta-details-header-card/utils/svg-routes';

// components
import { TaDetailsDropdownComponent } from '@shared/components/ta-details-dropdown/ta-details-dropdown.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { CaInputDropdownComponent } from 'ca-components';

// interfaces
import { IAdditionalChangeEvent } from '@shared/components/ta-details-header-card/interfaces/additional-change-event.interface';

@Component({
    selector: 'app-ta-details-header-card',
    templateUrl: './ta-details-header-card.component.html',
    styleUrls: ['./ta-details-header-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        // modules
        CommonModule,
        NgbPopoverModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,

        // components
        TaAppTooltipV2Component,
        CaInputDropdownComponent,
        TaDetailsDropdownComponent,

        // pipes
        DetailsActiveItemPipe,
    ],
})
export class TaDetailsHeaderCardComponent<T> {
    @Input() public customPinnedSvg: string;
    @Input() public cardDetailsDate: any;
    @Input() public cardDetailsDateTerminated: string;
    @Input() public tooltipNext: string;
    @Input() public tooltipPrevious: string;
    @Input() public searchName: string;
    @Input() public options: T[] = [];
    @Input() public statusInactive: number = 1;
    @Input() public searchInputName: string;
    @Input() public hasArrow: boolean;
    @Input() public optionsId: number;
    @Input() public sortOptions: string;
    @Input() public currentName: string;
    @Input() public deactivate?: string;
    @Input() public owner?: string;
    @Input() public ownerName?: string;
    @Input() public dateChecked: string;
    @Input() public haveDropSVG: boolean;
    @Input() public dateClosed: string;

    @Input() public hasMultipleInputs?: boolean;
    @Input() public optionsSecondInput?: T[] = [];
    @Input() public secondCurrentName?: string;
    @Input() public isFirstFuelStopStoreInList?: boolean;
    @Input() public isLastFuelStopStoreInList?: boolean;

    @Output() public dropActions = new EventEmitter<T>();
    @Output() public selectValue = new EventEmitter<T>();
    @Output() public changeEvent = new EventEmitter<string>();
    @Output() public changeEventAdditional =
        new EventEmitter<IAdditionalChangeEvent>();

    @Output() selectValueStore = new EventEmitter<T>();

    public inputFormControl: UntypedFormControl = new UntypedFormControl();

    public isDropdownItemSelected: boolean = false;
    public isAdditionalDropdownItemSelected: boolean = false;

    public hasTooltip: boolean = true;

    public selectedDropdownItem: T;
    public selectedAdditionalDropdownItem: T;

    // configs
    public detailsHeaderCardInputConfig = DetailsHeaderCardInputConfig;

    // svg routes
    public detailsHeaderCardSvgRoutes = DetailsHeaderCardSvgRoutes;

    // enums
    public eGeneralActions = eGeneralActions;
    public eStringPlaceholder = eStringPlaceholder;

    constructor(private cdRef: ChangeDetectorRef) {}

    public showTooltip(isDisplayTooltip: boolean): void {
        this.hasTooltip = isDisplayTooltip;

        this.cdRef.detectChanges();
    }

    public onPreviousNextAction(
        action: string,
        isAdditionalDropdownAction: boolean = false
    ): void {
        if (isAdditionalDropdownAction) {
            const emitAction = { action, isAdditionalDropdownAction };

            this.changeEventAdditional.emit(emitAction);

            this.isAdditionalDropdownItemSelected = false;

            return;
        }

        this.isDropdownItemSelected = false;

        this.changeEvent.emit(action);
    }

    public onPickItem(): void {
        if (this.options.length > 1) {
            this.isDropdownItemSelected = true;
        }
    }

    public onPickSecondInput(): void {
        if (this.optionsSecondInput.length > 1) {
            this.isAdditionalDropdownItemSelected = true;
        }
    }

    public onSelectItem(value: any): void {
        if (this.options.length > 1) {
            this.selectedDropdownItem = value;

            this.isDropdownItemSelected = !this.isDropdownItemSelected;
            this.selectValue.emit(value);
        }
    }

    public onSelectSecondItem(value: T): void {
        if (this.optionsSecondInput.length > 1) {
            this.selectedAdditionalDropdownItem = value;

            this.isAdditionalDropdownItemSelected =
                !this.isAdditionalDropdownItemSelected;

            this.selectValueStore.emit(value);
        }
    }

    public dropAct(action: any) {
        this.dropActions.emit(action);
    }
}
