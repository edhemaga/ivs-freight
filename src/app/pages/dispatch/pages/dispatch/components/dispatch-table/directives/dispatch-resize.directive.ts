import {
    Directive,
    ElementRef,
    HostListener,
    Input,
    Renderer2,
    OnInit,
} from '@angular/core';
import type { DispatchColumn } from '../models/dispatch-column.model';
import { DispatchTableStringEnum } from '../enums/dispatch-table-string.enum';

@Directive({
    selector: '[appResizable]',
    standalone: true,
})
export class ResizableDirective implements OnInit {
    @Input() title: string;
    @Input() columns: DispatchColumn[];
    @Input() resizeEnabled: boolean = true;
    private startX: number;
    private startWidth: number;

    private minWidth: number;
    private maxWidth: number;
    private isResizing = false;

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngOnInit(): void {
        if (this.resizeEnabled) {
            this.renderer.setStyle(
                this.el.nativeElement,
                'cursor',
                'col-resize'
            );
        }

        this.checkWidth();
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (!this.resizeEnabled) return;
        event.preventDefault();

        this.isResizing = true;
        this.startX = event.clientX;
        this.startWidth = this.el.nativeElement.offsetWidth;

        // Listen for mousemove and mouseup events on the document
        this.renderer.listen(
            'document',
            'mousemove',
            this.onMouseMove.bind(this)
        );
        this.renderer.listen('document', 'mouseup', this.onMouseUp.bind(this));
    }

    private onMouseMove(event: MouseEvent): void {
        if (!this.isResizing || !this.resizeEnabled) return;

        const newWidth = this.startWidth + (event.clientX - this.startX);

        // Apply width constraints
        if (newWidth >= this.minWidth && newWidth <= this.maxWidth) {
            this.renderer.setStyle(
                this.el.nativeElement,
                'width',
                `${newWidth}px`
            );
        }
    }

    private onMouseUp(): void {
        this.isResizing = false;
    }

    private checkWidth(): void {
        switch (this.title) {
            case DispatchTableStringEnum.NOTE:
                this.maxWidth = this.columns[17]?.width;
                this.minWidth = this.columns[17]?.minWidth;

                break;
            case DispatchTableStringEnum.DISPATCHER_1:
                this.maxWidth = this.columns[16]?.width;
                this.minWidth = this.columns[16]?.minWidth;

                break;
            case DispatchTableStringEnum.PROGRESS:
                this.maxWidth = this.columns[14]?.width;
                this.minWidth = this.columns[14]?.minWidth;
                break;
            case DispatchTableStringEnum.INSPECTION:
                this.maxWidth = this.columns[10]?.width;
                this.minWidth = this.columns[10]?.minWidth;
                break;
            case DispatchTableStringEnum.PARKING_1:
                this.maxWidth = this.columns[15]?.width;
                this.minWidth = this.columns[15]?.minWidth;
                break;
            case DispatchTableStringEnum.TRAILER_1:
                this.maxWidth = this.columns[2]?.width;
                this.minWidth = this.columns[2]?.minWidth;
                break;
            case DispatchTableStringEnum.DRIVER_1:
                this.maxWidth = this.columns[4]?.width;
                this.minWidth = this.columns[4]?.minWidth;
                break;
            case DispatchTableStringEnum.TRUCK_1:
                this.maxWidth = this.columns[0]?.width;
                this.minWidth = this.columns[0]?.minWidth;
                break;
            case DispatchTableStringEnum.STATUS:
                this.maxWidth = this.columns[12]?.width;
                this.minWidth = this.columns[12]?.minWidth;
                break;
            case DispatchTableStringEnum.LAST_LOCATION:
                this.maxWidth = this.columns[11]?.width;
                this.minWidth = this.columns[11]?.minWidth;
                break;
            case DispatchTableStringEnum.PICKUP:
                this.maxWidth = this.columns[13]?.width;
                this.minWidth = this.columns[13]?.minWidth;
                break;
        }
    }
}
