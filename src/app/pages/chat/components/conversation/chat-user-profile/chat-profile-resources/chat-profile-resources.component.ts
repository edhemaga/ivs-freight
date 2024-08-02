import {
  Component,
  Input,
  OnInit
} from '@angular/core';

// Models
import { FileResponse } from 'appcoretruckassist';

// Enums
import { UserProfileResourceType } from '@pages/chat/enums/conversation/user-profile-resource-type.enum';

@Component({
  selector: 'app-chat-profile-resources',
  templateUrl: './chat-profile-resources.component.html',
  styleUrls: ['./chat-profile-resources.component.scss']
})
export class ChatProfileResourcesComponent implements OnInit {

  @Input() public title!: string;
  @Input() public showHorizontalBorder: boolean = true;
  @Input() public customClass!: string;
  public isExpanded: boolean = false;

  @Input() public count: number = 0;
  @Input() public type: UserProfileResourceType;

  // Resources
  @Input() resources: Array<FileResponse | string | null>;

  constructor() { }

  ngOnInit(): void { }

  public toggleShowAll(): void {
    this.isExpanded = !this.isExpanded;
  }
}
