import {
  Component,
  Input,
  OnInit
} from '@angular/core';

// Enums
import { AttachmentType } from '@pages/chat/enums/conversation/attachment-type.enum';

// Models
import { ChatListItem } from '@pages/chat/models/chat-list-item.model';

@Component({
  selector: 'app-chat-list-item',
  templateUrl: './chat-list-item.component.html',
  styleUrls: ['./chat-list-item.component.scss']
})
export class ChatListItemComponent implements OnInit {

  @Input() item!: ChatListItem;

  public attachmentType = AttachmentType;

  constructor() { }

  ngOnInit(): void { }

}
