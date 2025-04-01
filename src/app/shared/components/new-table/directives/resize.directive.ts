import {
    Directive,
    ElementRef,
    HostListener,
    Renderer2,
    AfterViewInit,
    Output,
    EventEmitter,
} from '@angular/core';

@Directive({
    selector: '[appResizableColumn]',
    standalone: true,
})
export class ResizableColumnDirective implements AfterViewInit {
    private resizer!: HTMLElement;
    private startX = 0;
    private startWidth = 0;
    private minWidth = 100; // Default min width
    private maxWidth = 300; // Default max width

    @Output() onColumnResize = new EventEmitter<any>();

    constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ) {}

    ngAfterViewInit(): void {
        this.initializeResizer();
    }

    private initializeResizer(): void {
        // Create a resize handle
        this.resizer = this.renderer.createElement('div');
        this.renderer.addClass(this.resizer, 'resize-handle');

        // Attach the resizer to the element
        this.renderer.appendChild(this.el.nativeElement, this.resizer);

        // Extract min/max width from styles if available
        const style = window.getComputedStyle(this.el.nativeElement);
        this.minWidth = parseInt(style.minWidth) || this.minWidth;
        this.maxWidth = parseInt(style.maxWidth) || this.maxWidth;

        // Add event listeners
        this.renderer.listen(
            this.resizer,
            'mousedown',
            this.onMouseDown.bind(this)
        );
    }

    private onMouseDown(event: MouseEvent): void {
        this.startX = event.clientX;
        this.startWidth = this.el.nativeElement.offsetWidth;

        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    private onMouseMove = (event: MouseEvent): void => {
        const newWidth = this.startWidth + (event.clientX - this.startX);
        if (newWidth >= this.minWidth && newWidth <= this.maxWidth) {
            this.renderer.setStyle(
                this.el.nativeElement,
                'width',
                `${newWidth}px`
            );

            this.onColumnResize.emit(newWidth);
        }
    };

    private onMouseUp = (): void => {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
    };
}
