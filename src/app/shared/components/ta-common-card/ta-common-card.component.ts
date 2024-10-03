import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import {
    animate,
    style,
    transition,
    trigger,
    state,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// moment
import moment from 'moment';

// bootstrap
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

// animations
import { cardComponentAnimation } from '@shared/animations/card-component.animation';

// services
import { DetailsDataService } from '@shared/services/details-data.service';

//components 
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaDetailsDropdownComponent } from '@shared/components/ta-details-dropdown/ta-details-dropdown.component';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
    selector: 'app-ta-common-card',
    templateUrl: './ta-common-card.component.html',
    styleUrls: ['./ta-common-card.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TaAppTooltipV2Component,
        TaDetailsDropdownComponent,
        AngularSvgIconModule,
        NgbModule,
        NgbPopoverModule,
    ],
    animations: [
        cardComponentAnimation('showHideCardBody'),
        trigger('cardOpenAnimation', [
            state(
                'true',
                style({
                    height: '*',
                    //overflow: 'hidden',
                    opacity: 1,
                })
            ),
            state(
                'false',
                style({
                    height: '0px',
                    //overflow: 'hidden',
                    opacity: 0,
                })
            ),
            transition('false <=> true', [animate('200ms ease-in-out')]),
            transition('true <=> false', [animate('200ms ease-in-out')]),
        ]),
        trigger('footerOpenAnimation', [
            state(
                'true',
                style({
                    height: '*',
                    overflow: 'hidden',
                    opacity: 1,
                })
            ),
            state(
                'false',
                style({
                    height: '0px',
                    overflow: 'hidden',
                    opacity: 0,
                })
            ),
            transition('false <=> true', [animate('200ms ease-in-out')]),
            transition('true <=> false', [animate('200ms ease-in-out')]),
        ]),
        trigger('cardAppearanceAnimation', [
            transition(':enter', [
                style({ 'max-height': '0px', overflow: 'hidden' }),
                animate(
                    '200ms ease',
                    style({ 'max-height': '170px', overflow: 'hidden' })
                ),
            ]),
            transition(':leave', [
                animate('200ms ease', style({ 'max-height': 0 })),
            ]),
        ]),
    ],
})
export class TaCommonCardComponent implements OnInit {
    @Input() public cardNameCommon: string;
    @Input() public cardDocumentCounter: number;
    @Input() public isCardOpen: boolean = true;
    @Input() public forcedOpen: boolean = false;
    @Input() public hasSvg: string = '';
    @Input() public options: any = [];
    @Input() public hasCopyIcon: boolean = false;
    @Input() public expDateClose: any;
    @Input() public voidedDate: any;
    @Input() public hasFooter: boolean = true;
    @Input() public settingsIcon: boolean = false;
    @Input() public haveHeaderText: boolean = false;
    @Input() public haveDots: boolean = true;
    @Output() resizePage = new EventEmitter<boolean>();
    @Input() public animationsDisabled = false;
    @Input() public stateNameShort: string = '';
    @Input() public stateNameLong: string = '';
    @Input() public optionsId: number;
    @Input() public shortName: string = '';
    @Input() public stateTooltipName: string = '';
    @Input() public cardSecondName: string = '';
    @Input() public cardSecondResult: string = '';
    @Input() public cardResult: boolean = false;
    @Output() public dropActions = new EventEmitter<any>();
    @Input() public weeklyWidth: string = '';
    @Input() public setPositionDrop: boolean;
    @Input() isDeactivated: any;
    @Input() noteIcons: string = '';
    @Input() cardNameCurrent: string;
    @Input() statusActive: number;
    @Input() paddingDots: string = '8px 8px 0px 0px';
    @Output() clickedCard = new EventEmitter<any>();
    @Output() preloadData = new EventEmitter<any>();
    @Input() hasToggler: boolean;
    @Input() public testDate: any;
    @Input() public mainData: any;
    @Input() public insuranceCard: boolean = false;
    @Input() public notExpired: boolean = true;
    @Input() public openCloseStatus: boolean = true;
    public data: any;
    public resPage: boolean = false;
    public copiedCommon: boolean = false;
    animationStarted: boolean = true;

    @Output() isCardOpenEmitter = new EventEmitter<{
        isCardOpen: boolean;
        id: number;
    }>();
    public isDropdownVisible: boolean;

    constructor(
        private clipboard: Clipboard,
        private DetailsDataService: DetailsDataService
    ) {}

    ngOnInit(): void {
        this.CloseCard();
    }

