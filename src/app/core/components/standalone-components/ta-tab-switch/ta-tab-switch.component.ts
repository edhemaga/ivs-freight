import {
    Component,
    Input,
    EventEmitter,
    Output,
    ElementRef,
    OnChanges,
    ChangeDetectorRef,
    ViewChildren,
    QueryList,
    AfterViewInit,
} from '@angular/core';

// modules
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// components
import { AutoclosePopoverComponent } from '../autoclose-popover/autoclose-popover.component';
import { TaCustomPeriodRangeComponent } from '../ta-custom-period-range/ta-custom-period-range.component';

// models
import { CustomPeriodRange } from '../../dashboard/state/models/custom-period-range.model';
import { DropdownListItem } from '../../dashboard/state/models/dropdown-list-item.model';
import { Tabs } from '../../shared/model/modal-tabs';

@Component({
    selector: 'app-ta-tab-switch',
    templateUrl: './ta-tab-switch.component.html',
    styleUrls: ['./ta-tab-switch.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        NgbModule,
        AutoclosePopoverComponent,
        TaCustomPeriodRangeComponent,
    ],
})
export class TaTabSwitchComponent implements AfterViewInit {
    @ViewChildren('popoverHolder')
    autoCloseComponent: QueryList<AutoclosePopoverComponent>;

    @Input() tabs: Tabs[];
    @Input() type: string = '';
    @Input() dashboardHeight?: boolean = false;
    @Input() subPeriodDropdownList?: DropdownListItem[] = [];
    @Input() selectedSubPeriod?: DropdownListItem;
    @Input() clearCustomPeriodRangeValue?: boolean = false;

    @Output() switchClicked = new EventEmitter<any>();
    @Output() customPeriodRangeEmitter = new EventEmitter<CustomPeriodRange>();
    @Output() customPeriodRangeSubperiodEmitter = new EventEmitter<number>();
    @Output() popoverClosedEmitter = new EventEmitter();

    public hoverStyle: any = {
        width: '0px',
        x: '0px',
    };

    public indexSwitch: number = -1;

    constructor(public elem: ElementRef, public det: ChangeDetectorRef) {}

    ngAfterViewInit() {
        setTimeout(() => {
            this.setSwitchActive(this.tabs);
        }, 550);
    }

    public setSwitchActive(tabs): void {
        const selectedIndex = tabs?.findIndex(
            (item) => item.checked && !item.disabled
        );
        this.indexSwitch = selectedIndex;
        if (selectedIndex == -1) return;

        this.hoverStyle = this.getElementOffset(
            this.elem.nativeElement.children[0].children[this.indexSwitch]
        );

        this.det.detectChanges();
    }
    public switchTab(e, indx, item): void {
        e.stopPropagation();
        this.indexSwitch = indx;

        this.tabs.map((item) => (item.checked = false));
        item.checked = true;
        this.hoverStyle = this.getElementOffset(e.target);
        const closeComponentArray = this.autoCloseComponent.toArray().reverse();

        if (
            item.name != 'Custom' &&
            closeComponentArray[0]?.tooltip?.isOpen()
        ) {
            closeComponentArray[0].tooltip.close();
        }
        this.switchClicked.emit(item);
    }

    private getElementOffset(item): { x: number; width: string } {
        const parentElement = item.closest('.tab-switch-holder');
        const selectedElement = item.closest('.tab-switch-items-holder');

        const parentItem = parentElement.getBoundingClientRect();
        const elementItem = selectedElement.getBoundingClientRect();

        return {
            x: elementItem.x - parentItem.x,
            width: elementItem.width,
        };
    }

    public handleSetCustomPeriodRangeClick(
        customPeriodRange: CustomPeriodRange
    ): void {
        this.customPeriodRangeEmitter.emit(customPeriodRange);

        const closeComponentArray = this.autoCloseComponent.toArray().reverse();

        closeComponentArray[0].tooltip.close();
    }

    public handleCustomPeriodRangeSubperiodEmit(
        selectedDaysRange: number
    ): void {
        this.customPeriodRangeSubperiodEmitter.emit(selectedDaysRange);
    }

    public handlePopoverClose(): void {
        this.popoverClosedEmitter.emit();
    }
}
