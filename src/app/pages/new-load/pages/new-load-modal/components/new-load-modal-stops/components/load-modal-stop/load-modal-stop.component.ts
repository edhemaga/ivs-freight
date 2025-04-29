import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
    LoadDatetimeRangePipe,
    LoadTimeTypePipe,
} from '@pages/load/pages/load-modal/pipes';
import { eDateTimeFormat } from '@shared/enums';

@Component({
    selector: 'app-load-modal-stop',
    standalone: true,
    templateUrl: './load-modal-stop.component.html',
    styleUrl: './load-modal-stop.component.scss',
    imports: [CommonModule, LoadTimeTypePipe, LoadDatetimeRangePipe],
})
export class LoadModalStopComponent {
    @Input() shipper: any;

    @Input() stop: any;

    @Input() isOpen: boolean;

    public eDateTimeFormat = eDateTimeFormat;
}
