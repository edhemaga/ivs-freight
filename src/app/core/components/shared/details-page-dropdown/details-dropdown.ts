import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { DetailsDataService } from '../../../services/details-data/details-data.service';
import {
    animate,
    style,
    transition,
    trigger,
    state,
    keyframes,
} from '@angular/animations';

@Component({
    selector: 'app-details-page-dropdown',
    templateUrl: './details-dropdown.html',
    styleUrls: ['./details-dropdown.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('SubtypeAnimation', [
            state(
                'true',
                style({
                    height: '*',
                    overflow: 'hidden',
                    opacity: 1,
                    'padding-bottom': '4px',
                    'padding-top': '5px',
                })
            ),
            state(
                'false',
                style({
                    height: '0px',
                    overflow: 'hidden',
                    'padding-bottom': '0px',
                    'padding-top': '0px',
                    opacity: 0,
                })
            ),
            transition('false <=> true', [animate('.1s ease-in')]),
            transition('true <=> false', [animate('.1s ease-in')]),
        ]),
        trigger('showAnimation', [
            transition(':enter', [
                style({ height: '10px', overflow: 'hidden' }),
                animate(
                    '300ms ease',
                    style({ height: '26px', overflow: 'auto' })
                ),
            ]),
            transition(':leave', [animate('300ms ease', style({ height: 0 }))]),
        ]),
        trigger('borderShowAnimation', [
            transition(':enter', [
                style({ height: '0px', opacity: 0 }),
                animate('300ms ease', style({ height: '*', opacity: 1 })),
            ]),
            transition(':leave', [animate('300ms ease', style({ height: 0 }))]),
        ]),
    ],
})
export class DetailsDropdownComponent implements OnInit, OnChanges {
    @Input() options: any;
    @Input() id: number;
    @Input() customClassDropDown: string;
    @Input() hasVericalDots: boolean;
    @Input() data: any;
    @Input() leftIcon: any = false;
    @Input() public placement: string = 'bottom-right';
    @Output() dropDownActions: EventEmitter<any> = new EventEmitter();
    @Output() openModalAction: EventEmitter<any> = new EventEmitter();
    dropContent: any[] = [];
    tooltip: any;
    dropDownActive: number = -1;
    subtypeHovered: any = false;

    constructor(private DetailsDataService: DetailsDataService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.options?.currentValue) {
            this.options = changes.options.currentValue;
            this.setDropContent();
        }

        if (changes?.id?.currentValue) {
            this.id = changes.id.currentValue;
        }
    }

    ngOnInit(): void {}

    toggleDropdown(tooltip: any) {
        this.tooltip = tooltip;
        if (tooltip.isOpen()) {
            tooltip.close();
        } else {
            tooltip.open({ data: this.dropContent });
            if (this.data) {
                this.DetailsDataService.setNewData(this.data);
            }
        }

        this.dropDownActive = tooltip.isOpen() ? this.id : -1;
    }

    setDropContent() {
        /* Drop Down Actions*/
        if (this.options.length) {
            for (let i = 0; i < this.options.length; i++) {
                this.dropContent.push(this.options[i]);
            }
        }
    }
    /**Function retrun id */
    public identity(index: number, item: any): number {
        return item.id;
    }
    onAction(action: any, event?: any) {
        event.stopPropagation();
        event.preventDefault();

        if (action.disabled) {
            return false;
        }

        this.dropDownActions.emit({
            id: this.id,
            data: this.data,
            type: action.name,
        });

        this.tooltip.close();
    }

    subTypeAction(actionData: any, action: any, event?: any) {
        event.stopPropagation();
        event.preventDefault();

        if (actionData.disabled) {
            return false;
        }

        let actionName = action.actionName;
        this.openModalAction.emit(actionName);

        this.tooltip.close();
    }

    openSubtype(indx) {
        if (this.options[indx]['openSubtype']) {
            this.options[indx]['openSubtype'] = false;
        } else {
            this.options.map((item) => {
                item['openSubtype'] = false;
            });
            this.options[indx]['openSubtype'] = true;
        }
    }

    dropdownClosed() {
        this.options.map((item) => {
            item['openSubtype'] = false;
        });
    }
}
