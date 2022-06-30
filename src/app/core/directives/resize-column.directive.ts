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
import { NotificationService } from '../services/notification/notification.service';

@Directive({
  selector: '[resizeColumn]',
})
export class ResizeColumnDirective implements OnInit, OnChanges {
  @Input('resizeColumn') canDoResize: boolean;
  @Input() index: number;
  @Input() tableSection: string;
  @Input() tableColumn: any;
  @Output() resizeing: EventEmitter<any> = new EventEmitter();

  private startX: number;
  private startWidth: number;
  private column: HTMLElement;
  private table: HTMLElement;
  private pressed: boolean;
  resizer: any;
  newColumnWidth: number;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private notificationService: NotificationService
  ) {
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

      /* TODO: ukloni kada se doda na sve tabele i kolone minWidth */
      if (!this.tableColumn.minWidth) {
        console.log('Ne postoji min sirina na ovoj tabeli ili koloni, resize se radi normalno bez limita');
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
      // If It Has Reached Min Or Max Width, Show Notification
      else {
        this.onMouseUp();

        if (this.newColumnWidth <= this.tableColumn.minWidth) {
          this.notificationService.warning(
            `Reached a minimum width`,
            'Warning:'
          );
        } else if (this.newColumnWidth >= maxWidth) {
          this.notificationService.warning(`Reached maximum width`, 'Warning:');
        }
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
