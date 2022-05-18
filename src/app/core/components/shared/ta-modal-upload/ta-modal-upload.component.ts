import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { UploadFile } from './ta-upload-file/ta-upload-file.component';

@Component({
  selector: 'app-ta-modal-upload',
  templateUrl: './ta-modal-upload.component.html',
  styleUrls: ['./ta-modal-upload.component.scss'],
})
export class TaModalUploadComponent implements OnInit {
  @Input() files: UploadFile[] = [];
  @Input() modalSize: string = 'small'; // small | medium | large
  @Output() uploadEvent: EventEmitter<any> = new EventEmitter<any>(null);

  constructor(private changeDetectionRef: ChangeDetectorRef) {}

  ngOnInit() {}

  public async onFileUpload(files: FileList) {
    console.log(files);
    await this.addFiles(files);
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

      this.files.push({
        name: file.name,
        url: base64Content,
        extension: fileNameArray[fileNameArray.length - 1],
        guid: null,
        size: file.size,
      });
      this.changeDetectionRef.detectChanges();
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
