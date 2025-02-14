import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ViewChildren,
    ViewEncapsulation,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//Modules
import { AngularSvgIconModule } from 'angular-svg-icon';

//Components
import { TaUploadDropzoneComponent } from '@shared/components/ta-upload-files/components/ta-upload-dropzone/ta-upload-dropzone.component';
import { TaUploadFileComponent } from '@shared/components/ta-upload-files/components/ta-upload-file/ta-upload-file.component';
import { TaUploadFilesCarouselComponent } from '@shared/components/ta-upload-files/components/ta-upload-files-carousel/ta-upload-files-carousel.component';

//Models
import { FileEvent } from '@shared/models/file-event.model';
import { Tags } from '@shared/models/tags.model';
import { UploadFile } from '@shared/components/ta-upload-files/models/upload-file.model';
import { DropZoneConfig } from '@shared/components/ta-upload-files/models/dropzone-config.model';

//Services
import { TaUploadFileService } from '@shared/components/ta-upload-files/services/ta-upload-file.service';

//Enums
import { FileTypesEnum } from '@shared/components/ta-upload-files/enums/file-types.enum';
import { FilesSizeEnum } from '@shared/components/ta-upload-files/enums/files-size.enum';
import { eGeneralActions } from '@shared/enums';

@Component({
    selector: 'app-ta-upload-files',
    templateUrl: './ta-upload-files.component.html',
    styleUrls: ['./ta-upload-files.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        //Modules
        CommonModule,
        FormsModule,
        AngularSvgIconModule,

        //Components
        TaUploadFilesCarouselComponent,
        TaUploadDropzoneComponent,
        TaUploadFileComponent,
    ],
})
export class TaUploadFilesComponent implements OnInit, OnDestroy {
    @ViewChild(TaUploadFilesCarouselComponent)
    public modalCarousel: TaUploadFilesCarouselComponent;

    @ViewChildren('uploadedFiles') public uploadedFiles: ElementRef;

    @Output() documentReviewInputEvent: EventEmitter<{
        file: UploadFile;
        message: string;
    }> = new EventEmitter<{ file: UploadFile; message: string }>(null);
    @Output() onFileEvent: EventEmitter<FileEvent> =
        new EventEmitter<FileEvent>(null);
    @Output() closeDropzone = new EventEmitter<{}>();

    //General
    @Input() set files(value: UploadFile[]) {
        this._files = value;
        if (this.type == FileTypesEnum.DETAILS) {
            this.modalCarousel?.slideToFile(0);
        }
    }
    @Input() customClassName: string;
    @Input() type;
    @Input() hasNumberOfPages: boolean = false;
    @Input() size: string = FilesSizeEnum.SMALL;
    @Input() modalSize: string;
    @Input() isRequired: boolean = false;
    @Input() showRequired: boolean = false;
    @Input() hasLandscapeOption: boolean = false;
    @Input() dropZoneIndex: number = 0;

    //Carousel
    @Input() hasSlider: boolean = false;
    @Input() hasCarouselBottomTabs: boolean;

    //Tags
    @Input() onlyOneTagFile: boolean = false;
    @Input() tags: Tags[] = [];
    @Input() hasTagsDropdown: boolean = false;

    //Dropzone
    @Input() dropzoneFocus: boolean = false;
    @Input() showDropzone: boolean = false;
    @Input() dropzoneColumn: boolean = false;
    @Input() dropZoneConfig: DropZoneConfig;

    // Review
    @Input() isReview: boolean;
    @Input() reviewMode: string;
    @Input() feedbackText: string;
    @Input() slideWidth: number = 180;
    @Input() categoryTag: string;

    public _files: UploadFile[] = [];
    public currentSlide: number = 0;
    private destroy$ = new Subject<void>();

    constructor(private uploadFileService: TaUploadFileService) {}

