import {
    Directive,
    ElementRef,
    HostListener,
    Input,
    Renderer2,
    OnInit,
    Output,
    EventEmitter,
} from '@angular/core';
import type { DispatchColumn } from '../models/dispatch-column.model';
import { DispatchTableStringEnum } from '../enums/dispatch-table-string.enum';

@Directive({
    selector: '[appResizable]',
    standalone: true,
})
export class ResizableDirective implements OnInit {
    @Input() title: string;
    @Input() set columns(values: DispatchColumn[]) {
        if (values) this._columns = values;

        this.checkWidth();
    }
    @Input() set resizeEnabled(value: boolean) {
        this._resizeEnabled = value;

        if (!value && this.mouseMoveListener) this.mouseMoveListener();
    }
    @Input() set isNoteExpanded(value: boolean) {
        this._isNoteExpanded = value;

        this.checkWidth();
    }
    @Output() onNoteResize = new EventEmitter();

    private _columns: DispatchColumn[] = [];
    private _resizeEnabled: boolean = true;
    private _isNoteExpanded: boolean = true;
    private minWidth: number;
    private maxWidth: number;
    private startX: number;
    private startWidth: number;

    private isResizing = false;

    private mouseMoveListener;

    private isColumnResized: boolean = false;

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngOnInit(): void {
        if (this._resizeEnabled) {
            this.renderer.setStyle(
                this.el.nativeElement,
                DispatchTableStringEnum.CURSOR,
                DispatchTableStringEnum.COL_RESIZE
            );
        }

        this.checkWidth();
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (!this._resizeEnabled) return;
        event.preventDefault();

        this.isResizing = true;
        this.startX = event.clientX;
        this.startWidth = this.el.nativeElement.offsetWidth;

        // Listen for mousemove and mouseup events on the document

        this.mouseMoveListener = this.renderer.listen(
            DispatchTableStringEnum.DOCUMENT,
            DispatchTableStringEnum.MOUSE_MOVE,
            this.onMouseMove.bind(this)
        );

        this.renderer.listen(
            DispatchTableStringEnum.DOCUMENT,
            DispatchTableStringEnum.MOUSE_UP,
            this.onMouseUp.bind(this)
        );
    }

    private onMouseMove(event: MouseEvent): void {
        if (!this.isResizing || !this._resizeEnabled) return;

        const newWidth = this.startWidth + (event.clientX - this.startX);

        // Apply width constraints
        if (newWidth >= this.minWidth && newWidth <= this.maxWidth) {
            this.renderer.setStyle(
                this.el.nativeElement,
                DispatchTableStringEnum.WIDTH,
                `${newWidth}px`
            );

            this.isColumnResized = true;
        }
    }

    private onMouseUp(): void {
        this.isResizing = false;

        if (this.isColumnResized) {
            this.isColumnResized = false;

            if (this.title === DispatchTableStringEnum.NOTE)
                this.onNoteResize.emit(this.el.nativeElement.offsetWidth);
        }
    }

    private checkWidth(): void {
        switch (this.title) {
            case DispatchTableStringEnum.NOTE:
                this.maxWidth = this._columns[17]?.width;
                this.minWidth = this._columns[17]?.minWidth;

                const noteMinWidth =
                    !this._isNoteExpanded &&
                    this.el.nativeElement.offsetWidth > 34
                        ? 34
                        : this.el.nativeElement.offsetWidth < this.minWidth
                        ? this.minWidth
                        : this.el.nativeElement.offsetWidth;

                this.renderer.setStyle(
                    this.el.nativeElement,
                    DispatchTableStringEnum.WIDTH,
                    `${noteMinWidth}px`
                );

                break;
            case DispatchTableStringEnum.DISPATCHER_1:
                this.maxWidth = this._columns[16]?.width;
                this.minWidth = this._columns[16]?.minWidth;

                break;
            case DispatchTableStringEnum.PROGRESS:
                this.maxWidth = this._columns[14]?.width;
                this.minWidth = this._columns[14]?.minWidth;
                break;
            case DispatchTableStringEnum.INSPECTION:
                this.maxWidth = this._columns[10]?.width;
                this.minWidth = this._columns[10]?.minWidth;
                break;
            case DispatchTableStringEnum.PARKING_1:
                this.maxWidth = this._columns[15]?.width;
                this.minWidth = this._columns[15]?.minWidth;
                break;
            case DispatchTableStringEnum.TRAILER_1:
                this.maxWidth = this._columns[2]?.width;
                this.minWidth = this._columns[2]?.minWidth;
                break;
            case DispatchTableStringEnum.DRIVER_1:
                const driverMinWidth = this._columns[6]?.hidden
                    ? this._columns[4]?.minWidth
                    : this._columns[4]?.minWidth + 60;

                if (this.el.nativeElement.offsetWidth < driverMinWidth)
                    this.renderer.setStyle(
                        this.el.nativeElement,
                        DispatchTableStringEnum.WIDTH,
                        `${driverMinWidth}px`
                    );

                this.maxWidth = this._columns[4]?.width;
                this.minWidth = driverMinWidth;
                break;
            case DispatchTableStringEnum.TRUCK_1:
                this.maxWidth = this._columns[0]?.width;
                this.minWidth = this._columns[0]?.minWidth;
                break;
            case DispatchTableStringEnum.STATUS:
                this.maxWidth = this._columns[12]?.width;
                this.minWidth = this._columns[12]?.minWidth;
                break;
            case DispatchTableStringEnum.LAST_LOCATION:
                this.maxWidth = this._columns[11]?.width;
                this.minWidth = this._columns[11]?.minWidth;
                break;
            case DispatchTableStringEnum.PICKUP:
                this.maxWidth = this._columns[13]?.width;
                this.minWidth = this._columns[13]?.minWidth;
                break;
        }
    }
}
