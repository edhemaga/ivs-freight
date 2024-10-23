import { Component, Input, OnInit } from '@angular/core';

// Assets
import { ChatPngRoutes } from '@pages/chat/utils/routes';

// Models
import { ChatExtendedUploadFile } from '@pages/chat/models';

// Enums
import { ChatAttachmentTypeEnum } from '@pages/chat/enums';

@Component({
    selector: 'app-chat-message-attachment-preview',
    templateUrl: './chat-message-attachment-preview.component.html',
    styleUrls: ['./chat-message-attachment-preview.component.scss'],
})
export class ChatMessageAttachmentPreviewComponent implements OnInit {
    @Input() public index: number;
    @Input() public isNameReduced: boolean = false;
    @Input() public attachment!: ChatExtendedUploadFile;
    @Input() public isInMessage: boolean = false;
    @Input() public isFocused: boolean = false;
    @Input() public isSizeDisplayed: boolean = true;
    @Input() public isDateDisplayed: boolean = false;

    // Assets route
    public ChatPngRoutes = ChatPngRoutes;

    // Attachment type
    public isDocument!: boolean;
    public isMedia!: boolean;
    public documentIllustrationPath!: string;
    public ChatAttachmentTypeEnum = ChatAttachmentTypeEnum;

    public previewWidth: string = 'fit-content';
    public displayMode: 'size' | 'date';

    constructor() {}

    ngOnInit(): void {
        this.checkAttachmentExtension(
            this.attachment.extension,
            this.attachment.fileName
        );
        this.setDisplayMode();
    }

    private checkAttachmentExtension(
        extension: string,
        fileName?: string
    ): void {
        if (!extension) {
            if (!fileName) {
                return;
            }

            const extensionArray: string[] = fileName.split('.');

            extension = extensionArray[extensionArray.length - 1];
        }

        switch (extension) {
            case ChatAttachmentTypeEnum.ZIP:
                this.setIllustrationType(ChatPngRoutes.zipFileType);
                break;

            case ChatAttachmentTypeEnum.XLS:
                this.setIllustrationType(ChatPngRoutes.xlsFileType);
                break;

            case ChatAttachmentTypeEnum.PDF:
                this.setIllustrationType(ChatPngRoutes.pdfFileType);
                break;

            case ChatAttachmentTypeEnum.DOCX:
                this.setIllustrationType(ChatPngRoutes.docxFileType);
                break;

            case ChatAttachmentTypeEnum.JPG:
            case ChatAttachmentTypeEnum.JPEG:
            case ChatAttachmentTypeEnum.PNG:
                this.isDocument = false;
                this.isMedia = true;
                if (!this.isInMessage) this.previewWidth = '100%';
                break;

            default:
                this.isDocument = false;
                this.isMedia = false;
                break;
        }
    }

    private setIllustrationType(illustrationPath: string): void {
        this.isDocument = true;
        this.isMedia = false;
        this.documentIllustrationPath = illustrationPath;
        if (!this.isInMessage) this.previewWidth = '132px';
    }

    private setDisplayMode(): void {
        if (this.isSizeDisplayed) {
            this.displayMode = 'size';
        } else if (this.isDateDisplayed) {
            this.displayMode = 'date';
        }
    }

    public downloadFile(): void {
        const a = document.createElement('a');
        a.href = this.attachment.url;
        a.setAttribute('download', this.attachment.fileName);
        a.click();
    }
}
