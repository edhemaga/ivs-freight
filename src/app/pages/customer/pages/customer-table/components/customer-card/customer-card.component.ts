import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// Models
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { SendDataCard } from '@shared/models/card-models/send-data-card.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardDataResult } from '@shared/models/card-models/card-data-result.model';

// Pipes
import { FormatCurrencyPipe } from '@shared/pipes/format-currency.pipe';
import { TimeFormatPipe } from '@shared/pipes/time-format-am-pm.pipe';

// Services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { DetailsDataService } from '@shared/services/details-data.service';
import { ModalService } from '@shared/services/modal.service';

// Helpers
import { CardHelper } from '@shared/utils/helpers/card-helper';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ConfirmationModalStringEnum } from '@shared/components/ta-shared-modals/confirmation-modal/enums/confirmation-modal-string.enum';
import { ConfirmationActivationStringEnum } from '@shared/components/ta-shared-modals/confirmation-activation-modal/enums/confirmation-activation-string.enum';
import { ConfirmationMoveStringEnum } from '@shared/components/ta-shared-modals/confirmation-move-modal/enums/confirmation-move-string.enum';

//Components
import { BrokerModalComponent } from '@pages/customer/pages/broker-modal/broker-modal.component';
import { ShipperModalComponent } from '@pages/customer/pages/shipper-modal/shipper-modal.component';
import { ConfirmationMoveModalComponent } from '@shared/components/ta-shared-modals/confirmation-move-modal/confirmation-move-modal.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

@Component({
    selector: 'app-customer-card',
    templateUrl: './customer-card.component.html',
    styleUrls: ['./customer-card.component.scss'],
    providers: [FormatCurrencyPipe, TimeFormatPipe, CardHelper],
})
export class CustomerCardComponent implements OnInit, OnDestroy {
    @Output() bodyActions: EventEmitter<SendDataCard> = new EventEmitter();

    @Input() set viewData(value: CardDetails[]) {
        this._viewData = value;
    }

    // Card body keys
    @Input() cardTitle: string;
    @Input() rows: number[];
    @Input() displayRowsFront: CardRows[];
    @Input() displayRowsBack: CardRows[];
    @Input() cardTitleLink: string;
    @Input() set selectedTab(value: string) {
        this._selectedTab = value;

        this.cardHelper.resetSelectedCards();
    }

    private destroy$ = new Subject<void>();

    // Array holding id of checked cards
    public isCheckboxCheckedArray: number[] = [];

    public isCardFlippedCheckInCards: number[] = [];

    public isAllCardsFlipp: boolean = false;
    public _viewData: CardDetails[];
    public cardsFront: CardDataResult[][][] = [];
    public cardsBack: CardDataResult[][][] = [];
    public titleArray: string[][] = [];
    public _selectedTab: string = TableStringEnum.ACTIVE;

    constructor(
        // Services
        private tableService: TruckassistTableService,
        private detailsDataService: DetailsDataService,
        private modalService: ModalService,

        // Router
        private router: Router,

        // Helpers
        private cardHelper: CardHelper
    ) {}

    ngOnInit() {
        this.flipAllCards();
    }

