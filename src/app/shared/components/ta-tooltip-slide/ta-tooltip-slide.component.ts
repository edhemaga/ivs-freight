import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-ta-tooltip-slide',
    templateUrl: './ta-tooltip-slide.component.html',
    standalone: true,
    imports: [CommonModule],
    styleUrls: ['./ta-tooltip-slide.component.scss'],
})
export class TaTooltipSlideComponent implements OnInit {
    @Input() show: boolean = false;
    @Input() name: boolean = false;
    constructor() {}

    ngOnInit(): void {}
}
