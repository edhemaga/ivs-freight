import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TaModalComponent } from '../../shared/ta-modal/ta-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { FormService } from 'src/app/core/services/form/form.service';
import {
    FormGroup,
    ReactiveFormsModule,
    UntypedFormBuilder,
} from '@angular/forms';
import { TaInputRadiobuttonsComponent } from '../../shared/ta-input-radiobuttons/ta-input-radiobuttons.component';

@Component({
    selector: 'app-load-cards-modal',
    templateUrl: './load-cards-modal.component.html',
    styleUrls: ['./load-cards-modal.component.scss'],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    providers: [ModalService, FormService],
    imports: [
        TaModalComponent,
        ReactiveFormsModule,
        TaInputRadiobuttonsComponent,
    ],
})
export class LoadCardsModalComponent implements OnInit {
    public radioButtonsForm: FormGroup;

    constructor(private formBuilder: UntypedFormBuilder) {}

    ngOnInit(): void {
        this.createForm();
        console.log(this.radioButtonsForm.value);
    }

    createForm(): any {
        this.radioButtonsForm = this.formBuilder.group({
            option: [4],
        });
    }
}
