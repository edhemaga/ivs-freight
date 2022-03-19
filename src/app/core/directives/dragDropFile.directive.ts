import {Directive, EventEmitter, HostBinding, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[appDragDropFile]',
})
export class DragDropFileDirective {
  @Output() onDropFile = new EventEmitter<any>();
  @Output() onDropBackground = new EventEmitter<boolean>();

  @HostBinding('attr.class') public class = 'dragDropFile';

  constructor() { }

  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('drop', ['$event'])
  public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.onDropBackground.emit(true);
      this.onDropFile.emit(files);
    }
  }
}
