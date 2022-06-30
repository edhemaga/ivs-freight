import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { UploadFile } from '../ta-upload-file/ta-upload-file.component';

export interface DropZoneConfig {
  dropZoneType: string;
  dropZoneSvg: string;
  dropZoneAvailableFiles: string;
  multiple: boolean;
  globalDropZone?: boolean;
}

@Component({
  selector: 'app-ta-upload-dropzone',
  templateUrl: './ta-upload-dropzone.component.html',
  styleUrls: ['./ta-upload-dropzone.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TaUploadDropzoneComponent implements OnChanges {
  private files: UploadFile[] = [];

  @Input() dropZoneConfig: DropZoneConfig = {
    dropZoneType: 'files', // files | logo
    dropZoneSvg: 'assets/svg/common/ic_modal_upload_dropzone.svg',
    dropZoneAvailableFiles: 'application/pdf, application/png, application/jpg',
    multiple: true,
    globalDropZone: false,
  };

  @Input() disableUnsupportedPreview: boolean = false; // only for modals upload

  @Output() onFileEvent: EventEmitter<{ files: UploadFile[]; action: string }> =
    new EventEmitter<{ files: UploadFile[]; action: string }>(null);

  @Output() onDropBackground = new EventEmitter<{
    action: string;
    value: boolean;
  }>();

  public textChangeOverModal: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.dropZoneConfig);
  }

  public unSupporetedType: boolean = false;
  public supportedExtensions: string[] = [];

  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.onDropBackground.emit({ action: 'dragover', value: true });
    this.textChangeOverModal = true;
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.onDropBackground.emit({ action: 'dragleave', value: false });
    this.textChangeOverModal = false;
  }

  @HostListener('drop', ['$event'])
  public async ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.onDropBackground.emit({ action: 'drop', value: false });

    await this.onFileUpload(evt.dataTransfer.files);
    this.textChangeOverModal = false;
  }

  public async onFileUpload(files: FileList) {
    console.log('DROPZONE');
    console.log(files);
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
      this.supportedExtensions = this.dropZoneConfig.dropZoneAvailableFiles
        .split(',')
        .map((item) => item.split('/')[1]);

      if (
        !this.supportedExtensions.includes(
          fileNameArray[fileNameArray.length - 1]
        )
      ) {
        if (!this.disableUnsupportedPreview) {
          this.unSupporetedType = true;
        }

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
