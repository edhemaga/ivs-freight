import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { UploadFile } from './ta-upload-file/ta-upload-file.component';
import { TaUploadFilesCarouselComponent } from './ta-upload-files-carousel/ta-upload-files-carousel.component';

@Component({
  selector: 'app-ta-modal-upload',
  templateUrl: './ta-modal-upload.component.html',
  styleUrls: ['./ta-modal-upload.component.scss'],
})
export class TaModalUploadComponent implements OnInit {
  @ViewChild(TaUploadFilesCarouselComponent) modalCarousel: TaUploadFilesCarouselComponent;
  @Input() files: UploadFile[] = [];
  @Input() hasTag: boolean = false;
  @Input() modalSize: string = 'modal-small'; // small | medium | large

  @Output() onFileEvent: EventEmitter<{ files: UploadFile[]; action: string }> =
    new EventEmitter<{ files: UploadFile[]; action: string }>(null);

  public currentSlide: number = 0;

  constructor(private changeDetectionRef: ChangeDetectorRef) {}

  ngOnInit() {}

  public async onFileUpload(files: FileList) {
    await this.addFiles(files);
    console.log(this.files);
    this.onFileEvent.emit({files:this.files , action: 'add'});
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

  /**
   *
   * @param data - returned data from file action
   */
  public onFileAction(data: { file: UploadFile; action: string }) {
    switch (data.action) {
      case 'tag': {
        this.onFileEvent.emit( { files: this.files, action: 'tag' });
        break;
      }
      case 'delete': {
        this.files = this.files.filter((item) => item.name !== data.file.name);
        this.onFileEvent.emit( { files: this.files, action: 'delete' });
        this.currentSlide = this.files.length - 1;

        if((this.modalSize === 'modal-large'  && this.files.length < 4) || (this.modalSize === 'modal-medium'  && this.files.length < 3)) {
          this.modalCarousel.currentSlide = 0;
          this.modalCarousel.translateXMultipleSlides = 0;
          this.modalCarousel.multipleCurrentSlide = 0;
         
          console.log("On delete") 
          console.log("Current slide ", this.modalCarousel.currentSlide)
          console.log("Multiple slide ", this.modalCarousel.multipleCurrentSlide)
          console.log("TranslateX slide ", this.modalCarousel.translateXMultipleSlides)
        }

        this.changeDetectionRef.detectChanges();
        break;
      }
      default: {
        break;
      }
    }
  }

  // TruckBy ngFor files changes
  public identity(index: number, item: any): number {
    return item.name;
  }
}
