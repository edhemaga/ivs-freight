import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup
} from '@angular/forms';
import {
  takeUntil,
  debounceTime
} from 'rxjs/operators';


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

  @Input() public conversationParticipants: CompanyUserShortResponse[] = [];

  public searchConversationParticipants!: CompanyUserShortResponse[];

  public isSearchActive: boolean = false;

  public searchForm!: UntypedFormGroup;

  // Assets
  public chatSvgRoutes = ChatSvgRoutes;
  public chatInput = ChatInput;


  constructor(private formBuilder: UntypedFormBuilder) {
    super();
    this.creteForm();
    this.listenForSearchTermChange();
  }


  private creteForm(): void {
    this.searchForm = this.formBuilder.group({
      searchTerm: [null]
    });
  }

  private listenForSearchTermChange(): void {

    if (!this.searchForm) return;

    this.searchForm
      .valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(350)
      )
      .subscribe(
        (arg: { searchTerm: string }) => {

          const searchTerm: string = arg.searchTerm.toLowerCase().trim();

          this.searchConversationParticipants = this.conversationParticipants
            .filter(participant =>
              participant.fullName.toLowerCase().includes(searchTerm)
            );
        });
  }

  ngOnInit(): void {
    this.conversationParticipants = [
      ...this.conversationParticipants,
      ...this.conversationParticipants,
      ...this.conversationParticipants,
      ...this.conversationParticipants
    ]
  }
}
