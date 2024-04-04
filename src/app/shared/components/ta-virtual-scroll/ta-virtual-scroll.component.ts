import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ScrollingModule,
    VIRTUAL_SCROLL_STRATEGY,
} from '@angular/cdk/scrolling';
import { ScrolllStrategy } from './strategy';

function factory(dir: TaVirtualScrollComponent) {
    return dir.scrollStrategy;
}

@Component({
    selector: 'app-ta-virtual-scroll',
    standalone: true,
    imports: [CommonModule, ScrollingModule],
    templateUrl: './ta-virtual-scroll.component.html',
    styleUrls: ['./ta-virtual-scroll.component.scss'],
    providers: [
        {
            provide: VIRTUAL_SCROLL_STRATEGY,
            useFactory: factory,
            deps: [forwardRef(() => TaVirtualScrollComponent)],
        },
    ],
})
export class TaVirtualScrollComponent implements OnInit {
    scrollStrategy: ScrolllStrategy = new ScrolllStrategy(0, 0);

    @Input() data: any[] = [];
    constructor() {}

    ngOnInit(): void {}
}
