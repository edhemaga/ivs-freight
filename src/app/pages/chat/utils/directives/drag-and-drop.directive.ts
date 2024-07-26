import {
    Directive,
    EventEmitter,
    HostBinding,
    HostListener,
    Output
} from "@angular/core";

@Directive({
    selector: '[dragAndDrop]',
})
export class DragAndDropDirective {
    @HostBinding('class.fileover') fileOver: boolean;

    @Output() fileDropped = new EventEmitter<FileList>();

    @HostListener('dragOver', ['$event']) onDragOver(event): void {
        event.preventDefault();
        event.stopPropagation();
        this.fileOver = true;
    }

    @HostListener('dragLeave', ['$event']) public onDragLeave(event): void {
        event.preventDefault();
        event.stopPropagation();
        this.fileOver = true;
    }

    @HostListener('drop', ['$event']) public ondrop(event): void {
        event.preventDefault();
        event.stopPropagation();
        this.fileOver = false;
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            this.fileDropped.emit(files);
        }
    }
}