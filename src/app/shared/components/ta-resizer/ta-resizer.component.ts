import { CommonModule } from '@angular/common';
import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    Renderer2,
    ElementRef,
    OnDestroy,
} from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

// Svg routes
import { DispatchParkingSvgRoutes } from '@pages/dispatch/pages/dispatch/utils/helpers/dispatch-parking-svg-routes';

@Component({
    selector: 'app-ta-resizer',
    templateUrl: './ta-resizer.component.html',
    styleUrls: ['./ta-resizer.component.scss'],
    standalone: true,
    imports: [CommonModule, AngularSvgIconModule],
})
export class TaResizerComponent implements OnInit, OnChanges, OnDestroy {
    public svgRoutes = DispatchParkingSvgRoutes;

    @Input() initialFirstElementHeight: number;
    @Input() initialSecondElementHeight: number;
    @Input() minHeightFirstElement: number = 50;
    @Input() minHeightSecondElement: number = 50;
    @Input() isFirstElementOpen: boolean = true;
    @Input() isSecondElementOpen: boolean = true;
    @Input() isLoadList: boolean = false;

    public firstElementHeight: number;
    public secondElementHeight: number;
    public isDragging = false;

    private moveListener: () => void;
    private upListener: () => void;

    constructor(private renderer: Renderer2, private elRef: ElementRef) {}

    ngOnInit(): void {
        this.updateHeights();
        this.addGlobalEventListeners();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.isFirstElementOpen || changes.isSecondElementOpen) {
            this.updateHeights();
        }
    }

    ngOnDestroy(): void {
        this.removeGlobalEventListeners();
    }

    private updateHeights(): void {
        this.firstElementHeight = this.isFirstElementOpen
            ? this.initialFirstElementHeight
            : this.minHeightFirstElement;
        this.secondElementHeight = this.isSecondElementOpen
            ? this.initialSecondElementHeight
            : this.minHeightSecondElement;
    }

    public onMouseDown(event: MouseEvent): void {
        this.isDragging = true;
        this.renderer.setStyle(document.body, 'cursor', 'row-resize');
        event.preventDefault();
    }

    private onMouseMove(event: MouseEvent): void {
        if (!this.isDragging) return;

        const container = this.elRef.nativeElement.querySelector(
            '.ta-resizer-container'
        );
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const newFirstElementHeight = event.clientY - containerRect.top;
        const newSecondElementHeight =
            containerRect.bottom - event.clientY - 10;

        if (
            newFirstElementHeight > this.minHeightFirstElement &&
            newSecondElementHeight > this.minHeightSecondElement
        ) {
            this.firstElementHeight = newFirstElementHeight;
            this.secondElementHeight = newSecondElementHeight;
        }
    }

    private onMouseUp(): void {
        if (this.isDragging) {
            this.isDragging = false;
            this.renderer.setStyle(document.body, 'cursor', 'default');
        }
    }

    private addGlobalEventListeners(): void {
        this.moveListener = this.renderer.listen(
            'document',
            'mousemove',
            (event: MouseEvent) => this.onMouseMove(event)
        );
        this.upListener = this.renderer.listen('document', 'mouseup', () =>
            this.onMouseUp()
        );
    }

    private removeGlobalEventListeners(): void {
        if (this.moveListener) this.moveListener();
        if (this.upListener) this.upListener();
    }
}
