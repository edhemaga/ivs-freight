import { CommonModule } from '@angular/common';
import {
    Component,
    HostListener,
    Input,
    OnInit,
    SimpleChanges,
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
export class TaResizerComponent implements OnInit {
    // Svg
    public svgRoutes = DispatchParkingSvgRoutes;

    @Input() initialFirstElementHeight: number;
    @Input() initialSecondElementHeight: number;
    @Input() minHeightFirstElement: number = 50;
    @Input() minHeightSecondElement: number = 50;
    @Input() isFirstElementOpen: boolean = true;
    @Input() isSecondElementOpen: boolean = true;
    
    // We need to set height or modal footer will move with card when it collapse
    @Input() isLoadList: boolean = false;

    public firstElementHeight: number;
    public secondElementHeight: number;
    public isDragging = false;

    ngOnInit(): void {
        this.updateHeights();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.isFirstElementOpen || changes.isSecondElementOpen) {
            this.updateHeights();
        }
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
        document.body.style.cursor = 'row-resize';
        event.preventDefault();
    }

    @HostListener('document:mousemove', ['$event'])
    public onMouseMove(event: MouseEvent): void {
        if (!this.isDragging) return;

        const container = (event.target as HTMLElement).closest(
            '.ta-resizer-container'
        );
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const newFirstElementHeight = event.clientY - containerRect.top;
        // Adjust for handle height
        const newSecondElementHeight =
            containerRect.bottom - event.clientY - 10;

        // Ensure both divs maintain their respective minimum heights
        if (
            newFirstElementHeight > this.minHeightFirstElement &&
            newSecondElementHeight > this.minHeightSecondElement
        ) {
            this.firstElementHeight = newFirstElementHeight;
            this.secondElementHeight = newSecondElementHeight;
        }
    }

    @HostListener('document:mouseup')
    public onMouseUp(): void {
        this.isDragging = false;
        document.body.style.cursor = 'default';
    }
}