    public flipAllCards(): void {
        this.tableService.isFlipedAllCards
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.isAllCardsFlipp = res;

                this.isCardFlippedCheckInCards = [];
                this.cardHelper.isCardFlippedArrayComparasion = [];
            });
    }

    // When checkbox is selected
    public onCheckboxSelect(index: number, card: CardDetails): void {
        this._viewData[index].isSelected = !this._viewData[index].isSelected;

        const checkedCard = this.cardHelper.onCheckboxSelect(index, card);

        this.tableService.sendRowsSelected(checkedCard);
    }

    // Flip card based on card index
    public flipCard(index: number): void {
        this.isCardFlippedCheckInCards = this.cardHelper.flipCard(index);
    }

    public goToDetailsPage(card: CardDetails): void {
        this.detailsDataService.setNewData(card);

        if (this._selectedTab === TableStringEnum.ACTIVE)
            this.router.navigate([`/list/customer/${card.id}/broker-details`]);
        else
            this.router.navigate([`/list/customer/${card.id}/shipper-details`]);
    }

    public trackCard(item: number): number {
        return item;
    }

    public onCardActions(event: any): void {
        if (
            event.type === TableStringEnum.EDIT_CUSTOMER_OR_SHIPPER ||
            event.type === TableStringEnum.ADD_CONTRACT ||
            event.type === TableStringEnum.WRITE_REVIEW
        ) {
            // Edit Broker Call Modal
            if (this._selectedTab === TableStringEnum.ACTIVE) {
                this.modalService.openModal(
                    BrokerModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...event,
                        type: TableStringEnum.EDIT,
                        dnuButton: true,
                        bfbButton: true,
                        tab: 3,
                        openedTab:
                            event.type === TableStringEnum.ADD_CONTRACT
                                ? TableStringEnum.CONTRACT
                                : event.type === TableStringEnum.WRITE_REVIEW
                                ? TableStringEnum.REVIEW
                                : TableStringEnum.DETAIL,
                    }
                );
            }
            // Edit Shipper Call Modal
            else {
                this.modalService.openModal(
                    ShipperModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...event,
                        type: TableStringEnum.EDIT,
                        openedTab:
                            event.type === TableStringEnum.ADD_CONTRACT
                                ? TableStringEnum.CONTRACT
                                : event.type === TableStringEnum.WRITE_REVIEW
                                ? TableStringEnum.REVIEW
                                : TableStringEnum.DETAIL,
                    }
                );
            }
        } else if (event.type === TableStringEnum.MOVE_TO_BAN_LIST) {
            const mappedEvent = {
                ...event,
                type: !event.data.ban
                    ? TableStringEnum.MOVE
                    : TableStringEnum.REMOVE,
            };

            this.modalService.openModal(
                ConfirmationMoveModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...mappedEvent,
                    template: TableStringEnum.BROKER,
                    subType: TableStringEnum.BAN,
                    tableType: ConfirmationMoveStringEnum.BROKER_TEXT,
                    modalTitle: event.data.businessName,
                    modalSecondTitle:
                        event.data?.billingAddress?.address ??
                        TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                }
            );
        } else if (event.type === TableStringEnum.MOVE_TO_DNU_LIST) {
            const mappedEvent = {
                ...event,
                type: !event.data.dnu
                    ? TableStringEnum.MOVE
                    : TableStringEnum.REMOVE,
            };

            this.modalService.openModal(
                ConfirmationMoveModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...mappedEvent,
                    template: TableStringEnum.BROKER,
                    subType: TableStringEnum.DNU,
                    tableType: ConfirmationMoveStringEnum.BROKER_TEXT,
                    modalTitle: event.data.businessName,
                    modalSecondTitle:
                        event.data?.billingAddress?.address ??
                        TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                }
            );
        } else if (event.type === TableStringEnum.CLOSE_BUSINESS) {
            const mappedEvent = {
                ...event,
                type: event.data.status
                    ? TableStringEnum.CLOSE
                    : TableStringEnum.OPEN,
            };

            this.modalService.openModal(
                ConfirmationActivationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...mappedEvent,
                    template: TableStringEnum.INFO,
                    subType: TableStringEnum.BROKER_2,
                    subTypeStatus: TableStringEnum.BUSINESS,
                    tableType: ConfirmationActivationStringEnum.BROKER_TEXT,
                    modalTitle: event.data.businessName,
                    modalSecondTitle:
                        event.data?.billingAddress?.address ??
                        TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                }
            );
        } else if (event.type === TableStringEnum.VIEW_DETAILS) {
            if (this._selectedTab === TableStringEnum.ACTIVE) {
                this.router.navigate([
                    `/list/customer/${event.id}/broker-details`,
                ]);
            } else {
                this.router.navigate([
                    `/list/customer/${event.id}/shipper-details`,
                ]);
            }
        }
        // Delete Call
        else if (event.type === TableStringEnum.DELETE) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: TableStringEnum.DELETE },
                {
                    ...event,
                    template:
                        this._selectedTab === TableStringEnum.ACTIVE
                            ? TableStringEnum.BROKER
                            : TableStringEnum.SHIPPER,
                    type: TableStringEnum.DELETE,
                    svg: true,
                    modalHeaderTitle:
                        this._selectedTab === TableStringEnum.ACTIVE
                            ? ConfirmationModalStringEnum.DELETE_BROKER
                            : ConfirmationModalStringEnum.DELETE_SHIPPER,
                }
            );
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
