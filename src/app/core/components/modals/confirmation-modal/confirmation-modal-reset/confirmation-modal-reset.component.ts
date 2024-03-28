import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TaModalComponent } from '../../../shared/ta-modal/ta-modal.component';

@Component({
    selector: 'app-confirmation-modal-reset',
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,

        // components
        TaModalComponent,
    ],
    templateUrl: './confirmation-modal-reset.component.html',
    styleUrls: ['./confirmation-modal-reset.component.scss'],
})
export class ConfirmationModalResetComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
