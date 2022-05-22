import {Directive, EventEmitter, HostBinding, HostListener, Output} from '@angular/core';
import { UploadFile } from '../components/shared/ta-modal-upload/ta-upload-file/ta-upload-file.component';

@Directive({
  selector: '[appDragDropFile]',
})
export class DragDropFileDirective {
  @Output() onDropFile = new EventEmitter<{files: UploadFile[]  , action: string}>();
  @Output() onDropBackground = new EventEmitter<{action: string, value: boolean}>();

  @HostBinding('attr.class') public class = 'dragDropFile';

  private files: UploadFile[] = [];

  constructor() {
  }

  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.onDropBackground.emit({action: 'dragover', value: true});
    this.class = "dragDropFile hovered"
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.onDropBackground.emit({action: 'dragleave', value: false});
    this.class = "dragDropFile"
  }

  @HostListener('drop', ['$event'])
  public async ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.onDropBackground.emit({action: 'drop', value: false});

    await this.onFileUpload(evt.dataTransfer.files)
  }

  public async onFileUpload(files: FileList) {
    await this.addFiles(files);
    this.onDropFile.emit({files:this.files , action: 'add'});
    this.files = [];
  }

   /**
   * Iteration through multiple files
   */
    private async addFiles(files: FileList) {
      for (let index = 0; index < files.length; index++) {
        const file = files.item(index);
        await this.addFile(file);
      }
    }
    
  
    /**
     * Mapped file object
     */
    private async addFile(file: any) {
      try {
        const base64Content = await this.getBase64(file);
        const fileNameArray = file.name.split('.');
        this.files = [
          ...this.files,
          {
            name: file.name,
            url: base64Content,
            extension: fileNameArray[fileNameArray.length - 1],
            guid: null,
            size: file.size,
          },
        ];
      } catch (err) {
        console.error(`Can't upload ${file.name} ${err}`);
      }
    }
  
    /*
     * @param file
     * @return base64 url
     */
    private getBase64(file: File) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    }
}
