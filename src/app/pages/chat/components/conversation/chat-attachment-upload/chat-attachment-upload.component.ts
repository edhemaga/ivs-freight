import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  ViewChild
} from '@angular/core';
import { Output } from '@angular/core';

// Assets route
import { ChatPngRoutes } from '@pages/chat/util/constants/chat-png-routes.constants';

// Helpers
import { checkIfAttachmentExistsAndHandlePreview } from '@pages/chat/util/helpers/file-upload-handler.helper';

//Models
import { ChatAttachmentForThumbnail } from '@pages/chat/models/chat-attachment.model';


@Component({
  selector: 'app-chat-attachment-upload',
  templateUrl: './chat-attachment-upload.component.html',
  styleUrls: ['./chat-attachment-upload.component.scss']
})
export class ChatAttachmentUploadComponent implements OnInit {

  @ViewChild('fileDrop') fileDropInput: ElementRef<HTMLInputElement>;

  @Output() attachmentsToUpload = new EventEmitter<ChatAttachmentForThumbnail[]>();
  public attachments: ChatAttachmentForThumbnail[] = [];

  // Images
  public ChatPngRoutes = ChatPngRoutes;

  constructor() { }

  ngOnInit(): void { }

  public handleUploadedFiles(files: FileList): void {
    this.attachments = checkIfAttachmentExistsAndHandlePreview(files, this.attachments);

    this.attachmentsToUpload.emit(this.attachments);
  }
}
