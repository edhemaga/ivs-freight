import { takeUntil } from 'rxjs';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

// models
import { Constructor } from '@shared/models/mixin.model';
import { CardDetails } from '@shared/models';

// mixin
import { DestroyableMixin } from '@shared/mixins/destroyable.mixin';

// helpers
import { CardHelper } from '@shared/utils/helpers';

export function TableCardViewMixin<
    T extends Constructor<{
        cardHelper?: CardHelper;
        tableService?: TruckassistTableService;
        viewData?: CardDetails[];
    }>,
>(Base: T) {
    return class extends DestroyableMixin(Base) {
        public isCardFlippedCheckInCards: number[];
        public isEveryCardFlipped: boolean;

        public flipCard(index: number): void {
            this.isCardFlippedCheckInCards = this.cardHelper.flipCard(index);
        }

        public flipAllCards(): void {
            this.tableService.isFlipedAllCards
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    this.isEveryCardFlipped = res;
                    this.isCardFlippedCheckInCards = [];
                    this.cardHelper.isCardFlippedArrayComparasion = [];
                });
        }

        public onCheckboxSelect(index: number, card: CardDetails): void {
            this.viewData[index].isSelected = !this.viewData[index].isSelected;

            const checkedCard = this.cardHelper.onCheckboxSelect(index, card);

            this.tableService.sendRowsSelected(checkedCard);
        }
    };
}
