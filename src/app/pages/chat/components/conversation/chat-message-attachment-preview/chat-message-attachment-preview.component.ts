import {
  Component,
  Input,
  OnInit
} from '@angular/core';

// Assets
import { ChatPngRoutes } from '@pages/chat/utils/routes/chat-png-routes';

// Models
import { UploadFile } from '@shared/components/ta-upload-files/models/upload-file.model';

// Enums
import { AttachmentType } from '@pages/chat/enums/conversation/attachment-type.enum';

interface ExtendedUploadFile extends UploadFile {
  fileId?: number;
  fileName?: string | null;
  fileSize?: number | null;
  tags?: Array<string> | null;
  tagGeneratedByUser?: boolean;
  updatedAt?: string | null; F
}

@Component({
  selector: 'app-chat-message-attachment-preview',
  templateUrl: './chat-message-attachment-preview.component.html',
  styleUrls: ['./chat-message-attachment-preview.component.scss']
})
export class ChatMessageAttachmentPreviewComponent implements OnInit {

  @Input() public index: number;
  @Input() public isNameReduced: boolean = false;
  @Input() public attachment!: ExtendedUploadFile;
  @Input() public isChatTypingBlurred: boolean = false;
  @Input() public isInMessage: boolean = false;
  @Input() public isSizeDisplayed: boolean = true;
  @Input() public isDateDisplayed: boolean = false;

  // Assets route
  public ChatPngRoutes = ChatPngRoutes;

  // Attachment type
  public isDocument!: boolean;
  public isMedia!: boolean;
  public documentIllustrationPath!: string;
  public AttachmentType = AttachmentType;

  public previewWidth: string = 'fit-content';

  constructor() { }

  ngOnInit(): void {
    this.checkAttachmentExtension(this.attachment.extension, this.attachment.fileName);
  }

  private checkAttachmentExtension(extension: string, fileName?: string): void {
    if (!extension) {
      if (!fileName) {
        return;
      }

      const extensionArray: string[] = fileName.split('.');

      extension = extensionArray[extensionArray.length - 1];
    }


    switch (extension) {

      case AttachmentType.ZIP:
        this.setIllustrationType(ChatPngRoutes.zipFileType);
        break;

      case AttachmentType.XLS:
        this.setIllustrationType(ChatPngRoutes.xlsFileType);
        break;

      case AttachmentType.PDF:
        this.setIllustrationType(ChatPngRoutes.pdfFileType);
        break;

      case AttachmentType.DOCX:
        this.setIllustrationType(ChatPngRoutes.docxFileType);
        break;

      case AttachmentType.JPG:
      case AttachmentType.JPEG:
      case AttachmentType.PNG:
        this.isDocument = false;
        this.isMedia = true;
        if (!this.isInMessage)
          this.previewWidth = '40px';
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
    if (!this.isInMessage)
      this.previewWidth = '132px';
  }

  public downloadFile(): void {
    const a = document.createElement('a');
    a.href = this.attachment.url;
    a.setAttribute('download', this.attachment.fileName);
    a.click();
  }
}
