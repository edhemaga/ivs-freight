import { FormControl } from '@angular/forms';
import {
    Component,
    Input,
    OnInit,
    EventEmitter,
    Output,
    ElementRef,
    AfterViewInit,
    ViewChild,
    OnChanges,
    SimpleChanges,
    ChangeDetectorRef,
    ViewChildren,
    QueryList,
} from '@angular/core';
import { AutoclosePopoverComponent } from '../autoclose-popover/autoclose-popover.component';

@Component({
    selector: 'app-ta-tab-switch',
    templateUrl: './ta-tab-switch.component.html',
    styleUrls: ['./ta-tab-switch.component.scss'],
})
export class TaTabSwitchComponent implements OnInit, AfterViewInit, OnChanges {
    @ViewChildren('popoverHolder')
    autoCloseComponent: QueryList<AutoclosePopoverComponent>;
    @Input() tabs: any[];
    @Input() type: string = '';
    @Output() switchClicked = new EventEmitter<any>();
    @Output() saveCustomRange = new EventEmitter<any>();
    @ViewChild('t2') t2: any;

    public date1: FormControl = new FormControl();
    public date2: FormControl = new FormControl();
    tooltip: any;

    switchItems: any[] = [
        {
            name: 'Day',
        },
        {
            name: 'Week',
        },
        {
            name: 'Month',
        },
        {
            name: 'Year',
        },
        {
            name: 'Schedule',
        },
    ];

    hoverStyle: any = {
        width: '0px',
        x: '0px',
    };

    indexSwitch: number = 0;
    data1Valid: boolean;
    data2Valid: boolean;

    constructor(public elem: ElementRef, public det: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.date1.valueChanges.subscribe((data) => {
            this.data1Valid = data!!;
        });

        this.date2.valueChanges.subscribe((data) => {
            this.data2Valid = data!!;
        });
    }

    clearFields() {
        this.date1.reset();
        this.date1.updateValueAndValidity();
        this.date2.reset();
        this.date2.updateValueAndValidity();
    }

    setCustomRange(e) {
        if (this.data1Valid && this.data2Valid) {
            let rangeData = [];
            rangeData.push(this.data1Valid, this.data2Valid);
            this.saveCustomRange.emit(rangeData);
            this.closeCustomPopover(e);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.tabs) {
            setTimeout(() => {
                this.setSwitchActive(changes.tabs.currentValue);
            }, 550);
        }
    }

    ngAfterViewInit() {}

    public setSwitchActive(tabs) {
        const selectedIndex = tabs?.findIndex((item) => item.checked && !item.disabled);
        //if( selectedIndex == -1 ) return;
        this.indexSwitch = selectedIndex == -1 ? 0 : selectedIndex;

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

    closeCustomPopover = (e) => {
        e.stopPropagation();
        const closeComponentArray = this.autoCloseComponent.toArray().reverse();
        closeComponentArray[0].tooltip.close();
    };
}
