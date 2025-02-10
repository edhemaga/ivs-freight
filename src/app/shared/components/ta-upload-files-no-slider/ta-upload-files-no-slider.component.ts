import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChildren,
    ViewEncapsulation,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//Modules
import { AngularSvgIconModule } from 'angular-svg-icon';

//Components
import { TaUploadFileComponent } from '@shared/components/ta-upload-files/components/ta-upload-file/ta-upload-file.component';
import { TaUploadDropzoneComponent } from '@shared/components/ta-upload-files/components/ta-upload-dropzone/ta-upload-dropzone.component';
import { TaUploadFilesCarouselComponent } from '@shared/components/ta-upload-files/components/ta-upload-files-carousel/ta-upload-files-carousel.component';

//Models
import { FileEvent } from '@shared/models/file-event.model';
import { Tags } from '@shared/models/tags.model';
import { UploadFile } from '@shared/components/ta-upload-files/models/upload-file.model';
import { DropZoneConfig } from '@shared/components/ta-upload-files/models/dropzone-config.model';

//Services
import { TaUploadFileService } from '@shared/components/ta-upload-files/services/ta-upload-file.service';

//Enums
import { FileActionEnum } from '@shared/components/ta-upload-files-no-slider/enums/file-action-string.enum';
import { EGeneralActions } from '@shared/enums';

@Component({
    selector: 'app-ta-upload-files-no-slider',
    templateUrl: './ta-upload-files-no-slider.component.html',
    styleUrls: ['./ta-upload-files-no-slider.component.scss'],
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
export class TaUploadFilesNoSliderComponent
    implements OnInit, OnChanges, OnDestroy
{
    @ViewChildren('uploadedFiles') public uploadedFiles: ElementRef;

    @Output() documentReviewInputEvent: EventEmitter<{
        file: UploadFile;
        message: string;
    }> = new EventEmitter<{ file: UploadFile; message: string }>(null);
    @Output() onFileEvent: EventEmitter<FileEvent> =
        new EventEmitter<FileEvent>(null);
    @Output() closeDropzone = new EventEmitter();

    //General
    @Input() set files(value: UploadFile[]) {
        this._files = value;
    }
    @Input() customClassName: string;
    @Input() type;
    @Input() hasNumberOfPages: boolean = false;
    @Input() isRequired: boolean = false;
    @Input() showRequired: boolean = false;
    @Input() hasLandscapeOption: boolean = false;

    //Tags
    @Input() tags: Tags[] = [];
    @Input() hasTagsDropdown: boolean = false;

    //Dropzone
    @Input() dropzoneFocus: boolean = false;
    @Input() showDropzone: boolean = false;

    // Review
    @Input() isReview: boolean;
    @Input() reviewMode: string;
    @Input() feedbackText: string;

    @Input() categoryTag: string;
    @Input() dropZoneConfig: DropZoneConfig;

    public _files: UploadFile[] = [];
    public currentSlide: number = 0;
    private destroy$ = new Subject<void>();

    constructor(private uploadFileService: TaUploadFileService) {}

    ngOnInit(): void {
        this.uploadFileService.uploadedFiles$
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: { files: UploadFile[]; action: string }) => {
                if (data) this.onUploadFiles(data);
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.files && changes.files.currentValue)
            this._files = changes.files.currentValue;
    }

    /**
     *
     * @param data - returned data from file action (one or multiple)
     */
    public onFileAction(data: { file: UploadFile; action: string }): void {
        switch (data.action) {
            case FileActionEnum.TAG:
                this.onFileEvent.emit({
                    files: [data.file],
                    action: data.action,
                });
                break;

            case FileActionEnum.DELETE:
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
                break;

            case FileActionEnum.MARK_INCORRECT:
                let incorrectIndx: number;
                this._files.map((item, index) => {
                    if (item.fileName === data.file.fileName) {
                        incorrectIndx = index;
                    }
                });

                this.onFileEvent.emit({
                    files: this._files,
                    action: data.action,
                    index: incorrectIndx,
                });
                break;

            case FileActionEnum.MARK_CORRECT:
                let correctIndx: number;
                this._files.map((item, index) => {
                    if (item.fileName === data.file.fileName) {
                        correctIndx = index;
                    }
                });

                this.onFileEvent.emit({
                    files: this._files,
                    action: data.action,
                    index: correctIndx,
                });
                break;

            default:
                break;
        }
    }

    public onUploadFiles(data: { files: UploadFile[]; action: string }): void {
        if (data.action !== FileActionEnum.ADD) return;

        const uploadedFiles = [...data.files];
        this.onFileEvent.emit({
            files: uploadedFiles,
            action: EGeneralActions.ADD,
        });
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

    public onLandscapeCheck(landscape: boolean): void {
        if (landscape) this.customClassName = 'landscape-details-view';
    }

    public dropZoneClose(): void {
        this.closeDropzone.emit();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
