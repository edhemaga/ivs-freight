import {
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';

// Assets routes
import { ChatSvgRoutes } from '@pages/chat/utils/routes/chat-svg-routes';

@Component({
  selector: 'app-chat-user-profile',
  templateUrl: './chat-user-profile.component.html',
  styleUrls: ['./chat-user-profile.component.scss']
})
export class ChatUserProfileComponent implements OnInit {

  @Output() isProfileDetailsClosed: EventEmitter<boolean> = new EventEmitter<boolean>();

  // Assets route
  public ChatSvgRoutes = ChatSvgRoutes;

  constructor() { }

  ngOnInit(): void { }

  public closeProfileDetails(): void {
    this.isProfileDetailsClosed.emit(false);
  }

}
