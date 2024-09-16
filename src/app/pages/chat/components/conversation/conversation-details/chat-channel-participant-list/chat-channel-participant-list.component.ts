import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup
} from '@angular/forms';

// Models
import { CompanyUserShortResponse } from 'appcoretruckassist';

// Utils
import { UnsubscribeHelper } from '@pages/chat/utils/helpers';
import { ChatInput } from '@pages/chat/utils/config';

// Assets
import { ChatSvgRoutes } from '@pages/chat/utils/routes';

@Component({
  selector: 'app-chat-channel-participant-list',
  templateUrl: './chat-channel-participant-list.component.html',
  styleUrls: ['./chat-channel-participant-list.component.scss']
})
export class ChatChannelParticipantListComponent extends UnsubscribeHelper implements OnInit {

  @Input() public conversationParticipants!: CompanyUserShortResponse[];

  public isSearchActive: boolean = false;

  public searchForm!: UntypedFormGroup;

  // Assets
  public chatSvgRoutes = ChatSvgRoutes;
  public chatInput = ChatInput;


  constructor(private formBuilder: UntypedFormBuilder) {
    super();
    this.creteForm();
  }


  private creteForm(): void {
    this.searchForm = this.formBuilder.group({
      searchTerm: [null]
    });
  }

  ngOnInit(): void { }
}
