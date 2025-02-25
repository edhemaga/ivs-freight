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

// modules
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

// pipes
import { DetailsActiveItemPipe } from '@shared/pipes/details-active-item.pipe';

// compoents
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaDetailsDropdownComponent } from '@shared/components/ta-details-dropdown/ta-details-dropdown.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

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
        TaInputDropdownComponent,
        TaDetailsDropdownComponent,

        // pipes
        DetailsActiveItemPipe,
    ],
})
export class TaDetailsHeaderCardComponent {
    @Input() public customPinnedSvg: string = '';
    @Input() public cardDetailsDate: any;
    @Input() public cardDetailsDateTerminated: string = null;
    @Input() public tooltipNext: string = '';
    @Input() public tooltipPrevious: string = '';
    @Input() public searchName: string = '';
    @Input() public options: any = [];
    @Input() public statusInactive: number = 1;
    @Input() public additionalTitle: boolean;
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

    @Output() public dropActions = new EventEmitter<any>();
    @Output() selectValue = new EventEmitter<string>();
    @Output() changeEvent = new EventEmitter<string>();

    public inputFormControl: UntypedFormControl = new UntypedFormControl();

    public selectedDropdown: boolean = false;

    public showDropdownTooltip: boolean = true;

    public activeItem: any;

    constructor(private cdRef: ChangeDetectorRef) {}

    public showTooltip(e: boolean) {
        this.showDropdownTooltip = e;

        this.cdRef.detectChanges();
    }

    public onAction(action: string) {
        this.selectedDropdown = false;

        this.changeEvent.emit(action);
    }

    public onPickItem(): void {
        if (this.options.length > 1) {
            this.selectedDropdown = true;
        }
    }

    public onSelectItem(value: any): void {
        if (this.options.length > 1) {
            this.activeItem = value;

            this.selectedDropdown = !this.selectedDropdown;
            this.selectValue.emit(value);
        }
    }

    public dropAct(action: any) {
        this.dropActions.emit(action);
    }
}
