import {
    Component,
    Input,
    EventEmitter,
    Output,
    ElementRef,
    OnChanges,
    SimpleChanges,
    ChangeDetectorRef,
    ViewChildren,
    QueryList,
} from '@angular/core';

// modules
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// components
import { AutoclosePopoverComponent } from '../autoclose-popover/autoclose-popover.component';
import { TaCustomPeriodRangeComponent } from '../ta-custom-period-range/ta-custom-period-range.component';

// models
import { CustomPeriodRange } from '../../dashboard/state/models/custom-period-range.model';

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
export class TaTabSwitchComponent implements OnChanges {
    @ViewChildren('popoverHolder')
    autoCloseComponent: QueryList<AutoclosePopoverComponent>;

    @Input() tabs: any[];
    @Input() type: string = '';
    @Input() dashboardHeight?: boolean = false;

    @Output() switchClicked = new EventEmitter<any>();
    @Output() customPeriodRangeEmitter = new EventEmitter<any>();

    hoverStyle: any = {
        width: '0px',
        x: '0px',
    };

    indexSwitch: number = -1;

    constructor(public elem: ElementRef, public det: ChangeDetectorRef) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.tabs) {
            setTimeout(() => {
                this.setSwitchActive(changes.tabs.currentValue);
            }, 550);
        }
    }

    public setSwitchActive(tabs) {
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

    switchTab(e, indx, item) {
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

    getElementOffset(item) {
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
}
