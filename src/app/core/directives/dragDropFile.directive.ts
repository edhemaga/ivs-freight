import {Directive, EventEmitter, HostBinding, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[appDragDropFile]',
})
export class DragDropFileDirective {
  @Output() onDropFile = new EventEmitter<any>();
  @Output() onDropBackground = new EventEmitter<boolean>();

  @HostBinding('attr.class') public class = 'dragDropFile';

  constructor() {
  }

  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.onDropBackground.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.onDropBackground.emit(false);
  }

  @HostListener('drop', ['$event'])
  public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.onDropBackground.emit(false);

    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.onDropFile.emit(files);
    }
  }
}
