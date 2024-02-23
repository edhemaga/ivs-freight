import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-progres-bar',
    templateUrl: './progres-bar.component.html',
    styleUrls: ['./progres-bar.component.scss'],
    imports: [CommonModule],
    standalone: true,
})
export class ProgresBarComponent {
    @Input() percents: number;
    @Input() text: string;
}
