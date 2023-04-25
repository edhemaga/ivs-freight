import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
    ViewChildren,
    ViewEncapsulation,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TaUploadFileService } from './ta-upload-file.service';
import {
    UploadFile,
    TaUploadFileComponent,
} from './ta-upload-file/ta-upload-file.component';
import { TaUploadFilesCarouselComponent } from './ta-upload-files-carousel/ta-upload-files-carousel.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TaUploadDropzoneComponent } from './ta-upload-dropzone/ta-upload-dropzone.component';

@Component({
    selector: 'app-ta-upload-files',
    templateUrl: './ta-upload-files.component.html',
    styleUrls: ['./ta-upload-files.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TaUploadFilesCarouselComponent,
        AngularSvgIconModule,
        TaUploadDropzoneComponent,
        TaUploadFileComponent,
    ],
})
export class TaUploadFilesComponent implements OnInit {
    private destroy$ = new Subject<void>();
    @ViewChild(TaUploadFilesCarouselComponent)
    modalCarousel: TaUploadFilesCarouselComponent;

    @ViewChildren('uploadedFiles') uploadedFiles: ElementRef;

    @Input() customClassName: string;
    @Input() files: UploadFile[] = [];
    @Input() hasTagsDropdown: boolean = false;
    @Input() hasNumberOfPages: boolean = false;
    @Input() size: string = 'small'; // small | medium | large
    @Input() hasCarouselBottomTabs: boolean;
    @Input() tags: any[] = [];
    @Input() type: string; // modal | table | details | todo
    @Input() isRequired: boolean = false;
    @Input() showRequired: boolean = false;
    @Input() hasLandscapeOption: boolean = false;
    @Input() showDropzone: boolean = false;
    @Input() dontUseSlider: boolean = false;
    @Input() dropzoneFocus: boolean = false;
    @Input() onlyOneTagFile: boolean = false;

    @Output() onFileEvent: EventEmitter<{
        files: UploadFile[] | UploadFile | any;
        action: string;
        deleteId?: number;
        index?: number;
    }> = new EventEmitter<{
        files: UploadFile[] | UploadFile | any;
        action: string;
        deleteId?: number;
        index?: number;
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

    @Output() closeDropzone = new EventEmitter<{}>();

    public currentSlide: number = 0;

    constructor(
        private uploadFileService: TaUploadFileService,
        private ref: ChangeDetectorRef
    ) {}

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
                    files: !this.onlyOneTagFile ? this.files : data.file,
                    action: data.action,
                });
                break;
            }
            case 'delete': {
                let isLastDeleted = false;
                this.files.map((item, index) => {
                    if (
                        item.fileName == data.file.fileName &&
                        (index == this.files.length - 1 ||
                            index == this.files.length - 2)
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

                if (isLastDeleted && this.modalCarousel) {
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
                let incorrectIndx;
                this.files.map((item, index) => {
                    if (item.fileName == data.file.fileName) {
                        incorrectIndx = index;
                    }
                });

                this.onFileEvent.emit({
                    files: this.files,
                    action: data.action,
                    index: incorrectIndx,
                });
                break;
            }
            case 'mark-correct': {
                let correctIndx;
                this.files.map((item, index) => {
                    if (item.fileName == data.file.fileName) {
                        correctIndx = index;
                    }
                });

                this.onFileEvent.emit({
                    files: this.files,
                    action: data.action,
                    index: correctIndx,
                });
                break;
            }
            default: {
                break;
            }
        }
    }

    public onUploadFiles(data: { files: UploadFile[]; action: string }) {
        const uploadedFiles = [...data.files];
        switch (data.action) {
            case 'add': {
                uploadedFiles.map((files, i) => {
                    for (var a = 0; a < this.files.length; a++) {
                        if (
                            files.realFile?.name == this.files[a].realFile?.name
                        ) {
                            uploadedFiles.splice(i);
                        }
                    }
                });

                uploadedFiles.map((file) => {
                    let setName = '';
                    const name = file.realFile?.name.split('');
                    name.map((item, i) => {
                        if (i < name.length - 4) {
                            setName = setName + item;
                        }
                    });
                    file.fileName = setName;
                });
                const oldFiles = this.files.length ? this.files : [];

                this.files = [...oldFiles, ...uploadedFiles];
                this.onFileEvent.emit({ files: this.files, action: 'add' });
                const slideTo =
                    this.modalCarousel?.customClass == 'large'
                        ? 3
                        : this.modalCarousel?.customClass == 'medium'
                        ? 2
                        : 1;
                const allowSlide =
                    this.modalCarousel?.customClass == 'large' &&
                    this.files.length > 2
                        ? true
                        : this.modalCarousel?.customClass == 'medium' &&
                          this.files.length > 1
                        ? true
                        : this.modalCarousel?.customClass == 'small' &&
                          this.files.length > 0
                        ? true
                        : false;
                if (allowSlide) {
                    this.modalCarousel?.slideToFile(
                        this.files.length - slideTo
                    );
                }
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

    public onLandscapeCheck(landscape: boolean) {
        if (landscape) {
            this.customClassName = 'landscape-details-view';
        }
    }

    public dropZoneClose() {
        this.closeDropzone.emit();
    }

    public fileHover(file: UploadFile) {
        if (this.customClassName == 'modals') {
            let checkById = file?.realFile ? false : true;
            this.files.map((item, index) => {
                if (
                    (checkById && file?.fileId == item.fileId) ||
                    (!checkById && file?.realFile.name == item.realFile.name)
                ) {
                    this.uploadedFiles['_results'][index].updateHover(true);
                } else {
                    this.uploadedFiles['_results'][index].updateHover(false);
                }
            });
        }
    }

    public hoverArrow(mod: boolean) {
        this.files.map((item, index) => {
            this.uploadedFiles['_results'][index].hoverArrow(mod);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
