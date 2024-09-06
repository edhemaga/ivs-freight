import {
  Component,
  Input,
  OnInit
} from '@angular/core';

// Enums
import { ChatAttachmentType } from '@pages/chat/enums/conversation/conversation-content/chat-attachment-type.enum';

// Models
import { ChatListItem } from '@pages/chat/models/chat-list-item.model';

@Component({
  selector: 'app-chat-list-item',
  templateUrl: './chat-list-item.component.html',
  styleUrls: ['./chat-list-item.component.scss']
})
export class ChatListItemComponent implements OnInit {

  @Input() item!: ChatListItem;

  public ChatAttachmentType = ChatAttachmentType;

  constructor() { }

  ngOnInit(): void { }

}
