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
import type { DispatchColumn } from '@pages/dispatch/pages/dispatch/components/dispatch-table/models';
import { DispatchTableStringEnum } from '@pages/dispatch/pages/dispatch/components/dispatch-table/enums';

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
        this.isResizeEnabled = value;

        if (!value && this.mouseMoveListener) this.mouseMoveListener();

        this.checkWidth();
    }
    @Input() set isNoteExpanded(value: boolean) {
        this.setExpandedValue(
            this._isNoteExpanded,
            value,
            DispatchTableStringEnum.NOTE
        );
    }
    @Input() set hasAdditionalFieldTruck(value: boolean) {
        this.setExpandedValue(
            this._hasAdditionalFieldTruck,
            value,
            DispatchTableStringEnum.TRUCK_1
        );
    }
    @Input() set hasAdditionalFieldTrailer(value: boolean) {
        this.setExpandedValue(
            this._hasAdditionalFieldTrailer,
            value,
            DispatchTableStringEnum.TRAILER_1
        );
    }
    @Output() onResizeAction = new EventEmitter<{
        width: number;
        column: DispatchColumn;
    }>();

    private _columns: DispatchColumn[] = [];
    private isResizeEnabled: boolean = true;
    private _isNoteExpanded: boolean = true;
    private minWidth: number;
    private maxWidth: number;
    private startX: number;
    private startWidth: number;

    private isResizing = false;

    private mouseMoveListener;

    private isColumnResized: boolean = false;

    private _hasAdditionalFieldTruck: boolean = false;
    private _hasAdditionalFieldTrailer: boolean = false;

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngOnInit(): void {
        if (this.isResizeEnabled) {
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
        if (!this.isResizeEnabled) return;
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
        if (!this.isResizing || !this.isResizeEnabled) return;

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

            const columnTitle =
                this.title === DispatchTableStringEnum.DRIVER_1
                    ? DispatchTableStringEnum.NAME
                    : this.title === DispatchTableStringEnum.PICKUP
                    ? DispatchTableStringEnum.PICKUP_DELIVERY
                    : this.title;

            const currentColumn = this._columns.find(
                (column) =>
                    column.title.toLowerCase() === columnTitle.toLowerCase()
            );

            if (currentColumn)
                this.onResizeAction.emit({
                    width: this.el.nativeElement.offsetWidth,
                    column: currentColumn,
                });
        }
    }

    private checkWidth(isColumnResized?: boolean): void {
        switch (this.title) {
            case DispatchTableStringEnum.NOTE:
                const noteMinWidth = this._isNoteExpanded
                    ? this._columns[17]?.minWidth
                    : this.isResizeEnabled
                    ? 32
                    : 25;
                const noteMaxWidth = this._isNoteExpanded
                    ? this._columns[17]?.width
                    : this.isResizeEnabled
                    ? 32
                    : 25;

                const minWidthValue = this._isNoteExpanded
                    ? noteMinWidth - 9
                    : noteMinWidth;

                if (
                    this.el.nativeElement.offsetWidth > 20 &&
                    this.el.nativeElement.offsetWidth < minWidthValue
                )
                    this.renderer.setStyle(
                        this.el.nativeElement,
                        DispatchTableStringEnum.WIDTH,
                        `${
                            this._isNoteExpanded
                                ? noteMinWidth + 32
                                : noteMinWidth
                        }px`
                    );

                if (this.el.nativeElement.offsetWidth > noteMaxWidth)
                    this.renderer.setStyle(
                        this.el.nativeElement,
                        DispatchTableStringEnum.WIDTH,
                        `${noteMaxWidth}px`
                    );

                this.maxWidth = noteMaxWidth;
                this.minWidth = noteMinWidth;
                break;
            case DispatchTableStringEnum.DISPATCHER_1:
                this.maxWidth = this._columns[16]?.width;
                this.minWidth = this._columns[16]?.minWidth;

                const dispatcherMinWidth = this.isResizeEnabled
                    ? this.minWidth - 2
                    : this.minWidth - 9;

                this.renderer.setStyle(
                    this.el.nativeElement,
                    DispatchTableStringEnum.WIDTH,
                    `${dispatcherMinWidth}px`
                );

                break;
            case DispatchTableStringEnum.PROGRESS:
                this.maxWidth = this._columns[14]?.width;
                this.minWidth = this._columns[14]?.minWidth;
                break;
            case DispatchTableStringEnum.INSPECTION:
                this.maxWidth = this._columns[10]?.width;
                this.minWidth = this._columns[10]?.minWidth;

                const inspectionMinWidth = this.isResizeEnabled
                    ? this.minWidth - 2
                    : this.minWidth - 9;

                this.renderer.setStyle(
                    this.el.nativeElement,
                    DispatchTableStringEnum.WIDTH,
                    `${inspectionMinWidth}px`
                );

                break;
            case DispatchTableStringEnum.PARKING_1:
                this.maxWidth = this._columns[15]?.width;
                this.minWidth = this._columns[15]?.minWidth;
                break;
            case DispatchTableStringEnum.TRAILER_1:
                const trailerMinWidth = this._columns[3]?.hidden
                    ? this._columns[2]?.minWidth
                    : this._columns[2]?.minWidth + 40;

                if (
                    isColumnResized &&
                    this.el.nativeElement.offsetWidth > 50 &&
                    this.el.nativeElement.offsetWidth < trailerMinWidth + 11
                )
                    this.renderer.setStyle(
                        this.el.nativeElement,
                        DispatchTableStringEnum.WIDTH,
                        `${trailerMinWidth + 11}px`
                    );

                this.maxWidth = this._columns[2]?.width;
                this.minWidth = trailerMinWidth;
                break;
            case DispatchTableStringEnum.DRIVER_1:
                const driverMinWidth = this._columns[6]?.hidden
                    ? this._columns[4]?.minWidth
                    : this._columns[4]?.minWidth + 60;

                if (this.el.nativeElement.offsetWidth < driverMinWidth - 9)
                    this.renderer.setStyle(
                        this.el.nativeElement,
                        DispatchTableStringEnum.WIDTH,
                        `${driverMinWidth - 9}px`
                    );

                this.maxWidth = this._columns[4]?.width;
                this.minWidth = driverMinWidth;
                break;
            case DispatchTableStringEnum.TRUCK_1:
                const truckMinWidth = this._columns[1]?.hidden
                    ? this._columns[0]?.minWidth
                    : this._columns[0]?.minWidth + 40;

                if (
                    isColumnResized &&
                    this.el.nativeElement.offsetWidth > 50 &&
                    this.el.nativeElement.offsetWidth < truckMinWidth + 11
                )
                    this.renderer.setStyle(
                        this.el.nativeElement,
                        DispatchTableStringEnum.WIDTH,
                        `${truckMinWidth + 11}px`
                    );

                this.maxWidth = this._columns[0]?.width;
                this.minWidth = truckMinWidth;

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
                this.maxWidth = this._columns[13]?.minWidth;
                this.minWidth = this._columns[13]?.minWidth;
                break;
        }

        if (
            this.isResizeEnabled &&
            (this.title === DispatchTableStringEnum.DISPATCHER_1 ||
                this.title === DispatchTableStringEnum.INSPECTION ||
                (this.title === DispatchTableStringEnum.NOTE &&
                    !this._isNoteExpanded))
        ) {
            this.maxWidth = 32;
            this.minWidth = 32;
        } else {
            this.maxWidth = this.maxWidth - 9;
            this.minWidth = this.minWidth - 9;
        }
    }

    private setExpandedValue(
        currentValue: boolean,
        newValue: boolean,
        type: string
    ): void {
        const valueChanged = currentValue !== newValue;

        switch (type) {
            case DispatchTableStringEnum.NOTE:
                this._isNoteExpanded = newValue;
                break;
            case DispatchTableStringEnum.TRUCK_1:
                this._hasAdditionalFieldTruck = newValue;
                break;
            case DispatchTableStringEnum.TRAILER_1:
                this._hasAdditionalFieldTrailer = newValue;
                break;
        }

        this.checkWidth(valueChanged);
    }
}
