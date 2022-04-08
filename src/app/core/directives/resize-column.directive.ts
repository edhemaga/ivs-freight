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
  @Input('resizeColumn') canDoResize: boolean;
  @Input() index: number;
  @Output() resizeing: EventEmitter<any> = new EventEmitter();

  private startX: number;
  private startWidth: number;
  private column: HTMLElement;
  private table: HTMLElement;
  private pressed: boolean;
  resizer: any;
  newColumnWidth: number;

  constructor(private renderer: Renderer2, private el: ElementRef) {
    this.column = this.el.nativeElement;
  }

  ngOnInit() {}

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
  }

  addResizer() {
    const row = this.renderer.parentNode(this.column);
    const thead = this.renderer.parentNode(row);
    this.table = this.renderer.parentNode(thead);

    this.resizer = this.renderer.createElement('div');
    this.renderer.addClass(this.resizer, 'resise-btn');
    this.renderer.appendChild(this.column, this.resizer);
    this.renderer.listen(this.resizer, 'mousedown', this.onMouseDown);
    this.renderer.listen(this.table, 'mousemove', this.onMouseMove);
    this.renderer.listen('document', 'mouseup', this.onMouseUp);
  }

  removeResizer() {
    this.renderer.removeClass(this.resizer, 'resise-btn');
    this.renderer.removeChild(this.column, this.resizer);
  }

  onMouseDown = (event: MouseEvent) => {
    this.resizeing.emit({
      isResizeing: true,
      width: null,
      index: this.index,
    });

    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = this.column.offsetWidth;
  };

  onMouseMove = (event: MouseEvent) => {
    if (this.pressed && event.buttons) {
      this.renderer.addClass(this.table, 'resizing');

      // Calculate width of column
      this.newColumnWidth = this.startWidth + (event.pageX - this.startX);

      // Set table header width
      this.renderer.setStyle(this.column, 'width', `${this.newColumnWidth}px`);
    }
  };

  onMouseUp = () => {
    if (this.pressed) {
      this.resizeing.emit({
        isResizeing: false,
        width: this.newColumnWidth,
        index: this.index,
      });

      this.pressed = false;
      this.renderer.removeClass(this.table, 'resizing');
    }
  };
}
