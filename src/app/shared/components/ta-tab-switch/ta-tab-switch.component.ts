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
    AfterViewChecked,
} from '@angular/core';

// modules
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// components
import { TaAutoclosePopoverComponent } from '@shared/components/ta-autoclose-popover/ta-autoclose-popover.component';
import { TaCustomPeriodRangeComponent } from '@shared/components/ta-custom-period-range/ta-custom-period-range.component';

// models
import { Tabs } from '@shared/models/tabs.model';
import { CustomPeriodRange } from '@shared/models/custom-period-range.model';
import { DropdownListItem } from '@pages/dashboard/models/dropdown-list-item.model';

@Component({
    selector: 'app-ta-tab-switch',
    templateUrl: './ta-tab-switch.component.html',
    styleUrls: ['./ta-tab-switch.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        NgbModule,
        TaAutoclosePopoverComponent,
        TaCustomPeriodRangeComponent,
    ],
})
export class TaTabSwitchComponent implements AfterViewChecked, OnChanges {
    @ViewChildren('popoverHolder')
    autoCloseComponent: QueryList<TaAutoclosePopoverComponent>;
    _tabs: Tabs[];

    @Input() set tabs(tabList: Tabs[]) {
        this._tabs = tabList;
    }

    @Input() type: string = '';
    @Input() dashboardHeight?: boolean = false;
    @Input() subPeriodDropdownList?: DropdownListItem[] = [];
    @Input() selectedSubPeriod?: DropdownListItem;
    @Input() clearCustomPeriodRangeValue?: boolean = false;
    @Input() isDisabled?: boolean = false;
    @Input() isBold: boolean = false;
    @Input() isMarginTopDisabled: boolean = false;

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

    get tabs() {
        return this._tabs;
    }

    ngOnChanges() {
        this.setSwitchActive(this.tabs);
    }

    ngAfterViewChecked() {
        this.setSwitchActive(this.tabs);
        this.det.detectChanges();
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

        this.tabs.map((tab) => {
            if (tab.id === item.id) tab.checked = true;
            else tab.checked = false;
        });

        this.hoverStyle = this.getElementOffset(e.target);

        const closeComponentArray = this.autoCloseComponent.toArray().reverse();
        if (
            item.name != 'Custom' &&
            closeComponentArray[0]?.tooltip?.isOpen()
        ) {
            closeComponentArray[0].tooltip.close();
        }
        this.switchClicked.emit(item);
        this.det.detectChanges();
    }

    private getElementOffset(item): { x: number; width: string } {
        const parentElement = item?.closest('.tab-switch-holder');
        const selectedElement = item?.closest('.tab-switch-items-holder');

        const parentItem = parentElement?.getBoundingClientRect();
        const elementItem = selectedElement?.getBoundingClientRect();

        return {
            x: elementItem?.x - parentItem?.x,
            width: elementItem?.width,
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
