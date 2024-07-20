import { Component, OnInit } from '@angular/core';
import { ChatPngRoutes } from '@pages/chat/util/constants/chat-png-routes.constants';

@Component({
  selector: 'app-chat-attachment-upload',
  templateUrl: './chat-attachment-upload.component.html',
  styleUrls: ['./chat-attachment-upload.component.scss']
})
export class ChatAttachmentUploadComponent implements OnInit {

  // Images
  public ChatPngRoutes = ChatPngRoutes;

  constructor() { }

  ngOnInit(): void {
  }

  handleFileDrop(files): void { }

}
