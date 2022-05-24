import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { exec } from 'child_process';
import { UploadFile } from '../ta-upload-file/ta-upload-file.component';

@Component({
  selector: 'app-ta-upload-dropzone',
  templateUrl: './ta-upload-dropzone.component.html',
  styleUrls: ['./ta-upload-dropzone.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TaUploadDropzoneComponent {
  private files: UploadFile[] = [];
  @Input() dropZoneType: string = 'files'; // files | logo
  @Input() dropZoneAreSvg: string =
    'assets/svg/common/ic_modal_upload_dropzone.svg';
  @Input() dropZoneAvailableFiles: string =
    'application/pdf, application/png, application/jpg';
  @Input() multiple: boolean = true;

  @Output() onFileEvent: EventEmitter<{ files: UploadFile[]; action: string }> =
    new EventEmitter<{ files: UploadFile[]; action: string }>(null);

  public unSupporetedType: boolean = false;
  public supportedExtensions: string[] = [];

  public async onFileUpload(files: FileList) {
    await this.addFiles(files);
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
      this.supportedExtensions = this.dropZoneAvailableFiles
        .split(',')
        .map((item) => item.split('/')[1]);

      if (
        !this.supportedExtensions.includes(
          fileNameArray[fileNameArray.length - 1]
        )
      ) {
        this.unSupporetedType = true;
        return;
      }

      this.unSupporetedType = false;
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
      this.onFileEvent.emit({ files: this.files, action: 'add' });
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
