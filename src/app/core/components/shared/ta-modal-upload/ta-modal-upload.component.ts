import { untilDestroyed } from 'ngx-take-until-destroy';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { UploadFile } from './ta-upload-file/ta-upload-file.component';
import { TaUploadFilesCarouselComponent } from './ta-upload-files-carousel/ta-upload-files-carousel.component';
import { TaUploadFileService } from './ta-upload-file.service';

@Component({
  selector: 'app-ta-modal-upload',
  templateUrl: './ta-modal-upload.component.html',
  styleUrls: ['./ta-modal-upload.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaModalUploadComponent implements OnInit, OnDestroy {
  @ViewChild(TaUploadFilesCarouselComponent)
  modalCarousel: TaUploadFilesCarouselComponent;

  @Input() files: UploadFile[] = [];
  @Input() hasTag: boolean = false;
  @Input() modalSize: string = 'modal-small'; // small | medium | large

  @Output() onFileEvent: EventEmitter<{ files: UploadFile[]; action: string }> =
    new EventEmitter<{ files: UploadFile[]; action: string }>(null);

  public currentSlide: number = 0;

  constructor(
    private uploadFileService: TaUploadFileService
  ) {}

  ngOnInit() {
    this.uploadFileService.uploadedFiles$
      .pipe(untilDestroyed(this))
      .subscribe((data: { files: UploadFile[]; action: string }) => {
        if(data) {
          console.log("DATAAAA ", data)
          this.onUploadFiles(data);
        }
      });
  }

  /**
   *
   * @param data - returned data from file action
   */
  public onFileAction(data: { file: UploadFile; action: string }) {
    switch (data.action) {
      case 'tag': {
        this.onFileEvent.emit({ files: this.files, action: 'tag' });
        break;
      }
      case 'delete': {
        this.files = this.files.filter((item) => item.name !== data.file.name);
        this.onFileEvent.emit({ files: this.files, action: 'delete' });
        this.currentSlide = this.files.length - 1;

        if (
          (this.modalSize === 'modal-large' && this.files.length < 4) ||
          (this.modalSize === 'modal-medium' && this.files.length < 3)
        ) {
          this.modalCarousel.currentSlide = 0;
          this.modalCarousel.translateXMultipleSlides = 0;
          this.modalCarousel.multipleCurrentSlide = 0;
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  public onUploadFiles(data: { files: UploadFile[]; action: string }) {
    switch (data.action) {
      case 'add': {
        this.files = [...this.files, ...data.files];
        break;
      }
    }
  }

  // TruckBy ngFor files changes
  public identity(index: number, item: any): number {
    return item.name;
  }

  ngOnDestroy(): void {}
}
