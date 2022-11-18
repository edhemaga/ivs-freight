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
    ChangeDetectorRef,
} from '@angular/core';
import { DetailsDataService } from '../../../services/details-data/details-data.service';
import {
    animate,
    style,
    transition,
    trigger,
    state,
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
                    '100ms cubic-bezier(0, 0, 0.60, 1.99)',
                    style({ height: '26px', overflow: 'auto' })
                ),
            ]),
            transition(':leave', [
                animate(
                    '100ms cubic-bezier(0.68, -0.6, 0.32, 1.6)',
                    style({ height: 0 })
                ),
            ]),
        ]),
        trigger('hideAnimation', [
            transition(':enter', [
                style({ height: '26px', overflow: 'hidden' }),
                animate(
                    '100ms ease',
                    style({ height: '10px', overflow: 'auto' })
                ),
            ]),
            transition(':leave', [animate('300ms ease', style({ height: 0 }))]),
        ]),
        trigger('borderShowAnimation', [
            transition(':enter', [
                style({ height: '0px', opacity: 0 }),
                animate('100ms ease', style({ height: '*', opacity: 1 })),
            ]),
            transition(':leave', [animate('300ms ease', style({ height: 0 }))]),
        ]),
        trigger('showAnimation2', [
            state(
                'true',
                style({
                    height: '26px',
                    overflow: 'hidden'
                })
            ),
            state(
                'false',
                style({
                    height: '10px',
                    overflow: 'auto'
                })
            ),
            state(
                'null',
                style({
                    height: '10px',
                    overflow: 'hidden',
                })
            ),
            transition('false <=> true', [
                animate('0.2s cubic-bezier(0, 0, 0.60, 1.99)'),
            ]),
            transition('true <=> false', [animate('0.1s ease')]),
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
    isAnimated: any = false;
    isOpened: any = false;

    constructor(
        private DetailsDataService: DetailsDataService,
        private ref: ChangeDetectorRef
    ) {}

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
            
            setTimeout(()=>{
                this.isOpened = true;
            }, 1)
            
            tooltip.open({ data: this.dropContent });
            if (this.data) {
                this.DetailsDataService.setNewData(this.data);
            }
        }

        if ( tooltip.isOpen() ) {
            this.dropDownActive = this.id;
        }
        //this.dropDownActive = tooltip.isOpen() ? this.id : -1;
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
        
        console.log('---this.dropDownActive---1', this.dropDownActive);
        if (!this.isOpened) {
            return false;
        }
        
        if (!this.isAnimated) {
            this.isAnimated = true;
            this.ref.detectChanges();
            this.tooltip.open();
        }
        console.log('---this.dropDownActive---2', this.dropDownActive);
        setTimeout(()=>{
            this.isOpened = false;
        }, 1);
        
        let mainElementHolder = document.querySelector(
            '.details-dropdown-body'
        );
        mainElementHolder?.classList.add('closeAnimation');

        
        console.log('---this.dropDownActive---3', this.dropDownActive);
        setTimeout(() => {
            this.tooltip.close();
            console.log('---this.dropDownActive---4', this.dropDownActive);
            this.isAnimated = false;
            this.options.map((item) => {
                item['openSubtype'] = false;
            });
        }, 200);
    }
}