    ngOnInit(): void {
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
    public onFileAction(data: { file: UploadFile; action: string }): void {
        switch (data.action) {
            case 'tag': {
                this.onFileEvent.emit({
                    files: !this.onlyOneTagFile ? this._files : data.file,
                    action: data.action,
                });
                break;
            }
            case eGeneralActions.DELETE: {
                let isLastDeleted = false;
                this._files.map((item, index) => {
                    if (
                        item.fileName == data.file.fileName &&
                        (index == this._files.length - 1 ||
                            index == this._files.length - 2)
                    ) {
                        isLastDeleted = true;
                    }
                });

                this._files = this._files.filter(
                    (item) => item.fileName !== data.file.fileName
                );

                if (data.file['fileId']) {
                    this.onFileEvent.emit({
                        files: this._files,
                        action: data.action,
                        deleteId: data.file['fileId'],
                    });
                } else {
                    this.onFileEvent.emit({
                        files: this._files,
                        action: data.action,
                    });
                }

                this.currentSlide = this._files.length - 1;

                if (
                    (this.size === FilesSizeEnum.MODAL_LARGE &&
                        this._files.length < 4) ||
                    (this.size === FilesSizeEnum.MODAL_MEDIUM &&
                        this._files.length < 3)
                ) {
                    this.modalCarousel.currentSlide = 0;
                    this.modalCarousel.translateXMultipleSlides = 0;
                    this.modalCarousel.multipleCurrentSlide = 0;
                }

                if (!this._files.length) {
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
                        this._files.length > 2
                            ? true
                            : this.modalCarousel.customClass == 'medium' &&
                                this._files.length > 1
                              ? true
                              : this.modalCarousel.customClass == 'small' &&
                                  this._files.length > 0
                                ? true
                                : false;
                    if (allowSlide) {
                        this.modalCarousel.slideToFile(
                            this._files.length - slideTo
                        );
                    }
                }
                break;
            }
            case 'mark-incorrect': {
                let incorrectIndx: number;
                this._files.map((item, index) => {
                    if (item.fileName == data.file.fileName) {
                        incorrectIndx = index;
                    }
                });

                this.onFileEvent.emit({
                    files: this._files,
                    action: data.action,
                    index: incorrectIndx,
                });
                break;
            }
            case 'mark-correct': {
                let correctIndx: number;
                this._files.map((item, index) => {
                    if (item.fileName == data.file.fileName) {
                        correctIndx = index;
                    }
                });

                this.onFileEvent.emit({
                    files: this._files,
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

    public onUploadFiles(data: { files: UploadFile[]; action: string }): void {
        const uploadedFiles = [...data.files];
        switch (data.action) {
            case eGeneralActions.ADD: {
                uploadedFiles.map((files, i) => {
                    for (var a = 0; a < this._files.length; a++) {
                        if (
                            files.realFile?.name ==
                            this._files[a].realFile?.name
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
                const oldFiles = this._files.length ? this._files : [];

                this._files = [...oldFiles, ...uploadedFiles];
                this.onFileEvent.emit({
                    files: this._files,
                    action: eGeneralActions.ADD,
                });
                const slideTo =
                    this.modalCarousel?.customClass == 'large'
                        ? 3
                        : this.modalCarousel?.customClass == 'medium'
                          ? 2
                          : 1;
                const allowSlide =
                    this.modalCarousel?.customClass == 'large' &&
                    this._files.length > 2
                        ? true
                        : this.modalCarousel?.customClass == 'medium' &&
                            this._files.length > 1
                          ? true
                          : this.modalCarousel?.customClass == 'small' &&
                              this._files.length > 0
                            ? true
                            : false;
                if (allowSlide) {
                    this.modalCarousel?.slideToFile(
                        this._files.length - slideTo
                    );
                }
                break;
            }
        }
    }

    public documentReviewInputEventMethod(data: {
        file: UploadFile;
        message: string;
    }): void {
        this.documentReviewInputEvent.emit({
            file: data.file,
            message: data.message,
        });
    }

    public identity(index: number, item: any): number {
        //leave any for now
        return item.name;
    }

    public downloadAllFiles(): void {
        this._files.map((item) => {
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

    public onLandscapeCheck(landscape: boolean): void {
        if (landscape) this.customClassName = 'landscape-details-view';
    }

    public dropZoneClose(): void {
        this.closeDropzone.emit();
    }

    public fileHover(file: UploadFile): void {
        if (this.customClassName == 'modals') {
            let checkById = file?.realFile ? false : true;
            this._files.map((item, index) => {
                if (
                    (checkById && file?.fileId == item.fileId) ||
                    (!checkById && file?.realFile?.name == item.realFile?.name)
                ) {
                    this.uploadedFiles['_results'][index].updateHover(true);
                } else {
                    this.uploadedFiles['_results'][index].updateHover(false);
                }
            });
        }
    }

    public hoverArrow(mod: boolean): void {
        this._files.map((item, index) => {
            this.uploadedFiles['_results'][index].hoverArrow(mod);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
