import { CommonModule } from '@angular/common';
import {
    Component,
    OnInit,
    ViewEncapsulation,
    ChangeDetectorRef,
    OnDestroy,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    FormGroup,
    FormArray,
} from '@angular/forms';
import { Observable, Subject, Subscription, first, takeUntil } from 'rxjs';

// Enums
import { CardsModalStringEnum } from '@shared/components/ta-shared-modals/cards-modal/enums/cards-modal-string.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';

// Services
import { ModalService } from '@shared/services/modal.service';
import { FormService } from '@shared/services/form.service';
import { UserCardsModalService } from '@pages/user/pages/user-card-modal/services/user-cards-modal.service';

// Components
import { ModalInputFormComponent } from '@shared/components/ta-shared-modals/cards-modal/components/modal-input-form.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';

// Helpers
import { CompareObjectsModal } from '@shared/components/ta-shared-modals/cards-modal/utils/helpers/cards-modal.helper';

// Models
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardsModalData } from '@shared/components/ta-shared-modals/cards-modal/models/cards-modal-data.model';

// Constants
import { UserCardsModalData } from '@pages/user/pages/user-card-modal/utils/constants/user-cards-modal.constants';
import { CardsModalConstants } from '@shared/utils/constants/cards-modal-config.constants';

//Store
import { Store } from '@ngrx/store';
import { selectActiveModalTabs } from '@pages/user/pages/user-card-modal/state/user-card-modal.selectors';

//Pipes
import { NgForLengthFilterPipe } from '@shared/pipes/ng-for-length-filter.pipe';
import { NumberOrdinalPipe } from '@shared/pipes/number-ordinal.pipe';

@Component({
    selector: 'app-user-card-modal',
    templateUrl: './user-card-modal.component.html',
    styleUrls: ['./user-card-modal.component.scss'],
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

        // pipes
        NgForLengthFilterPipe,
        NumberOrdinalPipe,
    ],
})
export class UserCardModalComponent implements OnInit, OnDestroy {
    public cardsForm: FormGroup;

    public dataFront: CardRows[];
    public dataBack: CardRows[];

    public setDefaultDataFront: CardRows[];
    public setDefaultDataBack: CardRows[];

    public defaultCardsValues: CardsModalData =
        CardsModalConstants.defaultCardsValues;

    public cardsAllData: CardRows[] = UserCardsModalData.allDataLoad;

    public hasFormChanged: boolean = false;
    public isChecked: boolean = false;
    public resetForm: boolean = false;

    public tabSelected: string;

    public titlesInForm: string[] = [];
    public displayData$: Observable<CardsModalData>;
    private subscription: Subscription = new Subscription();
    public rowValues: number[] = [3, 4, 5, 6];
    private destroy$ = new Subject<void>();

    constructor(
        private formBuilder: UntypedFormBuilder,
        private cdr: ChangeDetectorRef,
        private modalService: UserCardsModalService,
        //Store
        private store: Store
    ) {}

    ngOnInit(): void {
        this.createFormData();

        this.getDataFromStore();

        this.getFormValueOnInit();

        this.getValueForm();

        this.compareDataInStoreAndDefaultData();
    }

