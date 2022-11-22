import {
    Directive,
    OnInit,
    Renderer2,
    Input,
    ElementRef,
    OnChanges,
    SimpleChanges,
    Output,
    EventEmitter,
} from '@angular/core';

@Directive({
    selector: '[resizeColumn]',
})
export class ResizeColumnDirective implements OnInit, OnChanges {
    @Output() resizeing: EventEmitter<any> = new EventEmitter();
    @Input('resizeColumn') canDoResize: boolean;
    @Input() index: number;
    @Input() tableSection: string;
    @Input() tableColumn: any;

    private startX: number;
    private startWidth: number;
    private column: HTMLElement;
    table: any;
    private pressed: boolean;
    resizer: any;
    newColumnWidth: number;

    constructor(private renderer: Renderer2, private el: ElementRef) {
        this.column = this.el.nativeElement;
    }

    ngOnInit() {
        this.table = document.querySelector('.table-container');
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.canDoResize?.currentValue !== undefined) {
            if (changes?.canDoResize?.currentValue) {
                this.addResizer();
            } else if (
                !changes?.canDoResize?.currentValue &&
                !changes?.canDoResize?.firstChange
            ) {
                this.removeResizer();
            }
        }

        if (!changes?.tableColumn?.firstChange && changes?.tableColumn) {
            this.tableColumn = changes.tableColumn.currentValue;
        }
    }

    addResizer() {
        this.resizer = this.renderer.createElement('div');
        this.renderer.addClass(this.resizer, 'resise-btn');
        this.renderer.appendChild(this.column, this.resizer);
        this.renderer.listen(this.resizer, 'mousedown', this.onMouseDown);
        this.renderer.listen('document', 'mousemove', this.onMouseMove);
        this.renderer.listen('document', 'mouseup', this.onMouseUp);
    }

    removeResizer() {
        this.renderer.removeClass(this.resizer, 'resise-btn');
        this.renderer.removeChild(this.column, this.resizer);
    }

    onMouseDown = (event: MouseEvent) => {
        if (!this.pressed) {
            this.resizeing.emit({
                isResizeing: true,
                section: this.tableSection,
            });

            this.pressed = true;
            this.startX = event.pageX;
            this.startWidth = this.column.offsetWidth;
        }
    };

    onMouseMove = (event: MouseEvent) => {
        if (this.pressed && event.buttons) {
            // Calculate width of column
            this.newColumnWidth = this.startWidth + (event.pageX - this.startX);

            const maxWidth = this.tableColumn.minWidth * 2;

            if (!this.tableColumn.minWidth) {
                this.resizeing.emit({
                    isResizeing: true,
                    width: this.newColumnWidth,
                    index: this.index,
                    section: this.tableSection,
                });

                return;
            }

            // Send Resizeing Data If Width Is Between Min And Max Width
            if (
                this.newColumnWidth > this.tableColumn.minWidth &&
                this.newColumnWidth < maxWidth
            ) {
                this.resizeing.emit({
                    isResizeing: true,
                    width: this.newColumnWidth,
                    index: this.index,
                    section: this.tableSection,
                });
            }

            // If It Has Reached Min Or Max Width, Show Animation
            else {
                this.resizeing.emit({
                    beyondTheLimits: true,
                    index: this.index,
                    isResizeing: false,
                    isPined: this.tableColumn.isPined,
                });
            }
        }
    };

    onMouseUp = () => {
        if (this.pressed) {
            this.pressed = false;

            this.resizeing.emit({
                isResizeing: false,
                section: this.tableSection,
            });

            window.getSelection().removeAllRanges();
        }
    };
}
