import { Subject, takeUntil } from 'rxjs';
import {
    ChangeDetectorRef,
    Component,
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
import { loadCardsModuleData } from '../state/load.data';
import { CardRows } from '../../../shared/model/cardData';
import { compareObjectsModal } from '../utils/compare-objects';

// Configuration for modals
import { DisplayLoadConfiguration } from '../../../load/load-card-data';

// Services
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { FormService } from 'src/app/core/services/form/form.service';

// Store
import { LoadDataStore } from '../state/store/load-modal.store';
import { LoadQuery } from '../state/store/load-modal.query';

// Enum
import { CardModalEnums } from '../utils/enums/card-modals.enums';

// Components
import { TaModalComponent } from '../../../shared/ta-modal/ta-modal.component';
import { TaCheckboxComponent } from '../../../shared/ta-checkbox/ta-checkbox.component';
import { ModalInputFormComponent } from '../components/modal-input-form.component';

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
export class LoadCardsModalComponent implements OnInit {
    private destroy$ = new Subject<void>();

    public Cardsform: FormGroup;

    public pendingDataFront: CardRows[];
    public pendingDataBack: CardRows[];

    public defaultCardsValues: {
        numberOfRows: number;
        checked: boolean;
        front_side: CardRows[];
        back_side: CardRows[];
    } = {
        numberOfRows: 4,
        checked: true,
        front_side: [],
        back_side: [],
    };

    public cardsAllData: CardRows[] = loadCardsModuleData.allDataLoad;

    public formChanged: boolean = false;
    public isChecked: boolean = false;
    public resetForm: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private loadStore: LoadDataStore,
        private loadQuery: LoadQuery,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.getDataFromStore();

        this.createForm();

        this.getValueForm();

        this.compareDataInStoreAndDefaultData();
    }

    public createForm(): void {
        this.Cardsform = this.formBuilder.group({
            numberOfRows: [this.defaultCardsValues.numberOfRows],
            checked: [this.defaultCardsValues.checked],
            front_side: this.formBuilder.group({
                selectedTitle_0: [''],
                selectedTitle_1: [''],
                selectedTitle_2: [''],
                selectedTitle_3: [''],
                selectedTitle_4: null,
                selectedTitle_5: null,
            }),
            back_side: this.formBuilder.group({
                selectedTitle_back_0: [''],
                selectedTitle_back_1: [''],
                selectedTitle_back_2: [''],
                selectedTitle_back_3: [''],
                selectedTitle_back_4: null,
                selectedTitle_back_5: null,
            }),
        });
    }

    public getDataFromStore(): void {
        this.loadQuery.pending$
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.defaultCardsValues.checked = data.checked;

                this.pendingDataFront = data.front_side;

                this.pendingDataBack = data.back_side;

                this.defaultCardsValues.numberOfRows = data.numberOfRows;

                this.defaultCardsValues.front_side = data.front_side;

                this.defaultCardsValues.back_side = data.back_side;
            });
    }

    public onActionModal(event): void {
        switch (event.action) {
            case CardModalEnums.CARDS_MODAL:
                this.updateStore();
                break;

            case CardModalEnums.RESET_TO_DEFAULT:
                this.setTodefaultCards();
                break;

            default:
                break;
        }
    }

    private updateStore(): void {
        this.defaultCardsValues = {
            numberOfRows: this.Cardsform.value.numberOfRows,
            checked: this.Cardsform.value.checked,
            front_side: [
                this.Cardsform.value.front_side.selectedTitle_0 !== ''
                    ? this.Cardsform.value.front_side.selectedTitle_0
                    : this.pendingDataFront[0],
                this.Cardsform.value.front_side.selectedTitle_1 !== ''
                    ? this.Cardsform.value.front_side.selectedTitle_1
                    : this.pendingDataFront[1],
                this.Cardsform.value.front_side.selectedTitle_2 !== ''
                    ? this.Cardsform.value.front_side.selectedTitle_2
                    : this.pendingDataFront[2],
                this.Cardsform.value.front_side.selectedTitle_3 !== '' &&
                this.defaultCardsValues.numberOfRows > 3
                    ? this.Cardsform.value.front_side.selectedTitle_3
                    : this.defaultCardsValues.numberOfRows < 4
                    ? null
                    : this.pendingDataFront[3],
                this.Cardsform.value.front_side.selectedTitle_4 !== '' &&
                this.defaultCardsValues.numberOfRows > 4
                    ? this.Cardsform.value.front_side.selectedTitle_4
                    : this.defaultCardsValues.numberOfRows < 5
                    ? null
                    : this.pendingDataFront[4],
                this.Cardsform.value.front_side.selectedTitle_5 !== '' &&
                this.defaultCardsValues.numberOfRows > 5
                    ? this.Cardsform.value.front_side.selectedTitle_5
                    : this.defaultCardsValues.numberOfRows < 6
                    ? null
                    : this.pendingDataFront[5],
            ],

            back_side: [
                this.Cardsform.value.back_side.selectedTitle_back_0 !== ''
                    ? this.Cardsform.value.back_side.selectedTitle_back_0
                    : this.pendingDataBack[0],

                this.Cardsform.value.back_side.selectedTitle_back_1 !== ''
                    ? this.Cardsform.value.back_side.selectedTitle_back_1
                    : this.pendingDataBack[1],

                this.Cardsform.value.back_side.selectedTitle_back_2 !== ''
                    ? this.Cardsform.value.back_side.selectedTitle_back_2
                    : this.pendingDataBack[2],

                this.Cardsform.value.back_side.selectedTitle_back_3 !== '' &&
                this.defaultCardsValues.numberOfRows > 3
                    ? this.Cardsform.value.back_side.selectedTitle_back_3
                    : this.defaultCardsValues.numberOfRows < 4
                    ? null
                    : this.pendingDataBack[3],
                this.Cardsform.value.back_side.selectedTitle_back_4 !== '' &&
                this.defaultCardsValues.numberOfRows > 4
                    ? this.Cardsform.value.back_side.selectedTitle_back_4
                    : this.defaultCardsValues.numberOfRows < 5
                    ? null
                    : this.pendingDataBack[4],
                this.Cardsform.value.back_side.selectedTitle_back_5 !== '' &&
                this.defaultCardsValues.numberOfRows > 5
                    ? this.Cardsform.value.back_side.selectedTitle_back_5
                    : this.defaultCardsValues.numberOfRows < 6
                    ? null
                    : this.pendingDataBack[5],
            ],
        };

        this.loadStore.update((store) => {
            return {
                ...store,
                pending: {
                    ...store.pending,
                    ...this.defaultCardsValues,
                },
            };
        });
    }

    private setTodefaultCards(): void {
        this.Cardsform.patchValue({
            numberOfRows: 4,
            checked: true,
            front_side: {
                selectedTitle_0:
                    DisplayLoadConfiguration.displayRowsFrontPending[0],
                selectedTitle_1:
                    DisplayLoadConfiguration.displayRowsFrontPending[1],
                selectedTitle_2:
                    DisplayLoadConfiguration.displayRowsFrontPending[2],
                selectedTitle_3:
                    DisplayLoadConfiguration.displayRowsFrontPending[3],
                selectedTitle_4: null,
                selectedTitle_5: null,
            },
            back_side: {
                selectedTitle_back_0:
                    DisplayLoadConfiguration.displayRowsBackPending[0],
                selectedTitle_back_1:
                    DisplayLoadConfiguration.displayRowsBackPending[1],
                selectedTitle_back_2:
                    DisplayLoadConfiguration.displayRowsBackPending[2],
                selectedTitle_back_3:
                    DisplayLoadConfiguration.displayRowsBackPending[3],
                selectedTitle_back_4: null,
                selectedTitle_back_5: null,
            },
        });

        this.resetForm = false;

        this.cdr.detectChanges();
    }

    public getValueForm(): void {
        this.Cardsform.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                this.defaultCardsValues.numberOfRows = parseInt(
                    value.numberOfRows
                );

                this.resetForm = true;

                this.formChanged = true;
            });
    }

    private compareDataInStoreAndDefaultData(): void {
        const areFrontSidesEqual = compareObjectsModal.areArraysOfObjectsEqual(
            this.defaultCardsValues.front_side,
            DisplayLoadConfiguration.displayRowsFrontPending
        );

        const areBackSidesEqual = compareObjectsModal.areArraysOfObjectsEqual(
            this.defaultCardsValues.back_side,
            DisplayLoadConfiguration.displayRowsBackPending
        );

        if (
            areFrontSidesEqual &&
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
