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
import {
    animate,
    style,
    transition,
    trigger,
    state,
} from '@angular/animations';
import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgZone } from '@angular/core';

// modules
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { Options } from '@popperjs/core/lib/popper';

import { Subject, takeUntil } from 'rxjs';

// icon
import { AngularSvgIconModule } from 'angular-svg-icon';

// service
import { DetailsDataService } from '@shared/services/details-data.service';

@Component({
    selector: 'app-ta-details-dropdown',
    templateUrl: './ta-details-dropdown.component.html',
    styleUrls: ['./ta-details-dropdown.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AngularSvgIconModule,
        NgbPopoverModule,
    ],
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
                style({ height: '10px' }),
                animate('150ms ease', style({ height: '26px' })),
            ]),
            transition(':leave', [animate('150ms ease', style({ height: 0 }))]),
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
export class TaDetailsDropdownComponent
    implements OnInit, OnChanges, OnDestroy
{
    private destroy$ = new Subject<void>();

    @Input() options: any;
    @Input() id: number;
    @Input() customClassDropDown: string;
    @Input() hasVericalDots: boolean;
    @Input() data: any;
    @Input() leftIcon: any = true;
    @Input() public placement: string = 'bottom-right';
    @Output() dropDownActions: EventEmitter<any> = new EventEmitter();
    @Output() openModalAction: EventEmitter<any> = new EventEmitter();
    @Output() onPopoverVisiblityChange: EventEmitter<boolean> = new EventEmitter();
    tooltip: any;
    dropDownActive: number = -1;
    subtypeHovered: any = false;
    public isActionInProgress: boolean = false;

    constructor(
        private DetailsDataService: DetailsDataService,
        private chnd: ChangeDetectorRef,
        private ngZone: NgZone
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.options?.currentValue) {
            this.options = changes.options.currentValue;
        }

        if (changes?.id?.currentValue) {
            this.id = changes.id.currentValue;
        }
    }

    ngOnInit(): void {
        this.DetailsDataService.dropdownOpenedChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((tooltip) => {
                if (
                    this.tooltip &&
                    this.tooltip._ngbPopoverWindowId !=
                        tooltip._ngbPopoverWindowId
                ) {
                    this.tooltip.close();
                    this.dropDownActive = -1;
                }
            });
    }

    toggleDropdown(tooltip: any) {
        this.ngZone.run(() => {
            this.tooltip = tooltip;
            if (tooltip.isOpen()) {
                tooltip.close();
            } else {
                if (this.options) {
                    tooltip.open({ data: [...this.options] });
                }
                if (this.data) {
                    this.DetailsDataService.setNewData(this.data);
                }
                this.DetailsDataService.dropdownOpened(this.tooltip);
            }

            this.dropDownActive = tooltip.isOpen() ? this.id : -1;
            this.chnd.detectChanges();
        });

        
        this.onPopoverVisiblityChange.emit(true);
    }

    /**Function retrun id */
    public identity(index: number, item: any): number {
        return item.id;
    }
    onAction(action: any, event?: any) {
        if (this.isActionInProgress) return;

        this.isActionInProgress = true;

        event.stopPropagation();
        event.preventDefault();

        if (action.disabled) {
            this.enableNewAction();
            return false;
        }

        this.dropDownActions.emit({
            id: this.id,
            data: this.data,
            type: action.name,
        });

        this.enableNewAction();
        this.tooltip.close();
    }

    private enableNewAction(): void {
        setTimeout(() => {
            this.isActionInProgress = false;
        }, 300);
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

        this.onPopoverVisiblityChange.emit(false);
    }

    popperOptions = (options: Partial<Options>) => {
        // add your own modifier
        options.modifiers?.push({
            name: 'custom',
            enabled: true,
            phase: 'main',
            effect: ({ state, instance }) => {
                const observer = new ResizeObserver(() => instance.update());
                observer.observe(state.elements!.reference as any);
                return () => {
                    observer.disconnect();
                };
            },
            fn: () => {},
        });

        return options;
    };

    ngOnDestroy() {
        this.tooltip?.close();
    }
}