    public createFormData(): void {
        this.cardsForm = this.formBuilder.group({
            numberOfRows: 4,

            checked: false,

            front_side: this.formBuilder.array([
                this.formBuilder.group({
                    inputItem: {
                        title: null,
                        id: null,
                        key: null,
                    },
                }),
                this.formBuilder.group({
                    inputItem: {
                        title: null,
                        id: null,
                        key: null,
                    },
                }),
                this.formBuilder.group({
                    inputItem: {
                        title: null,
                        id: null,
                        key: null,
                    },
                }),
                this.formBuilder.group({
                    inputItem: {
                        title: null,
                        id: null,
                        key: null,
                    },
                }),
                this.formBuilder.group({
                    inputItem: {
                        title: null,
                        id: null,
                        key: null,
                    },
                }),
                this.formBuilder.group({
                    inputItem: {
                        title: null,
                        id: null,
                        key: null,
                    },
                }),
            ]),

            back_side: this.formBuilder.array([
                this.formBuilder.group({
                    inputItem: {
                        title: null,
                        id: null,
                        key: null,
                    },
                }),
                this.formBuilder.group({
                    inputItem: {
                        title: null,
                        id: null,
                        key: null,
                    },
                }),
                this.formBuilder.group({
                    inputItem: {
                        title: null,
                        id: null,
                        key: null,
                    },
                }),
                this.formBuilder.group({
                    inputItem: {
                        title: null,
                        id: null,
                        key: null,
                    },
                }),
                this.formBuilder.group({
                    inputItem: {
                        title: null,
                        id: null,
                        key: null,
                    },
                }),
                this.formBuilder.group({
                    inputItem: {
                        title: null,
                        id: null,
                        key: null,
                    },
                }),
            ]),
        });
    }

    public createForm(dataState: CardsModalData): void {
        this.cardsForm.patchValue({
            numberOfRows: dataState.numberOfRows,
            checked: dataState.checked,
        });

        dataState.front_side.map((item, index) => {
            this.front_side_form.at(index).patchValue({
                inputItem:
                    !item || item.title == CardsModalStringEnum.EMPTY
                        ? { title: null, key: null }
                        : item,
            });
        });

        dataState.back_side.map((item, index) => {
            this.back_side_form.at(index).patchValue({
                inputItem:
                    !item || item.title == CardsModalStringEnum.EMPTY
                        ? { title: null, key: null }
                        : item,
            });
        });
        this.cdr.detectChanges();
    }

    public getDataFromStore(): void {
        this.modalService.tabObservable$
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (res: TableStringEnum.ACTIVE | TableStringEnum.INACTIVE) => {
                    this.tabSelected = res;
                    this.setDefaultValues(res);
                }
            );
    }

    public onActionModal(event): void {
        switch (event.action) {
            case CardsModalStringEnum.CARDS_MODAL:
                this.updateStore();
                break;
            case CardsModalStringEnum.RESET_TO_DEFAULT:
                this.setTodefaultCards();
                break;
            default:
                break;
        }
    }

    public get front_side_form(): FormArray {
        return this.cardsForm.get(CardsModalStringEnum.FRONT_SIDE) as FormArray;
    }

    public get back_side_form(): FormArray {
        return this.cardsForm.get(CardsModalStringEnum.BACK_SIDE) as FormArray;
    }

    private updateStore(): void {
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

                this.resetForm = true;
                this.hasFormChanged = true;
            });
    }

    private filterTitlesFromForm(valuesInform: any): void {
        //leave this as any for now
        this.titlesInForm = valuesInform.flatMap(
            (
                item: any //leave this as any for now
            ) =>
                Array.isArray(item)
                    ? item
                          .filter(
                              (titles) =>
                                  titles &&
                                  typeof titles.inputItem.title ===
                                      CardsModalStringEnum.STRING
                          )
                          .map((titles) => titles.inputItem.title)
                    : []
        );
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
            this.cardsForm.get(CardsModalStringEnum.CHECKED).value &&
            this.cardsForm.get(CardsModalStringEnum.NUMBER_OF_ROWS).value === 4
        ) {
            this.resetForm = false;
        } else {
            this.resetForm = true;
        }
    }

    private setDefaultValues(
        type: TableStringEnum.ACTIVE | TableStringEnum.INACTIVE
    ): void {
        this.displayData$ = this.store.select(selectActiveModalTabs(type));
        this.subscription.add(
            this.displayData$
                .pipe(takeUntil(this.destroy$), first())
                .subscribe((data) => {
                    this.createForm(data);
                })
        );
        this.cardsAllData = UserCardsModalData.allDataLoad;
        this.setDefaultDataFront = UserCardsModalData.frontDataLoad;
        this.setDefaultDataBack = UserCardsModalData.backDataLoad;
    }

    public identity(item: CardRows): number {
        return item.id;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
