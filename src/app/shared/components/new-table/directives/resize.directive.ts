import {
    Directive,
    ElementRef,
    Renderer2,
    AfterViewInit,
    Output,
    EventEmitter,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';

// interfaces
import { ITableResizeAction } from '@shared/components/new-table/interface';

@Directive({
    selector: '[appResizableColumn]',
    standalone: true,
})
export class ResizableColumnDirective implements AfterViewInit, OnChanges {
    @Input() appResizableColumn: boolean = false;
    @Input() columnId: number = null;
    @Input() minWidth: number = 0;
    @Input() maxWidth: number = 0;
    @Input() hasLabelTop: boolean = false;
    @Input() hasDoubleHeightBorder: boolean = false;

    @Output() onColumnResize = new EventEmitter<ITableResizeAction>();

    private isInitialized = false;

    // listeners
    private mouseMoveListener: () => void;
    private mouseUpListener: () => void;

    // resizer
    private resizer!: HTMLElement;
    private startX: number = 0;
    private startWidth: number = 0;

    constructor(
        private column: ElementRef,

        // renderer
        private renderer: Renderer2
    ) {}

    ngAfterViewInit(): void {
        if (this.appResizableColumn) this.initializeResizer();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.initializeDirective(changes);
    }

    private initializeDirective(changes: SimpleChanges): void {
        // safely get the latest value of appResizableColumn
        const isResizable =
            changes.appResizableColumn?.currentValue ?? this.appResizableColumn;

        if (!isResizable) {
            if (this.resizer) this.renderer.addClass(this.resizer, 'd-none');
        } else {
            if (this.isInitialized) {
                this.renderer.removeClass(this.resizer, 'd-none');

                // update position/height class if hasLabelTop or hasDoubleHeightBorder changed
                if (changes?.hasLabelTop || changes?.hasDoubleHeightBorder) {
                    this.updateResizerStyle();
                }
            } else {
                this.initializeResizer();
            }
        }
    }

    private initializeResizer(): void {
        if (!this.appResizableColumn || this.isInitialized) return;

        // create a resize handle
        this.resizer = this.renderer.createElement('div');

        // add style classes
        const classesToAdd = [
            'resize-handler',
            'pos-absolute',
            this.hasLabelTop ? 'bottom-10' : 'bottom-0',
            'end-0',
            'w-2',
            this.hasDoubleHeightBorder ? 'h-26' : 'h-14',
            'm-r-6',
            'br-1',
            'background-muted',
            'background-hover-black',
        ];
        classesToAdd.forEach((cls) =>
            this.renderer.addClass(this.resizer, cls)
        );

        // attach the resizer to the column
        this.renderer.appendChild(this.column.nativeElement, this.resizer);

        // extract min/max width from styles if available
        const style = window.getComputedStyle(this.column.nativeElement);

        this.minWidth = Number(style.minWidth) || this.minWidth;
        this.maxWidth = Number(style.maxWidth) || this.maxWidth;

        // add event listeners
        this.renderer.listen(
            this.resizer,
            'mousedown',
            this.onMouseDown.bind(this)
        );

        this.isInitialized = true;
    }

    private updateResizerStyle(): void {
        if (!this.resizer) return;

        // remove the old dynamic classes
        const classesToRemove = ['bottom-10', 'bottom-0', 'h-26', 'h-14'];
        classesToRemove.forEach((cls) =>
            this.renderer.removeClass(this.resizer, cls)
        );

        // add the correct ones
        const classesToAdd = [
            this.hasLabelTop ? 'bottom-10' : 'bottom-0',
            this.hasDoubleHeightBorder ? 'h-26' : 'h-14',
        ];
        classesToAdd.forEach((cls) =>
            this.renderer.addClass(this.resizer, cls)
        );
    }

    private onMouseMove = (event: MouseEvent): void => {
        const newWidth = this.startWidth + (event.clientX - this.startX);

        if (newWidth >= this.minWidth && newWidth <= this.maxWidth) {
            this.renderer.setStyle(
                this.column.nativeElement,
                'width',
                `${newWidth}px`
            );

            const resizeAction = {
                id: this.columnId,
                newWidth,
            };

            this.onColumnResize.emit(resizeAction);
        }
    };

    private onMouseDown(event: MouseEvent): void {
        this.startX = event.clientX;
        this.startWidth = this.column.nativeElement.offsetWidth;

        this.mouseMoveListener = this.renderer.listen(
            'document',
            'mousemove',
            this.onMouseMove
        );
        this.mouseUpListener = this.renderer.listen(
            'document',
            'mouseup',
            this.onMouseUp
        );
    }

    private onMouseUp = (): void => {
        if (this.mouseMoveListener) {
            this.mouseMoveListener();
            this.mouseMoveListener = null;
        }

        if (this.mouseUpListener) {
            this.mouseUpListener();
            this.mouseUpListener = null;
        }
    };
}
