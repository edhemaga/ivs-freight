import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  Observable,
  takeUntil
} from 'rxjs';

// Services
import {
  ChatHubService,
  UserChatService,
  UserProfileService
} from '@pages/chat/services';

// Models
import { ChatMessageResponse } from '@pages/chat/models';
import {
  CompanyUserShortResponse,
  ConversationInfoResponse,
  ConversationResponse
} from 'appcoretruckassist';

// Enums
import { ChatGroupEnum } from '@pages/chat/enums';

// Helpers
import { UnsubscribeHelper } from '@pages/chat/utils/helpers';

// Assets
import { ChatSvgRoutes } from '@pages/chat/utils/routes';

@Component({
  selector: 'app-conversation-content',
  templateUrl: './conversation-content.component.html',
  styleUrls: ['./conversation-content.component.scss']
})
export class ConversationContentComponent extends UnsubscribeHelper implements OnInit {

  @Input() group: ChatGroupEnum;

  public messages: ChatMessageResponse[] = [];

  // Group info
  public chatGroupEnum = ChatGroupEnum;

  //User data
  public currentUserId: number = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')).companyUserId
    : 0;

  private conversation!: ConversationResponse;
  public conversationParticipants!: CompanyUserShortResponse[];

  // Attachment upload
  public attachmentUploadActive: boolean = false;

  // User Profile Data
  public userProfileData!: Observable<ConversationInfoResponse>;
  public isProfileDetailsDisplayed: boolean = false;

  // Assets
  public chatSvgRoutes = ChatSvgRoutes;

  constructor(
    //Router
    private router: Router,
    private activatedRoute: ActivatedRoute,

    // Services
    private chatService: UserChatService,
    private chatHubService: ChatHubService,
    public userProfileService: UserProfileService

  ) {
    super();
  }

  ngOnInit(): void {
    this.getResolvedData();
    this.getDataOnRouteChange();
    this.userProfileData = this.userProfileService.getProfile();
  }

  private getResolvedData(): void {
    this.activatedRoute
      .data
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.messages = [...res.messages?.pagination?.data];

          // Conversation participants
          this.conversation = res.information;

          this.conversationParticipants =
            this.conversation
              ?.participants
              .filter(
                participant =>
                  participant.id !== this.currentUserId
              );

        }
      );
  }

  public displayProfileDetails(value: boolean): void {

    if (this.isProfileDetailsDisplayed && !value) {
      this.isProfileDetailsDisplayed = value;
      return;
    }

    if (this.conversation?.id && value) {

      this.chatService
        .getAllConversationFiles(this.conversation.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: ConversationInfoResponse) => {
          this.isProfileDetailsDisplayed = value;
          this.userProfileService.setProfile(data);
        })
    }
  }

  private getDataOnRouteChange(): void {
    this.router
      .events
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(() => {
        this.isProfileDetailsDisplayed = false;
      });

    this.activatedRoute.queryParams.subscribe(params => {
      this.group = params['group'] != this.group ? params['group'] : this.group;
    });
  }
}
