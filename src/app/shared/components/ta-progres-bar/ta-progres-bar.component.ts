import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-ta-progres-bar',
    templateUrl: './ta-progres-bar.component.html',
    styleUrls: ['./ta-progres-bar.component.scss'],
    imports: [CommonModule, NgbPopoverModule, NgbModule],
    standalone: true,
})
export class TaProgresBarComponent {
    @Input() type: string = 'days';
    @Input() text: string;
    @Input() percents: number;
    @Input() data: any;
    @Input() column: any;
    @Input() isTable: boolean = false;
}
