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
import { UserProfileResourceType } from '@pages/chat/enums/conversation/user-profile-resource-type.enum';


@Component({
  selector: 'app-chat-user-profile',
  templateUrl: './chat-user-profile.component.html',
  styleUrls: ['./chat-user-profile.component.scss']
})
export class ChatUserProfileComponent implements OnInit {

  @Input() data: ConversationInfoResponse;

  @Output() isProfileDetailsClosed: EventEmitter<boolean> = new EventEmitter<boolean>();

  //TODO remap to response when it's expanded
  public links: {
    links?: Array<string> | null;
    linksCount?: number;
  } = {
      links: [],
      linksCount: 0
    }

  // Assets route
  public ChatSvgRoutes = ChatSvgRoutes;

  // Attachment and links status
  public UserProfileResourceType = UserProfileResourceType;

  constructor() { }

  ngOnInit(): void { }

  public closeProfileDetails(): void {
    this.isProfileDetailsClosed.emit(false);
  }

}
