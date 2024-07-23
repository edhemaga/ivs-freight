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

//Models
import { ChatAttachmentForThumbnail } from '@pages/chat/models/chat-attachment.model';
import { Observable } from 'rxjs';

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
    for (let i = 0; i < files.length; i++) {
      const fileExists: boolean = this.attachments
        .some(
          attachment => attachment.name === files[i].name
        )
      if (fileExists) continue;

      let newFile: ChatAttachmentForThumbnail = files[i];
      this.convertFileToUrl(files[i]).subscribe(arg => {
        newFile.stringifiedData = arg;
      });

      this.attachments = [...this.attachments, newFile];
    }

    this.attachmentsToUpload.emit(this.attachments);
  }

  private convertFileToUrl(file: File): Observable<string | ArrayBuffer> {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    return new Observable((observer) => {

      reader.onload = () => {
        observer.next(reader.result);
      };

      reader.onerror = () => {
        observer.error(reader.error);
      };
    });
  }
}
