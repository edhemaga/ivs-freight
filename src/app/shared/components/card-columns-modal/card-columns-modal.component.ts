import { CommonModule } from '@angular/common';
import {
    Component,
    OnInit,
    OnDestroy,
    Input,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    FormGroup,
    FormArray,
} from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';

// Modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// Enums
import { CardsModalStringEnum } from '@shared/components/ta-shared-modals/cards-modal/enums/cards-modal-string.enum';

// Services
import { ModalService } from '@shared/services/modal.service';
import { FormService } from '@shared/services/form.service';

// Components
import { ModalInputFormComponent } from '@shared/components/ta-shared-modals/cards-modal/components/modal-input-form.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { CaModalComponent } from 'ca-components';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// Models
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardsModalData } from '@shared/components/ta-shared-modals/cards-modal/models/cards-modal-data.model';

//Pipes
import { NgForLengthFilterPipe } from '@shared/pipes/ng-for-length-filter.pipe';
import { NumberOrdinalPipe } from '@shared/pipes/number-ordinal.pipe';

// SVG ROUTES
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

@Component({
    selector: 'app-card-columns-modal',
    templateUrl: './card-columns-modal.component.html',
    styleUrls: ['./card-columns-modal.component.scss'],
    standalone: true,
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

        // pipes
        NgForLengthFilterPipe,
        NumberOrdinalPipe,
    ],
})
export class CardColumnsModalComponent implements OnInit, OnDestroy {
    @Input() editData: any; //leave this any fow now

    private destroy$ = new Subject<void>();

    // Cards data
    public cardsForm: FormGroup;
    public setDefaultDataFront: CardRows[];
    public setDefaultDataBack: CardRows[];

    public cardsAllData: CardRows[] = [];

    // Form
    public hasFormChanged: boolean = false;
    public isChecked: boolean = false;
    public resetForm: boolean = false;

    // Config
    public titlesInForm: string[] = [];
    public displayData$: Observable<CardsModalData>;
    public rowValues: number[] = [3, 4, 5, 6];

    // Svg-routes
    public svgRoutes = SharedSvgRoutes;

    // Enums
    public cardsModalStringEnum = CardsModalStringEnum;

    constructor(
        private formBuilder: UntypedFormBuilder,

        // Modules
        private activeModal: NgbActiveModal
    ) {}

    public get frontSideForm(): FormArray {
        return this.cardsForm.get(CardsModalStringEnum.FRONT_SIDE) as FormArray;
    }

    public get backSideForm(): FormArray {
        return this.cardsForm.get(CardsModalStringEnum.BACK_SIDE) as FormArray;
    }

    ngOnInit(): void {
        this.createFormData();

        this.createForm({ ...this.editData.data });

        this.getFormValueOnInit();

        this.getValueForm();
    }

    public createFormData(): void {
        this.cardsForm = this.formBuilder.group({
            numberOfRows: 4,

            checked: false,

            front_side: this.formBuilder.array(
                Array.from({ length: 6 }).map(() =>
                    this.formBuilder.group({
                        inputItem: {
                            title: null,
                            id: null,
                            key: null,
                        },
                    })
                )
            ),

            back_side: this.formBuilder.array(
                Array.from({ length: 6 }).map(() =>
                    this.formBuilder.group({
                        inputItem: {
                            title: null,
                            id: null,
                            key: null,
                        },
                    })
                )
            ),
        });
    }

    public createForm(dataState: CardsModalData): void {
        this.cardsForm.patchValue({
            numberOfRows: dataState.numberOfRows,
            checked: dataState.checked,
        });

        dataState.front_side.map((item, index) => {
            this.frontSideForm.at(index).patchValue({
                inputItem:
                    !item || item.title == CardsModalStringEnum.EMPTY
                        ? { title: null, key: null }
                        : item,
            });
        });

        dataState.back_side.map((item, index) => {
            this.backSideForm.at(index).patchValue({
                inputItem:
                    !item || item.title == CardsModalStringEnum.EMPTY
                        ? { title: null, key: null }
                        : item,
            });
        });

        this.cardsAllData = dataState.cardsAllData;
    }

    public onActionModal(action: string): void {
        switch (action) {
            case CardsModalStringEnum.CARDS_MODAL:
                this.saveCardsData();
                break;
            case CardsModalStringEnum.RESET_TO_DEFAULT:
                this.resetToDefault();
                break;
            default:
                this.activeModal.close();
                break;
        }
    }

    private saveCardsData(): void {
        this.activeModal.close({ selectedColumns: this.cardsForm.value });
    }

    private resetToDefault(): void {
        this.resetForm = false;
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
