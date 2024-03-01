import { Subject, takeUntil } from 'rxjs';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

// Models
import { loadCardsModuleData } from '../state/load.data';
import { CardRows } from '../../../shared/model/cardData';

// Services
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { FormService } from 'src/app/core/services/form/form.service';
import { LoadServiceModal } from '../state/service/load.service';

// Components
import { TaModalComponent } from '../../../shared/ta-modal/ta-modal.component';
import { TaCheckboxComponent } from '../../../shared/ta-checkbox/ta-checkbox.component';
import { ModalInputFormComponent } from '../components/modal-input-form.component';
import { LoadDataStore } from '../state/store/load-modal.store';

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

    public Cardsform: UntypedFormGroup;

    public defaultCardsValues: {
        numberOfRows: number;
        checked: boolean;
        selectedTitle_0: string;
        selectedTitle_1: string;
        selectedTitle_2: string;
        selectedTitle_3: string;
        selectedTitle_4: string;
        selectedTitle_5: string;
        selectedTitle_back_0: string[];
        selectedTitle_back_1: string[];
        selectedTitle_back_2: string[];
        selectedTitle_back_3: string[];
        selectedTitle_back_4: string[];
        selectedTitle_back_5: string[];
    } = {
        numberOfRows: 4,
        checked: true,
        selectedTitle_0: '',
        selectedTitle_1: '',
        selectedTitle_2: '',
        selectedTitle_3: '',
        selectedTitle_4: '',
        selectedTitle_5: '',
        selectedTitle_back_0: [],
        selectedTitle_back_1: [],
        selectedTitle_back_2: [],
        selectedTitle_back_3: [],
        selectedTitle_back_4: [],
        selectedTitle_back_5: [],
    };

    public cardsAllData: CardRows[] = loadCardsModuleData.allDataLoad;

    public numberOfRows: number = this.defaultCardsValues.numberOfRows;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private loadStore: LoadDataStore
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getValueForm();
    }

    test() {
        this.defaultCardsValues = {
            numberOfRows: this.Cardsform.value.option,
            checked: this.Cardsform.value.checked,
            selectedTitle_0: this.Cardsform.value.selectedTitle_0,
            selectedTitle_1: this.Cardsform.value.selectedTitle_1,
            selectedTitle_2: this.Cardsform.value.selectedTitle_2,
            selectedTitle_3: this.Cardsform.value.selectedTitle_3,
            selectedTitle_4: this.Cardsform.value.selectedTitle_4,
            selectedTitle_5: this.Cardsform.value.selectedTitle_5,
            selectedTitle_back_0: this.Cardsform.value.selectedTitle_back_0,
            selectedTitle_back_1: this.Cardsform.value.selectedTitle_back_1,
            selectedTitle_back_2: this.Cardsform.value.selectedTitle_back_2,
            selectedTitle_back_3: this.Cardsform.value.selectedTitle_back_3,
            selectedTitle_back_4: this.Cardsform.value.selectedTitle_back_4,
            selectedTitle_back_5: this.Cardsform.value.selectedTitle_back_5,
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

    public createForm(): void {
        this.Cardsform = this.formBuilder.group({
            option: [this.defaultCardsValues.numberOfRows],
            checked: [true],
            selectedTitle_0: '',
            selectedTitle_1: '',
            selectedTitle_2: '',
            selectedTitle_3: '',
            selectedTitle_4: '',
            selectedTitle_5: '',
            selectedTitle_back_0: '',
            selectedTitle_back_1: '',
            selectedTitle_back_2: '',
            selectedTitle_back_3: '',
            selectedTitle_back_4: '',
            selectedTitle_back_5: '',
        });
    }

    public getValueForm(): void {
        this.Cardsform.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                this.numberOfRows = parseInt(value.option);
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
