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
  ChatConversationProfileDetailsType,
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
  @Input() profileDetailsType!: ChatConversationProfileDetailsType;

  @Output() isProfileDetailsClosed: EventEmitter<boolean> = new EventEmitter<boolean>();

  // TODO connect to hub, replace dummy value
  public activityStatus: string = 'Offline';

  // Assets route
  public chatSvgRoutes = ChatSvgRoutes;

  // Enums
  public chatSearchPlaceHolders = ChatSearchPlaceHolders;
  public chatConversationProfileDetailsType = ChatConversationProfileDetailsType;

  // Attachment and links status
  public ChatUserProfileResourceTypeEnum = ChatUserProfileResourceTypeEnum;

  constructor() { }

  ngOnInit(): void { }

  public closeProfileDetails(): void {
    this.isProfileDetailsClosed.emit(false);
  }

}
