import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TaUploadFileService } from './ta-upload-file.service';
import { UploadFile } from './ta-upload-file/ta-upload-file.component';
import { TaUploadFilesCarouselComponent } from './ta-upload-files-carousel/ta-upload-files-carousel.component';

@Component({
  selector: 'app-ta-upload-files',
  templateUrl: './ta-upload-files.component.html',
  styleUrls: ['./ta-upload-files.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TaUploadFilesComponent implements OnInit {
  private destroy$ = new Subject<void>();
  @ViewChild(TaUploadFilesCarouselComponent) 
  modalCarousel: TaUploadFilesCarouselComponent;

  @Input() customClassName: string;
  @Input() files: UploadFile[] = [];
  @Input() hasTag: boolean = false;
  @Input() hasNumberOfPages: boolean = false;
  @Input() size: string = 'small'; // small | medium | large
  @Input() hasCarouselBottomTabs: boolean;

  @Output() onFileEvent: EventEmitter<{ files: UploadFile[]; action: string }> =
    new EventEmitter<{ files: UploadFile[]; action: string }>(null);

  public currentSlide: number = 0;

  constructor(private uploadFileService: TaUploadFileService) {}

  ngOnInit() {
    this.uploadFileService.uploadedFiles$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: { files: UploadFile[]; action: string }) => {
        if (data) {
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
          (this.size === 'modal-large' && this.files.length < 4) ||
          (this.size === 'modal-medium' && this.files.length < 3)
        ) {
          this.modalCarousel.currentSlide = 0;
          this.modalCarousel.translateXMultipleSlides = 0;
          this.modalCarousel.multipleCurrentSlide = 0;
        }

        if (!this.files.length) {
          this.currentSlide = 0;
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
        this.onFileEvent.emit({ files: this.files, action: 'add' });
        break;
      }
    }
  }

  // TruckBy ngFor files changes
  public identity(index: number, item: any): number {
    return item.name;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