    private isCardOpenEmit(isCardOpen: boolean, id: number): void {
        this.isCardOpenEmitter.emit({ isCardOpen, id });
    }

    public CloseCard() {
        let currentDate = moment().format('MM/DD/YYYY');
        if (
            (moment(this.expDateClose).isBefore(currentDate) ||
                this.isDeactivated) &&
            !this.forcedOpen
        ) {
            this.isCardOpen = false;
            this.animationStarted = false;
        }
    }

    public sendData(data: any) {
        this.data = data;
        this.DetailsDataService.setCardMainTitle(this.cardNameCommon);
        if (this.mainData?.id) {
            this.DetailsDataService.setCdlId(this.mainData.id);
        }

        if (this.preloadData) {
            this.preloadData.emit(data);
        }
    }
    public toggleCard(event: any) {
        event.preventDefault();
        event.stopPropagation();

        if (this.forcedOpen) {
            return false;
        }
        let currentDate = moment().format('MM/DD/YYYY');

        this.DetailsDataService.setCardMainTitle(this.cardNameCommon);
        if (this.mainData?.id) {
            this.DetailsDataService.setCdlId(this.mainData.id);
        }

        if (
            moment(this.expDateClose).isBefore(currentDate) ||
            this.isDeactivated ||
            this.statusActive == 0 ||
            this.hasToggler ||
            (this.notExpired && this.openCloseStatus)
        ) {
            if (this.isCardOpen) {
                this.animationStarted = false;
            } else {
                this.animationStarted = true;
            }

            let timeOut = 0;
            if (this.isCardOpen) {
                timeOut = 200;
            }
            setTimeout(() => {
                this.isCardOpen = !this.isCardOpen;

                this.isCardOpenEmit(this.isCardOpen, this.optionsId);
            }, timeOut);
        }
    }

    public resizePageFun() {
        this.resPage = !this.resPage;
        this.resizePage.emit(this.resPage);
    }

    public clickedCardName(name: string) {
        this.clickedCard.emit(name);
    }
    /**Function for drop acitons */
    public dropAct(action: any) {
        this.dropActions.emit(action);
    }
    /* To copy any Text */
    public copyText(val: any, event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.copiedCommon = true;
        this.clipboard.copy(val);
    }

    public onPopoverVisiblityChange(isVisible: boolean): void {
        this.isDropdownVisible = isVisible;
    }

    toggleDropdown() {
        let currentDate = moment().format('MM/DD/YYYY');
        if (this.cardNameCurrent == 'registration') {
            let expDate = moment(this.mainData?.expDate).format('MM/DD/YYYY');

            this.options.actions.map((action, index) => {
                if (currentDate > expDate) {
                    if (index == 3) {
                        action.disabled = false;
                    } else if (index == 4) {
                        action.disabled = true;
                    } else if (index == 9) {
                        action.hide = true;
                    }
                } else {
                    if (index == 3) {
                        action.disabled = true;
                    } else if (index == 4) {
                        action.disabled = false;
                    } else if (index == 9) {
                        action.hide = false;
                    }
                }
            });
        } else if (this.cardNameCurrent == 'truckRegistration') {
            let expDate = moment(this.mainData?.expDate).format('MM/DD/YYYY');
            this.options.actions.map((action, index) => {
                if (currentDate > expDate) {
                    if (index == 3) {
                        action.disabled = false;
                    } else if (index == 4) {
                        action.disabled = true;
                    } else if (index == 9) {
                        action.hide = true;
                    }
                } else {
                    if (index == 3) {
                        action.disabled = true;
                    } else if (index == 4) {
                        action.disabled = false;
                    } else if (index == 9) {
                        action.hide = false;
                    }
                }
            });
        } else if (this.cardNameCurrent == 'cdl') {
            let endDate = moment(this.mainData.expDate);
            let daysDiff = endDate.diff(moment(), 'days');

            this.options.actions.map((action, index) => {
                if (index == 8) {
                    if (this.mainData?.status == 0) {
                        action.title = 'Activate';
                        action.name = 'activate-item';
                        action.iconName = 'activate-item';
                        action.redIcon = false;
                        action.blueIcon = true;
                    } else {
                        action.title = 'Void';
                        action.name = 'deactivate-item';
                        action.iconName = 'deactivate-item';
                        action.redIcon = true;
                        action.blueIcon = false;
                    }
                } else if (index == 3) {
                    if (daysDiff < -365) {
                        action.disabled = true;
                    } else {
                        action.disabled = false;
                    }
                }
            });
        }
    }
}
