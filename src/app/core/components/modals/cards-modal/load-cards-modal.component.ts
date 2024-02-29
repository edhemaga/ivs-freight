import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
    FormControl,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';

// Modals
import { loadCardsModuleData } from './state/load.data';
import { CommonModule } from '@angular/common';

// Services
import { ModalService } from '../../shared/ta-modal/modal.service';
import { FormService } from 'src/app/core/services/form/form.service';

// Components
import { TaModalComponent } from '../../shared/ta-modal/ta-modal.component';
import { TaInputDropdownTableComponent } from '../../standalone-components/ta-input-dropdown-table/ta-input-dropdown-table.component';
import { TaCheckboxComponent } from '../../shared/ta-checkbox/ta-checkbox.component';
import { Subject, takeUntil } from 'rxjs';

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
        TaInputDropdownTableComponent,
        TaCheckboxComponent,
    ],
})
export class LoadCardsModalComponent implements OnInit {
    private destroy$ = new Subject<void>();

    public Cardsform: UntypedFormGroup;

    public defaultCardsValues: {
        numberOfRows: number;
        checked: boolean;
        selectedTitle: string[];
    } = {
        numberOfRows: 4,
        checked: true,
        selectedTitle: [],
    };

    public cardsAllData = loadCardsModuleData.allDataLoad;

    public numberOfRows: number = this.defaultCardsValues.numberOfRows;

    constructor(private formBuilder: UntypedFormBuilder) {}

    ngOnInit(): void {
        this.createForm();

        this.getValueForm();

        console.log(this.cardsAllData);
    }

    public createForm(): void {
        this.Cardsform = this.formBuilder.group({
            option: [this.defaultCardsValues.numberOfRows],
            checked: [true],
            selectedTitle: [''],
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
