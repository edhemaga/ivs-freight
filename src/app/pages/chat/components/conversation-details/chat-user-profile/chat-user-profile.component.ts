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
import { ChatSvgRoutes } from '@pages/chat/utils/routes/chat-svg-routes';

// Enums
import { ChatUserProfileResourceType } from '@pages/chat/enums/conversation/chat-user-profile-resource-type.enum';


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

  // Attachment and links status
  public ChatUserProfileResourceType = ChatUserProfileResourceType;

  constructor() { }

  ngOnInit(): void { }

  public closeProfileDetails(): void {
    this.isProfileDetailsClosed.emit(false);
  }

}
