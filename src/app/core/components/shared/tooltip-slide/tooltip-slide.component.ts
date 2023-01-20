import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-tooltip-slide',
    templateUrl: './tooltip-slide.component.html',
    styleUrls: ['./tooltip-slide.component.scss'],
})
export class TooltipSlideComponent implements OnInit {
    @Input() show: boolean = false;
    @Input() name: boolean = false;
    constructor() {}

    ngOnInit(): void {}
}
