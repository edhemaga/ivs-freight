import { ActivatedRoute, RouterModule } from '@angular/router';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTooltipComponent } from '../../standalone-components/app-tooltip/app-tooltip.component';
import { DetailsDropdownComponent } from '../details-page-dropdown/details-dropdown';
import { TaCounterComponent } from '../ta-counter/ta-counter.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FilterComponent } from '../../standalone-components/filter/filter.component';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-ta-details-header',
    templateUrl: './ta-details-header.component.html',
    styleUrls: ['./ta-details-header.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AppTooltipComponent,
        DetailsDropdownComponent,
        TaCounterComponent,
        AngularSvgIconModule,
        FilterComponent,
        RouterModule,
        NgbPopoverModule
    ],
})
export class TaCommonHeaderComponent implements OnInit {
    @Input() headerText: string = null;
    @Input() tooltipHeaderName: string = '';
    @Input() route: string = '';
    @Input() options: any = [];
    @Input() counterData: number = 0;
    @Output() openModalAction = new EventEmitter<any>();
    @Input() hasIcon: boolean = false;
    @Input() hasDateArrow: boolean = false;
    @Input() hidePlus: boolean = true;
    @Input() customText: string = '';
    @Output() changeDataArrowUp = new EventEmitter<any>();
    @Output() changeDataArrowDown = new EventEmitter<any>();
    @Input() hasRequest: boolean;
    @Output() makeRequest = new EventEmitter<any>();
    @Input() arrayIcons: any[] = [];
    @Input() statusInactive: boolean = true;
    @Input() danger: boolean = false;
    @Input() isInactive: boolean = false;
    @Output() public dropActions = new EventEmitter<any>();
    @Input() public optionsId: number;
    @Input() hasDateNav: boolean = true;
    @Input() counterViolation: number;
    @Input() hasArrowDown: boolean;
    @Input() totalCost: any;
    @Input() repairIsOpen: boolean;
    @Input() showRepairHeaderOpen: boolean;
    @Input() loadNames: boolean;
    @Input() secondNameHeader: string = '';
    @Input() countViolation: number;
    @Input() hideCounter: boolean;
    @Input() mainData: any;
    @Input() timeFilter: boolean = false;
    @Input() unitFilter: boolean = false;
    @Input() repairOrderFilter: boolean = false;
    @Input() pmFilter: boolean = false;
    @Input() categoryFilter: boolean = false;
    @Input() moneyFilter: boolean = false;
    @Input() brokerLoadDrop: boolean = false;

    public up: boolean = false;
    public down: boolean = false;
    public dropOpened: boolean = false;
    public tooltip: any;
    public activeTemplate: any = 'All Load';
    constructor(private routes: ActivatedRoute) {}

    ngOnInit(): void {}

    public openModal(val: any) {
        this.openModalAction.emit(val);
    }
    public makeRequestFun(req: any) {
        this.makeRequest.emit(req);
    }
    /**Function for drop acitons */
    public dropAct(action: any) {
        this.dropActions.emit(action);
    }
    public changeDataArrowUpFun(val: any) {
        this.up = true;
        if (this.down == true) {
            this.down = false;
        }
        this.changeDataArrowUp.emit(val);
    }
    public changeDataArrowDownFun(val: any) {
        this.down = true;
        if (this.up == true) {
            this.up = false;
        }
        this.changeDataArrowDown.emit(val);
    }
    public trackByIndex(index: number, obj: any): any {
        return index;
    }

    toggleDropdownActions() {
        //console.log('--mainData---', this.mainData);
        let itemData = this.mainData?.data;
        let diasbleClosedArray;

        if (this.mainData?.nameDefault == 'Repair Shop Detail') {
            if (itemData.status != 1) {
                diasbleClosedArray = [0, 3, 4, 5];
            } else if (itemData.companyOwned) {
                diasbleClosedArray = [3];
            }
        }

        if (this.mainData?.nameDefault == 'Broker Detail') {
            if (itemData.status != 1) {
                diasbleClosedArray = [0, 2, 3, 4, 5, 6];
            } else if (itemData.dnu || itemData.ban) {
                diasbleClosedArray = [2];
            }
        }

        switch (this.mainData?.nameDefault) {
            case 'Repair Shop Detail':
                this.options?.actions.map((action, index) => {
                    if (index == 3) {
                        if (itemData.pinned != false) {
                            action.title = 'Remove from Favourite';
                            action.name = 'remove-from-favourite';
                            action.blueIcon = true;
                        } else {
                            action.title = 'Mark as favorite';
                            action.name = 'move-to-favourite';
                            action.blueIcon = false;
                        }
                    }

                    if (
                        diasbleClosedArray &&
                        diasbleClosedArray.indexOf(index) > -1
                    ) {
                        action.disabled = true;
                    } else {
                        action.disabled = false;
                    }

                    if (index == 9) {
                        if (itemData.status != 1) {
                            action.title = 'Reopen Business';
                            action.greenIcon = true;
                            action.redIcon = false;
                            action.name = 'open-business';
                            action.iconName = 'mark-as-done';
                        } else {
                            action.title = 'Close Business';
                            action.greenIcon = false;
                            action.redIcon = true;
                            action.name = 'close-business';
                            action.iconName = 'close-business';
                        }
                    }
                });
                break;
            case 'Broker Detail':
                this.options?.actions.map((action, index) => {
                    if (
                        diasbleClosedArray &&
                        diasbleClosedArray.indexOf(index) > -1
                    ) {
                        action.disabled = true;
                    } else {
                        action.disabled = false;
                    }

                    if (index == 5) {
                        if (itemData.ban) {
                            action.title = 'Remove from Ban List';
                            action.name = 'remove-from-ban';
                        } else {
                            action.title = 'Move to Ban List';
                            action.name = 'move-to-ban';
                        }
                    }

                    if (index == 6) {
                        if (itemData.dnu) {
                            action.title = 'Remove from DNU List';
                            action.name = 'remove-from-dnu';
                        } else {
                            action.title = 'Move to DNU List';
                            action.name = 'move-to-dnu';
                        }
                    }
                });

                break;
        }
    }

    showDropdown(tooltip: any){
        if ( this.brokerLoadDrop ) {

            this.tooltip = tooltip;
            if (tooltip.isOpen()) {
                //tooltip.close();
            } else {
                tooltip.open();
            }
            this.dropOpened = !this.dropOpened;
        }
    }

    dropdownClosed(){
        this.dropOpened = false;
    }

    setLoadType(mod){
        console.log('mooood---', mod);
    }
}
