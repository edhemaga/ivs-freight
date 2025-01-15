import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
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
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// Enums
import { CardsModalStringEnum } from '@shared/components/ta-shared-modals/cards-modal/enums/cards-modal-string.enum';

// Services
import { ModalService } from '@shared/services/modal.service';
import { FormService } from '@shared/services/form.service';
import { AccountCardsModalService } from '@pages/account/pages/account-card-modal/services/account-cards-modal.service';

// Components
import { ModalInputFormComponent } from '@shared/components/ta-shared-modals/cards-modal/components/modal-input-form.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { CaModalComponent } from 'ca-components';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// Helpers
import { CompareObjectsModal } from '@shared/components/ta-shared-modals/cards-modal/utils/helpers/cards-modal.helper';

// Models
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardsModalData } from '@shared/components/ta-shared-modals/cards-modal/models/cards-modal-data.model';
import { AccountCardDataState } from '@pages/account/pages/account-card-modal/state/account-card-modal.store';

// Store
import { accountCardModalQuery } from '@pages/account/pages/account-card-modal/state/account-card-modal.query';

// Constants
import { AccountCardsModalData } from '@pages/account/pages/account-card-modal/constants/account-cards-modal.constants';
import { CardsModalConstants } from '@shared/utils/constants/cards-modal-config.constants';

// SVG ROUTES
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

@Component({
    selector: 'app-account-card-modal',
    templateUrl: './account-card-modal.component.html',
    styleUrls: ['./account-card-modal.component.scss'],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    providers: [ModalService, FormService],
    imports: [
        // modules
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        AngularSvgIconModule,
        NgbTooltipModule,

        // components
        CaModalComponent,
        ModalInputFormComponent,
        TaCheckboxComponent,
        TaAppTooltipV2Component,
    ],
})
export class AccountCardModalComponent implements OnInit, OnDestroy {
    public cardsForm: FormGroup;

    public dataFront: CardRows[];
    public dataBack: CardRows[];

    public setDefaultDataFront: CardRows[];
    public setDefaultDataBack: CardRows[];

    public defaultCardsValues: CardsModalData =
        CardsModalConstants.defaultCardsValues;

    public cardsAllData: CardRows[] = AccountCardsModalData.allDataLoad;

    public hasFormChanged: boolean = false;
    public isChecked: boolean = false;
    public resetForm: boolean = false;

    public tabSelected: string;

    public titlesInForm: string[] = [];
    private destroy$ = new Subject<void>();

