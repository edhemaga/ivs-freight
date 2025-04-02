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

    @Output() onColumnResize = new EventEmitter<ITableResizeAction>();

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
        if (changes.appResizableColumn.currentValue) {
            this.appResizableColumn
                ? this.initializeResizer()
                : this.renderer.addClass(this.resizer, 'd-none');
        }
    }

    private initializeResizer(): void {
        if (!this.appResizableColumn) return;

        // create a resize handle
        this.resizer = this.renderer.createElement('div');

        // add style classes
        const classes = [
            'resize-handler',
            'pos-absolute',
            'bottom-0',
            'end-0',
            'w-2',
            'h-14',
            'm-r-4',
            'background-muted',
            'background-hover-black',
        ];
        classes.forEach((cls) => this.renderer.addClass(this.resizer, cls));

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
