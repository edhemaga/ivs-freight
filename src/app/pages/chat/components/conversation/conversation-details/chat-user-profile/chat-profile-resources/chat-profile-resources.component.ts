import {
  Component,
  Input,
  OnInit
} from '@angular/core';

// Models
import { FileResponse } from 'appcoretruckassist';
import { ChatLink } from '@pages/chat/models/chat-link.model';

// Enums
import { ChatUserProfileResourceTypeEnum } from '@pages/chat/enums/conversation/conversation-details/chat-user-profile-resource-type.enum';

// Assets
import { ChatSvgRoutes } from '@pages/chat/utils/routes/chat-svg-routes';

@Component({
  selector: 'app-chat-profile-resources',
  templateUrl: './chat-profile-resources.component.html',
  styleUrls: ['./chat-profile-resources.component.scss']
})
export class ChatProfileResourcesComponent implements OnInit {

  @Input() public title!: string;
  @Input() public hasHorizontalBorder: boolean = true;
  @Input() public customClass!: string;
  @Input() public count: number = 0;
  @Input() public type: ChatUserProfileResourceTypeEnum;

  // Resources
  @Input() resources: Array<FileResponse | ChatLink | null>;

  // Assets 
  public ChatSvgRoutes = ChatSvgRoutes;

  public isExpanded: boolean = false;

  constructor() { }

  ngOnInit(): void { }

  public toggleShowAll(): void {
    this.isExpanded = !this.isExpanded;
  }
}
