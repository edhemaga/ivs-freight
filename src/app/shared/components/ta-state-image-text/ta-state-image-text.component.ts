import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
    selector: 'app-ta-state-image-text',
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,
    ],
    templateUrl: './ta-state-image-text.component.html',
    styleUrls: ['./ta-state-image-text.component.scss'],
    standalone: true,
})
export class TaStateImageTextComponent {
    @Input() isCanadaStates?: boolean;
    @Input() stateAbbreviation: string;

    constructor() {}
}
