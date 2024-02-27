import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TaModalComponent } from '../../shared/ta-modal/ta-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { FormService } from 'src/app/core/services/form/form.service';

@Component({
    selector: 'app-load-cards-modal',
    templateUrl: './load-cards-modal.component.html',
    styleUrls: ['./load-cards-modal.component.scss'],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    providers: [ModalService, FormService],
    imports: [TaModalComponent],
})
export class LoadCardsModalComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