    public svgRoutes = SharedSvgRoutes;
    public cardsModalStringEnum = CardsModalStringEnum;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private accountCardModalQuery: accountCardModalQuery,
        private cdr: ChangeDetectorRef,
        private modalService: AccountCardsModalService,
        private activeModal: NgbActiveModal
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
        this.cdr.detectChanges();
    }

    public getDataFromStore(): void {
        this.modalService.tabObservable$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.tabSelected = res;
                this.closedTabModalConfig();
            });
    }

    private closedTabModalConfig(): void {
        this.accountCardModalQuery.active$
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: AccountCardDataState) => {
                this.setDataForModal(data);
                this.setDefaultDataFront = AccountCardsModalData.frontDataLoad;

                this.setDefaultDataBack = AccountCardsModalData.backDataLoad;
            });
    }

    private setDataForModal(data: AccountCardDataState): void {
        this.dataFront = data.front_side;

        this.dataBack = data.back_side;

        this.defaultCardsValues.checked = data.checked;

        this.defaultCardsValues.numberOfRows = data.numberOfRows;

        this.defaultCardsValues.front_side = data.front_side;

        this.defaultCardsValues.back_side = data.back_side;
    }

    public onActionModal(action: string): void {
        switch (action) {
            case CardsModalStringEnum.CARDS_MODAL:
                this.updateStore();
                break;
            case CardsModalStringEnum.RESET_TO_DEFAULT:
                this.setTodefaultCards();
                break;
            default:
                this.activeModal.close();
                break;
        }
    }

    private updateStore(): void {
        this.cardsForm.patchValue({
            checked: this.cardsForm.get(CardsModalStringEnum.CHECKED).value,

            numberOfRows: this.cardsForm.get(
                CardsModalStringEnum.NUMBER_OF_ROWS
            ).value,

            frontSelectedTitle_0: this.cardsForm.get(
                CardsModalStringEnum.FRONT_SELECTED_0
            ).value
                ? this.cardsForm.get(CardsModalStringEnum.FRONT_SELECTED_0)
                      .value
                : this.dataFront[0],

            frontSelectedTitle_1: this.cardsForm.get(
                CardsModalStringEnum.FRONT_SELECTED_1
            ).value
                ? this.cardsForm.get(CardsModalStringEnum.FRONT_SELECTED_1)
                      .value
                : this.dataFront[1],

            frontSelectedTitle_2: this.cardsForm.get(
                CardsModalStringEnum.FRONT_SELECTED_2
            ).value
                ? this.cardsForm.get(CardsModalStringEnum.FRONT_SELECTED_2)
                      .value
                : this.dataFront[2],

            frontSelectedTitle_3:
                this.cardsForm.get(CardsModalStringEnum.FRONT_SELECTED_3)
                    .value && this.defaultCardsValues.numberOfRows > 3
                    ? this.cardsForm.get(CardsModalStringEnum.FRONT_SELECTED_3)
                          .value
                    : this.defaultCardsValues.numberOfRows < 4
                    ? null
                    : this.dataFront[3],

            frontSelectedTitle_4:
                this.cardsForm.get(CardsModalStringEnum.FRONT_SELECTED_4)
                    .value && this.defaultCardsValues.numberOfRows > 4
                    ? this.cardsForm.get(CardsModalStringEnum.FRONT_SELECTED_4)
                          .value
                    : this.defaultCardsValues.numberOfRows < 5
                    ? null
                    : this.dataFront[4],

            frontSelectedTitle_5:
                this.cardsForm.get(CardsModalStringEnum.FRONT_SELECTED_5)
                    .value && this.defaultCardsValues.numberOfRows > 5
                    ? this.cardsForm.get(CardsModalStringEnum.FRONT_SELECTED_5)
                          .value
                    : this.defaultCardsValues.numberOfRows < 6
                    ? null
                    : this.dataFront[5],

            backSelectedTitle_0: this.cardsForm.get(
                CardsModalStringEnum.BACK_SELECTED_0
            ).value
                ? this.cardsForm.get(CardsModalStringEnum.BACK_SELECTED_0).value
                : this.dataBack[0],

            backSelectedTitle_1: this.cardsForm.get(
                CardsModalStringEnum.BACK_SELECTED_1
            ).value
                ? this.cardsForm.get(CardsModalStringEnum.BACK_SELECTED_1).value
                : this.dataBack[1],

            backSelectedTitle_2: this.cardsForm.get(
                CardsModalStringEnum.BACK_SELECTED_2
            ).value
                ? this.cardsForm.get(CardsModalStringEnum.BACK_SELECTED_2).value
                : this.dataBack[2],

            backSelectedTitle_3:
                this.cardsForm.get(CardsModalStringEnum.BACK_SELECTED_3)
                    .value && this.defaultCardsValues.numberOfRows > 3
                    ? this.cardsForm.get(CardsModalStringEnum.BACK_SELECTED_3)
                          .value
                    : this.defaultCardsValues.numberOfRows < 4
                    ? null
                    : this.dataBack[3],

            backSelectedTitle_4:
                this.cardsForm.get(CardsModalStringEnum.BACK_SELECTED_4)
                    .value && this.defaultCardsValues.numberOfRows > 4
                    ? this.cardsForm.get(CardsModalStringEnum.BACK_SELECTED_4)
                          .value
                    : this.defaultCardsValues.numberOfRows < 5
                    ? null
                    : this.dataBack[4],

            backSelectedTitle_5:
                this.cardsForm.get(CardsModalStringEnum.BACK_SELECTED_5)
                    .value && this.defaultCardsValues.numberOfRows > 5
                    ? this.cardsForm.get(CardsModalStringEnum.BACK_SELECTED_5)
                          .value
                    : this.defaultCardsValues.numberOfRows < 6
                    ? null
                    : this.dataBack[5],
        });

        this.modalService.updateStore(this.cardsForm.value, this.tabSelected);
        this.activeModal.close();
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
                if (item && typeof item.title === CardsModalStringEnum.STRING) {
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
