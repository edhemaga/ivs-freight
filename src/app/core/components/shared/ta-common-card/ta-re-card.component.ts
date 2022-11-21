import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import moment from 'moment';
import { card_component_animation } from '../animations/card-component.animations';
import { Clipboard } from '@angular/cdk/clipboard';
import { DetailsDataService } from '../../../services/details-data/details-data.service';
import {
    animate,
    style,
    transition,
    trigger,
    state,
} from '@angular/animations';
@Component({
    selector: 'app-ta-re-card',
    templateUrl: './ta-re-card.component.html',
    styleUrls: ['./ta-re-card.component.scss'],
    animations: [card_component_animation('showHideCardBody'),
    trigger('cardOpenAnimation', [
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
    trigger('footerOpenAnimation', [
        state(
            'true',
            style({
                height: '*',
                overflow: 'hidden',
                opacity: 1,
                'margin-left': '16px',
                'margin-right': '10px',
                'padding-bottom': '11px',
                'padding-top': '11px',
            })
        ),
        state(
            'false',
            style({
                height: '0px',
                overflow: 'hidden',
                opacity: 0,
                'margin-left': '0px',
                'margin-right': '0px',
                'padding-bottom': '0px',
                'padding-top': '0px',
            })
        ),
        transition('false <=> true', [animate('200ms ease-in-out')]),
        transition('true <=> false', [animate('200ms ease-in-out')]),
    ]),],
})
export class TaReCardComponent implements OnInit {
    @Input() public cardNameCommon: string;
    @Input() public cardDocumentCounter: number;
    @Input() public isCardOpen: boolean = true;
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
    @Output() public dropActions = new EventEmitter<any>();
    @Input() public weeklyWidth: string = '';
    @Input() public setPositionDrop: boolean;
    @Input() isDeactivated: any;
    @Input() noteIcons: string = '';
    @Input() cardNameCurrent: string;
    @Input() statusActive: number;
    @Input() paddingDots: string = '11px 8px 0 12px';
    @Output() clickedCard = new EventEmitter<any>();
    @Output() dataDropDopwn = new EventEmitter<any>();
    @Input() hasToggler: boolean;
    @Input() public testDate: any;
    @Input() public mainData: any;
    public data: any;
    public resPage: boolean = false;
    public copiedCommon: boolean = false;
    animationStarted: boolean = true;
    constructor(
        private clipboard: Clipboard,
        private DetailsDataService: DetailsDataService
    ) {}

    ngOnInit(): void {
        this.CloseCard();
    }

    public CloseCard() {
        let currentDate = moment().format('MM/DD/YYYY');
        if (
            moment(this.expDateClose).isBefore(currentDate) ||
            this.isDeactivated
        ) {
            this.isCardOpen = false;
            this.animationStarted = false;
        }
    }

    public sendData(data: any) {
        this.data = data;
        this.DetailsDataService.setCardMainTitle(this.cardNameCommon);
        this.dataDropDopwn.emit(data);
    }
    public toggleCard(event: any) {
        event.preventDefault();
        event.stopPropagation();
        let currentDate = moment().format('MM/DD/YYYY');
        if (
            moment(this.expDateClose).isBefore(currentDate) ||
            this.isDeactivated ||
            this.statusActive == 0 ||
            this.hasToggler
        ) {
            this.animationStarted = !this.animationStarted;
            
            let timeOut = 0;
            if ( this.isCardOpen ) {
                timeOut = 200;
            }
            setTimeout(()=>{
                this.isCardOpen = !this.isCardOpen;
            }, timeOut)
            
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
        }
    }
}
