import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    Output,
    ViewChild,
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

// FILES: assets/svg/common/ic_modal_upload_dropzone.svg
// IMAGE: image/gif, image/jpeg, image/jpg, image/png
// MEDIA: video/mp4,video/x-m4v,video/*

@Component({
    selector: 'app-ta-upload-dropzone',
    templateUrl: './ta-upload-dropzone.component.html',
    styleUrls: ['./ta-upload-dropzone.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {
        '(window:paste)': 'handlePaste( $event )',
    },
})
export class TaUploadDropzoneComponent {
    private files: UploadFile[] = [];
    @ViewChild('dropzoneFocusElem')
    dropzoneFocusElem: ElementRef;

    @Input() dropZoneConfig: DropZoneConfig = {
        dropZoneType: 'files', // files | image | media
        dropZoneSvg: 'assets/svg/common/ic_files_dropzone.svg',
        dropZoneAvailableFiles:
            'application/pdf, image/png, image/jpeg, image/jpg',
        multiple: true,
        globalDropZone: false,
    };

    @Input() disableUnsupportedPreview: boolean = false; // only for modals upload

    @Input() isRequired: boolean = false;
    @Input() showRequired: boolean = false;
    @Input() dropzoneClose: boolean = false;
    @Input() dropzoneFocus: boolean = false;

    @Output() onFileEvent: EventEmitter<{
        files: UploadFile[];
        action: string;
    }> = new EventEmitter<{ files: UploadFile[]; action: string }>(null);

    @Output() onDropBackground = new EventEmitter<{
        action: string;
        value: boolean;
    }>();

    @Output() closeDropzone = new EventEmitter<{}>();

    public textChangeOverModal: boolean = false;
    public windowDragOver: boolean = false;
    public hoveredZone: boolean = false;

    public unSupporetedType: boolean = false;
    public supportedExtensions: string[] = [];

    @HostListener('dragover', ['$event']) onDragOver(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.onDropBackground.emit({ action: 'dragover', value: true });
        this.textChangeOverModal = true;
        this.windowDragOver = true;
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
        this.windowDragOver = false;
    }

    @HostListener('window:dragenter', ['$event'])
    onWindowDragEnter(event: any): void {
        event.preventDefault();
        event.stopPropagation();
        this.windowDragOver = true;
        const target = this.dropzoneFocusElem?.nativeElement;
        if (target) {
            target.addEventListener('dragleave', (event) => {
                setTimeout(() => {
                    if (!this.textChangeOverModal) {
                        this.windowDragOver = false;
                        target.removeAllListeners();
                    }
                }, 100);
            });
        }
    }

    public async onFileUpload(files: FileList) {
        await this.addFiles(files);
        this.files = [];
    }

    /**
     * Iteration through multiple files
     */
    private async addFiles(files: FileList) {
        for (let index = 0; index < files.length; index++) {
            const file = files.item(index);
            const prevent = index == files.length - 1 ? false : true;
            await this.addFile(file, prevent);
        }
    }

    /**
     * Mapped file object
     */
    private async addFile(file: any, prevent?) {
        try {
            const base64Content = await this.getBase64(file);
            const fileNameArray = file.name.split('.');
            this.supportedExtensions =
                this.dropZoneConfig.dropZoneAvailableFiles
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
                    fileName: file.name,
                    url: base64Content,
                    extension: fileNameArray[fileNameArray.length - 1],
                    guid: null,
                    size: file.size,
                    realFile: file,
                },
            ];

            if (!prevent) {
                this.onFileEvent.emit({ files: this.files, action: 'add' });
            }
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

    // PASTE IMAGES

    public async handlePaste(event: ClipboardEvent): Promise<void> {
        const pastedImage = this.getPastedImage(event);

        if (!pastedImage) {
            return;
        }

        await this.onFileUpload(pastedImage);
    }

    private getPastedImage(event: ClipboardEvent): FileList {
        if (
            event.clipboardData &&
            event.clipboardData.files &&
            event.clipboardData.files.length &&
            this.isImageFile(event.clipboardData.files[0])
        ) {
            return event.clipboardData.files;
        }

        return null;
    }

    private isImageFile(file: File): boolean {
        return file.type.search(/^image\//i) === 0;
    }

    public dropZoneClose() {
        this.closeDropzone.emit();
    }
}
