import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-progres-bar',
    templateUrl: './progres-bar.component.html',
    styleUrls: ['./progres-bar.component.scss'],
    imports: [CommonModule, NgbPopoverModule, NgbModule],
    standalone: true,
})
export class ProgresBarComponent {
    @Input() type: string = 'days';
    @Input() text: string;
    @Input() percents: number;
    @Input() data: any;
    @Input() column: any;
    @Input() isTable: boolean = false;
}
