import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

// Models
import { ConversationInfoResponse } from 'appcoretruckassist';

// Assets routes
import { ChatSvgRoutes } from '@pages/chat/utils/routes';

// Enums
import {
  ChatSearchPlaceHolders,
  ChatUserProfileResourceTypeEnum
} from '@pages/chat/enums';

@Component({
  selector: 'app-chat-user-profile',
  templateUrl: './chat-user-profile.component.html',
  styleUrls: ['./chat-user-profile.component.scss']
})
export class ChatUserProfileComponent implements OnInit {

  @Input() data: ConversationInfoResponse;

  @Output() isProfileDetailsClosed: EventEmitter<boolean> = new EventEmitter<boolean>();

  // Assets route
  public ChatSvgRoutes = ChatSvgRoutes;

  // Enums
  public chatSearchPlaceHolders = ChatSearchPlaceHolders;

  // Attachment and links status
  public ChatUserProfileResourceTypeEnum = ChatUserProfileResourceTypeEnum;

  constructor() { }

  ngOnInit(): void { }

  public closeProfileDetails(): void {
    this.isProfileDetailsClosed.emit(false);
  }

}
