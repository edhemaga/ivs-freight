import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormsModule,
    UntypedFormControl,
    ReactiveFormsModule,
} from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

// pipes
import { DetailsActiveItemPipe } from 'src/app/shared/pipes/details-active-item.pipe';

// store
import { DriversMinimalListQuery } from 'src/app/pages/driver/state/driver-details-minimal-list-state/driver-minimal-list.query';
import { DriversItemStore } from 'src/app/pages/driver/state/driver-details-state/driver-details.store';

// compoents
import { TaAppTooltipComponent } from '../ta-app-tooltip/ta-app-tooltip.component';
import { TaInputDropdownComponent } from '../ta-input-dropdown/ta-input-dropdown.component';
import { TaDetailsDropdownComponent } from '../ta-details-dropdown/ta-details-dropdown.component';

@Component({
    selector: 'app-ta-details-header-card',
    templateUrl: './ta-details-header-card.component.html',
    styleUrls: ['./ta-details-header-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TaAppTooltipComponent,
        AngularSvgIconModule,
        DetailsActiveItemPipe,
        TaInputDropdownComponent,
        TaDetailsDropdownComponent,
        NgbPopoverModule,
        NgbModule,
    ],
})
export class TaDetailsHeaderCardComponent implements OnInit, OnChanges {
    @Input() public customPinnedSvg: string = '';
    @Input() public cardDetailsName: string = '';
    @Input() public cardDetailsDate: any;
    @Input() public cardDetailsDateTerminated: string = null;
    @Input() public hasSvgHeader: string = '';
    @Input() public tooltipNext: string = '';
    @Input() public tooltipPrevious: string = '';
    @Input() public searchName: string = '';
    @Input() public options: any = [];
    @Input() public optionsSecondInput: any = [];
    @Input() public optionsDrop: any = [];
    @Input() public statusInactive: number = 1;
    @Input() public haveTwoInput: boolean;
    @Input() public searchInputName: string;
    @Input() public hasArrow: boolean;
    @Input() public optionsId: number;
    @Input() public sortOptions: string;
    @Input() public currentName: string;
    @Input() public deactivate?: string;
    @Input() public owner?: string;
    @Input() public ownerName?: string;
    @Output() public dropActions = new EventEmitter<any>();
    @Output() selectValue = new EventEmitter<string>();
    @Output() selectValueStore = new EventEmitter<string>();
    @Output() changeEvent = new EventEmitter<string>();
    @Input() public dateChecked: string = '';
    @Input() public lastEdit: string = '';
    @Input() public haveDropSVG: boolean;
    @Input() public repairHeader: boolean;
    public inputFormControl: UntypedFormControl = new UntypedFormControl();
    public driversList: any[] = this.driverMinimalQuery.getAll();
    public selectedDropdown: boolean = false;
    public selectedDropdownSecond: boolean = false;
    public hideLeftArrow: boolean;
    public hideRightArrow: boolean;
    public driverId: number = this.driverItemStore.getValue().ids[0];
    showDropdownTooltip: boolean = true;
    constructor(
        private driverItemStore: DriversItemStore,
        private driverMinimalQuery: DriversMinimalListQuery,
        private cdRef: ChangeDetectorRef
    ) {}
    ngOnChanges(changes: SimpleChanges) {}
    ngOnInit(): void {
        // this.hideArrowOnStart(this.driverId);
    }
    showTooltip(e: boolean) {
        this.showDropdownTooltip = e;

        this.cdRef.detectChanges();
    }
    public hideArrowOnStart(id: number) {
        let last = this.options.at(-1);
        let first = this.options.at(0);

        if (first.id == id) {
            this.hideLeftArrow = true;
        } else {
            this.hideLeftArrow = false;
        }
        if (last.id == id) {
            this.hideRightArrow = true;
        } else {
            this.hideRightArrow = false;
        }
    }
    public onAction(action: string) {
        // let currentIndex = this.driversList.findIndex(
        //   (driver) => driver.id === this.driverItemStore.getValue().ids[0]
        // );
        // if (action === 'next') {
        //   currentIndex = ++currentIndex;
        //   this.hideArrowOnStart(this.driversList[currentIndex].id);
        // } else {
        //   currentIndex = --currentIndex;
        //   this.hideArrowOnStart(this.driversList[currentIndex].id);
        // }
        this.selectedDropdown = false;
        this.changeEvent.emit(action);
    }

    public onPickItem(): void {
        if (this.options.length > 1) {
            this.selectedDropdown = true;
        }
    }

    public onPickSecondInput(): void {
        if (this.optionsSecondInput.length > 1) {
            this.selectedDropdownSecond = true;
        }
    }
    public onSelectItem(value: any) {
        if (this.optionsSecondInput.length > 1) {
            this.selectedDropdownSecond = !this.selectedDropdownSecond;
            this.selectValueStore.emit(value);
        }
    }
    public onSelecItem(value: any): void {
        if (this.options.length > 1) {
            this.selectedDropdown = !this.selectedDropdown;
            this.selectValue.emit(value);
        }
    }

    public dropAct(action: any) {
        this.dropActions.emit(action);
    }
}
