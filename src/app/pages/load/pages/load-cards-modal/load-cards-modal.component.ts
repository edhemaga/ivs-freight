import { Subject, takeUntil } from 'rxjs';
import {
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

// Models
import { LoadCardsModuleConstants } from '../../../../shared/components/ta-shared-modals/cards-modal/utils/constants/load-card.constants';
import { CardRows } from 'src/app/shared/models/card-models/card-rows.model';
import { CardsModalData } from '../../../../shared/components/ta-shared-modals/cards-modal/models/cards-modal-data.model';

// Configuration for modals
import { LoadCardConfiguration } from 'src/app/pages/load/utils/constants/load-card-configuration.constants';

// Services
import { ModalService } from '../../../../shared/components/ta-modal/services/modal.service';
import { FormService } from 'src/app/shared/services/form.service';

// Store
import { LoadQuery } from '../../../../shared/components/ta-shared-modals/cards-modal/state/load-modal.query';

// helpers
import { CompareObjectsModal } from '../../../../shared/components/ta-shared-modals/cards-modal/utils/helpers/cards-modal.helper';

// Enum
import { CardsModalEnum } from '../../../../shared/components/ta-shared-modals/cards-modal/enums/cards-modal.enum';

// Services
import { CardsModalConfigService } from '../../../../shared/components/ta-shared-modals/cards-modal/services/cards-modal-config.service';

// constants
import { LoadCardsModalConstants } from './utils/constants/load-modal.constants';

// components
import { TaModalComponent } from '../../../../shared/components/ta-modal/ta-modal.component';
import { TaCheckboxComponent } from '../../../../shared/components/ta-checkbox/ta-checkbox.component';
import { ModalInputFormComponent } from '../../../../shared/components/ta-shared-modals/cards-modal/components/modal-input-form.component';

@Component({
    selector: 'app-load-cards-modal',
    templateUrl: './load-cards-modal.component.html',
    styleUrls: ['./load-cards-modal.component.scss'],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    providers: [ModalService, FormService],
    imports: [
        // modules
        CommonModule,
        ReactiveFormsModule,
        FormsModule,

        // components
        TaModalComponent,
        ModalInputFormComponent,
        TaCheckboxComponent,
    ],
})
export class LoadCardsModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public cardsForm: FormGroup;

    public dataFront: CardRows[];
    public dataBack: CardRows[];

    public setDefaultDataFront: CardRows[];
    public setDefaultDataBack: CardRows[];

    public defaultCardsValues: CardsModalData =
        LoadCardsModalConstants.defaultCardsValues;

    public cardsAllData: CardRows[] = LoadCardsModuleConstants.allDataLoad;

    public hasFormChanged: boolean = false;
    public isChecked: boolean = false;
    public resetForm: boolean = false;

    public tabSelected: string;

    public titlesInForm: string[] = [];

    constructor(
        private formBuilder: UntypedFormBuilder,
        private loadQuery: LoadQuery,
        private cdr: ChangeDetectorRef,
        private modalService: CardsModalConfigService
    ) {}

    ngOnInit(): void {
        this.getDataFromStore();

        this.createForm();

        this.getFormValueOnInit();

        this.getValueForm();

        this.compareDataInStoreAndDefaultData();
    }

    public createForm(): void {
        this.cardsForm = this.formBuilder.group({
            numberOfRows: this.defaultCardsValues.numberOfRows,

            checked: this.defaultCardsValues.checked,

            frontSelectedTitle_0: this.dataFront[0],
            frontSelectedTitle_1: this.dataFront[1],
            frontSelectedTitle_2: this.dataFront[2],
            frontSelectedTitle_3: this.dataFront[3],
            frontSelectedTitle_4: null,
            frontSelectedTitle_5: null,

            backSelectedTitle_0: this.dataBack[0],
            backSelectedTitle_1: this.dataBack[1],
            backSelectedTitle_2: this.dataBack[2],
            backSelectedTitle_3: this.dataBack[3],
            backSelectedTitle_4: null,
            backSelectedTitle_5: null,
        });
    }

    public getDataFromStore(): void {
        this.modalService.tabObservable$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.tabSelected = res;

                switch (res) {
                    case CardsModalEnum.PENDING:
                        this.pendingTabModalConfig();
                        break;

                    case CardsModalEnum.TEMPLATE:
                        this.templateTabModalConfig();
                        break;

                    case CardsModalEnum.ACTIVE:
                        this.activeTabModalConfig();
                        break;

                    case CardsModalEnum.CLOSED:
                        this.closedTabModalConfig();
                        break;

                    default:
                        break;
                }
            });
    }

    private templateTabModalConfig(): void {
        this.loadQuery.template$
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: CardsModalData) => {
                this.setDataForModal(data);

                this.setDefaultDataFront =
                    LoadCardConfiguration.displayRowsFrontTemplate;

                this.setDefaultDataBack =
                    LoadCardConfiguration.displayRowsBackTemplate;
            });
    }

    private pendingTabModalConfig(): void {
        this.loadQuery.pending$
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: CardsModalData) => {
                this.setDataForModal(data);

                this.setDefaultDataFront =
                    LoadCardConfiguration.displayRowsFrontPending;

                this.setDefaultDataBack =
                    LoadCardConfiguration.displayRowsBackPending;
            });
    }

    private activeTabModalConfig(): void {
        this.loadQuery.active$
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: CardsModalData) => {
                this.setDataForModal(data);

                this.setDefaultDataFront =
                    LoadCardConfiguration.displayRowsFrontPending;

                this.setDefaultDataBack =
                    LoadCardConfiguration.displayRowsBackActive;
            });
    }

    private closedTabModalConfig(): void {
        this.loadQuery.closed$
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: CardsModalData) => {
                this.setDataForModal(data);

                this.setDefaultDataFront =
                    LoadCardConfiguration.displayRowsFrontClosed;

                this.setDefaultDataBack =
                    LoadCardConfiguration.displayRowsBackClosed;
            });
    }

    private setDataForModal(data: CardsModalData): void {
        this.dataFront = data.front_side;

        this.dataBack = data.back_side;

        this.defaultCardsValues.checked = data.checked;

        this.defaultCardsValues.numberOfRows = data.numberOfRows;

        this.defaultCardsValues.front_side = data.front_side;

        this.defaultCardsValues.back_side = data.back_side;
    }

    public onActionModal(event): void {
        switch (event.action) {
            case CardsModalEnum.CARDS_MODAL:
                this.updateStore();
                break;

            case CardsModalEnum.RESET_TO_DEFAULT:
                this.setTodefaultCards();
                break;

            default:
                break;
        }
    }

    private updateStore(): void {
        this.cardsForm.patchValue({
            checked: this.cardsForm.get(CardsModalEnum.CHECKED).value,

            numberOfRows: this.cardsForm.get(CardsModalEnum.NUMBER_OF_ROWS)
                .value,

            frontSelectedTitle_0: this.cardsForm.get(
                CardsModalEnum.FRONT_SELECTED_0
            ).value
                ? this.cardsForm.get(CardsModalEnum.FRONT_SELECTED_0).value
                : this.dataFront[0],

            frontSelectedTitle_1: this.cardsForm.get(
                CardsModalEnum.FRONT_SELECTED_1
            ).value
                ? this.cardsForm.get(CardsModalEnum.FRONT_SELECTED_1).value
                : this.dataFront[1],

            frontSelectedTitle_2: this.cardsForm.get(
                CardsModalEnum.FRONT_SELECTED_2
            ).value
                ? this.cardsForm.get(CardsModalEnum.FRONT_SELECTED_2).value
                : this.dataFront[2],

            frontSelectedTitle_3:
                this.cardsForm.get(CardsModalEnum.FRONT_SELECTED_3).value &&
                this.defaultCardsValues.numberOfRows > 3
                    ? this.cardsForm.get(CardsModalEnum.FRONT_SELECTED_3).value
                    : this.defaultCardsValues.numberOfRows < 4
                    ? null
                    : this.dataFront[3],

            frontSelectedTitle_4:
                this.cardsForm.get(CardsModalEnum.FRONT_SELECTED_4).value &&
                this.defaultCardsValues.numberOfRows > 4
                    ? this.cardsForm.get(CardsModalEnum.FRONT_SELECTED_4).value
                    : this.defaultCardsValues.numberOfRows < 5
                    ? null
                    : this.dataFront[4],

            frontSelectedTitle_5:
                this.cardsForm.get(CardsModalEnum.FRONT_SELECTED_5).value &&
                this.defaultCardsValues.numberOfRows > 5
                    ? this.cardsForm.get(CardsModalEnum.FRONT_SELECTED_5).value
                    : this.defaultCardsValues.numberOfRows < 6
                    ? null
                    : this.dataFront[5],

            backSelectedTitle_0: this.cardsForm.get(
                CardsModalEnum.BACK_SELECTED_0
            ).value
                ? this.cardsForm.get(CardsModalEnum.BACK_SELECTED_0).value
                : this.dataBack[0],

            backSelectedTitle_1: this.cardsForm.get(
                CardsModalEnum.BACK_SELECTED_1
            ).value
                ? this.cardsForm.get(CardsModalEnum.BACK_SELECTED_1).value
                : this.dataBack[1],

            backSelectedTitle_2: this.cardsForm.get(
                CardsModalEnum.BACK_SELECTED_2
            ).value
                ? this.cardsForm.get(CardsModalEnum.BACK_SELECTED_2).value
                : this.dataBack[2],

            backSelectedTitle_3:
                this.cardsForm.get(CardsModalEnum.BACK_SELECTED_3).value &&
                this.defaultCardsValues.numberOfRows > 3
                    ? this.cardsForm.get(CardsModalEnum.BACK_SELECTED_3).value
                    : this.defaultCardsValues.numberOfRows < 4
                    ? null
                    : this.dataBack[3],

            backSelectedTitle_4:
                this.cardsForm.get(CardsModalEnum.BACK_SELECTED_4).value &&
                this.defaultCardsValues.numberOfRows > 4
                    ? this.cardsForm.get(CardsModalEnum.BACK_SELECTED_4).value
                    : this.defaultCardsValues.numberOfRows < 5
                    ? null
                    : this.dataBack[4],

            backSelectedTitle_5:
                this.cardsForm.get(CardsModalEnum.BACK_SELECTED_5).value &&
                this.defaultCardsValues.numberOfRows > 5
                    ? this.cardsForm.get(CardsModalEnum.BACK_SELECTED_5).value
                    : this.defaultCardsValues.numberOfRows < 6
                    ? null
                    : this.dataBack[5],
        });

        this.modalService.updateStore(this.cardsForm.value, this.tabSelected);
    }

    private setTodefaultCards(): void {
        this.cardsForm.patchValue({
            numberOfRows: 4,
            checked: true,
            frontSelectedTitle_0: this.setDefaultDataFront[0],
            frontSelectedTitle_1: this.setDefaultDataFront[1],
            frontSelectedTitle_2: this.setDefaultDataFront[2],
            frontSelectedTitle_3: this.setDefaultDataFront[3],
            frontSelectedTitle_4: null,
            frontSelectedTitle_5: null,

            backSelectedTitle_0: this.setDefaultDataBack[0],
            backSelectedTitle_1: this.setDefaultDataBack[1],
            backSelectedTitle_2: this.setDefaultDataBack[2],
            backSelectedTitle_3: this.setDefaultDataBack[3],
            backSelectedTitle_4: null,
            backSelectedTitle_5: null,
        });

        this.resetForm = false;

        this.cdr.detectChanges();
    }

    public getFormValueOnInit(): void {
        const formValue = Object.values(this.cardsForm.value);

        this.filterTitlesFromForm(formValue);
    }

    public getValueForm(): void {
        this.cardsForm.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                const valuesInform = Object.values(value);

                this.filterTitlesFromForm(valuesInform);

                this.defaultCardsValues.numberOfRows = parseInt(
                    value.numberOfRows
                );

                this.resetForm = true;
                this.hasFormChanged = true;
            });
    }

    private filterTitlesFromForm(valuesInform: CardRows[]): void {
        this.titlesInForm = valuesInform
            .map((item) => {
                if (item && typeof item.title === CardsModalEnum.STRING) {
                    return item.title;
                }
                return;
            })
            .filter((title) => title);
    }

    private compareDataInStoreAndDefaultData(): void {
        const isFrontSidesEqual = CompareObjectsModal.areArraysOfObjectsEqual(
            this.defaultCardsValues.front_side,
            this.setDefaultDataFront
        );

        const areBackSidesEqual = CompareObjectsModal.areArraysOfObjectsEqual(
            this.defaultCardsValues.back_side,
            this.setDefaultDataBack
        );

        if (
            isFrontSidesEqual &&
            areBackSidesEqual &&
            this.defaultCardsValues.checked &&
            this.defaultCardsValues.numberOfRows === 4
        ) {
            this.resetForm = false;
        } else {
            this.resetForm = true;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
