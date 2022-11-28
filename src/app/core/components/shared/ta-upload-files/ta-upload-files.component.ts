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
    @Input() tags: any[] = [];
    @Input() type: string; // modal | table | details | todo
    @Input() isRequired: boolean = false;
    @Input() showRequired: boolean = false;

    @Output() onFileEvent: EventEmitter<{
        files: UploadFile[] | UploadFile | any;
        action: string;
        deleteId?: number;
    }> = new EventEmitter<{
        files: UploadFile[] | UploadFile | any;
        action: string;
        deleteId?: number;
    }>(null);

    // Review
    @Input() isReview: boolean;
    @Input() reviewMode: string;
    @Input() feedbackText: string;
    @Output() documentReviewInputEvent: EventEmitter<{
        file: UploadFile;
        message: string;
    }> = new EventEmitter<{ file: UploadFile; message: string }>(null);
    @Input() slideWidth: number = 180;
    @Input() categoryTag: string;

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
     * @param data - returned data from file action (one or multiple)
     */
    public onFileAction(data: { file: UploadFile; action: string }) {
        switch (data.action) {
            case 'tag': {
                this.onFileEvent.emit({
                    files: data.file,
                    action: data.action,
                });
                break;
            }
            case 'delete': {
                let isLastDeleted = false;
                this.files.map((item, index) => {
                    if (
                        item.fileName == data.file.fileName &&
                        index == this.files.length - 1
                    ) {
                        isLastDeleted = true;
                    }
                });

                this.files = this.files.filter(
                    (item) => item.fileName !== data.file.fileName
                );

                if (data.file['fileId']) {
                    this.onFileEvent.emit({
                        files: this.files,
                        action: data.action,
                        deleteId: data.file['fileId'],
                    });
                } else {
                    this.onFileEvent.emit({
                        files: this.files,
                        action: data.action,
                    });
                }

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

                if (isLastDeleted) {
                    const slideTo =
                        this.modalCarousel.customClass == 'large'
                            ? 3
                            : this.modalCarousel.customClass == 'medium'
                            ? 2
                            : 1;
                    const allowSlide =
                        this.modalCarousel.customClass == 'large' &&
                        this.files.length > 2
                            ? true
                            : this.modalCarousel.customClass == 'medium' &&
                              this.files.length > 1
                            ? true
                            : this.modalCarousel.customClass == 'small' &&
                              this.files.length > 0
                            ? true
                            : false;
                    if (allowSlide) {
                        this.modalCarousel.slideToFile(
                            this.files.length - slideTo
                        );
                    }
                }
                break;
            }
            case 'mark-incorrect': {
                this.onFileEvent.emit({
                    files: data.file,
                    action: data.action,
                });
                break;
            }
            case 'mark-correct': {
                this.onFileEvent.emit({
                    files: data.file,
                    action: data.action,
                });
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
                data.files.map((file)=>{
                    let setName = '';
                    const name = file.fileName.split('');
                    name.map((item, i)=>{
                        if(i < name.length - 4) {
                            setName = setName+item;
                        }
                    });
                    file.fileName = setName;
                });
                const oldFiles = this.files.length ? this.files : [];

                this.files = [...oldFiles, ...data.files];
                this.onFileEvent.emit({ files: this.files, action: 'add' });
                break;
            }
        }
    }

    public documentReviewInputEventMethod(data: {
        file: UploadFile;
        message: string;
    }) {
        this.documentReviewInputEvent.emit({
            file: data.file,
            message: data.message,
        });
    }

    // TruckBy ngFor files changes
    public identity(index: number, item: any): number {
        return item.name;
    }

    public downloadAllFiles() {
        this.files.map((item) => {
            fetch(item.url).then((t) => {
                t.blob().then((b) => {
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(b);
                    a.setAttribute('download', item.fileName);
                    a.click();
                });
            });
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
