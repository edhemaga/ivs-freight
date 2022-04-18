import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
@Component({
  selector: 'app-ta-files',
  templateUrl: './ta-files.component.html',
  styleUrls: ['./ta-files.component.scss'],
})
export class TaFilesComponent {
  @Input() files: any[] = [];
  @Input() fileType: string = null;

  // Convention: name-component or page - single/multiple - type of upload (pdf, image, document)
  // example: driver-details-single-pdf
  @Input() customClassName: string = null;

  public currentSlide = 0;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  /**
   * Upload images
   */
  public async onImageUpload(event: any) {
    for (const image of event.addedFiles) {
      await this.addFile(image);
    }
  }

  /**
   * Upload files (pdf, .doc, .xls, plain/text)
   */
  public async onFileUpload(files: FileList) {
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

      this.files = [
        ...this.files,
        {
          fileName: file.name,
          url: base64Content,
          extension: fileNameArray[fileNameArray.length - 1],
          guid: null,
          size: file.size,
        },
      ];
      this.changeDetectorRef.detectChanges();
    } catch (err) {
      console.error(`Can't upload ${file.name}`);
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

  public onFileActionEvent(fileAction: any) {
    switch (fileAction.action) {
      case 'delete': {
        const indexFile = this.files.findIndex(
          (file) => file.fileName === fileAction.fileName
        );
        if (indexFile !== -1) {
          this.files.splice(indexFile, 1);
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  public onPreviousClick() {
    const previous = this.currentSlide - 1;
    this.currentSlide = previous < 0 ? this.files.length - 1 : previous;
  }

  public onNextClick() {
    const next = this.currentSlide + 1;
    this.currentSlide = next === this.files.length ? 0 : next;
  }

  // TruckBy ngFor files changes
  public identity(index: number, item: any): number {
    return item.name;
  }
}
