import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// models
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { CardDataResult } from '@shared/models/card-models/card-data-result.model';

// helpers
import { CardHelper } from '@shared/utils/helpers/card-helper';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ModalService } from '@shared/services/modal.service';
import { UserService } from '@pages/user/services/user.service';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

// components
import { UserModalComponent } from '@pages/user/pages/user-modal/user-modal.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

@Component({
    selector: 'app-user-card',
    templateUrl: './user-card.component.html',
    styleUrls: ['./user-card.component.scss'],
    providers: [CardHelper],
})
export class UserCardComponent implements OnInit, OnDestroy {
    @Input() set viewData(value: CardDetails[]) {
        this._viewData = value;
    }

    // Card body endpoints
    @Input() cardTitle: string;
    @Input() rows: number[];
    @Input() displayRowsFront: CardRows[];
    @Input() displayRowsBack: CardRows[];
    @Input() cardTitleLink: string;

    public isCardFlippedCheckInCards: number[] = [];
    public _viewData: CardDetails[];
    public cardsFront: CardDataResult[][][] = [];
    public cardsBack: CardDataResult[][][] = [];
    public titleArray: string[][] = [];
    public isAllCardsFlipp: boolean;

    private destroy$ = new Subject<void>();

    constructor(
        // services
        private tableService: TruckassistTableService,
        private modalService: ModalService,
        private userService: UserService,

        // helpers
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

    public trackCard(item: number): number {
        return item;
    }

    public onCardActions(event: any): void {
        const confirmationModalData = {
            ...event,
            data: {
                ...event.data,
                name: event.data?.firstName,
            },
        };

        // Edit
        if (event.type === TableStringEnum.EDIT) {
            this.modalService.openModal(
                UserModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...event,
                    type: TableStringEnum.EDIT,
                    disableButton:
                        event.data?.userType?.name !== TableStringEnum.OWNER,
                }
            );
        }
        // Activate Or Deactivate User
        else if (
            event.type === TableStringEnum.DEACTIVATE ||
            event.type === TableStringEnum.ACTIVATE
        ) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...confirmationModalData,
                    template: TableStringEnum.USER_1,
                    type:
                        event.data.status === 1
                            ? TableStringEnum.DEACTIVATE
                            : TableStringEnum.ACTIVATE,
                    image: true,
                }
            );
        }
        // User Reset Password
        else if (event.type === TableStringEnum.RESET_PASSWORD) {
            this.userService
                .userResetPassword(event.data.email as any) // leave this any for now
                .pipe(takeUntil(this.destroy$))
                .subscribe();
        }
        // User Resend Ivitation
        else if (event.type === TableStringEnum.RESEND_INVITATION) {
            this.userService
                .userResendIvitation(event.data.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe();
        }
        // User Delete
        else if (event.type === TableStringEnum.DELETE) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...confirmationModalData,
                    template: TableStringEnum.USER_1,
                    type: TableStringEnum.DELETE,
                    image: true,
                }
            );
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
