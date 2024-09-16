import {
  Component,
  OnInit,
  Input,
  Output
} from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  takeUntil
} from 'rxjs';

// Services
import {
  UserChatService,
} from '@pages/chat/services';

// Models
import { ChatMessageResponse } from '@pages/chat/models';
import {
  CompanyUserShortResponse,
  ConversationResponse
} from 'appcoretruckassist';

// Enums
import {
  ChatConversationType,
  ChatGroupEnum
} from '@pages/chat/enums';

// Helpers
import {
  GetCurrentUserHelper,
  UnsubscribeHelper
} from '@pages/chat/utils/helpers';

// Assets
import { ChatSvgRoutes } from '@pages/chat/utils/routes';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-conversation-content',
  templateUrl: './conversation-content.component.html',
  styleUrls: ['./conversation-content.component.scss']
})
export class ConversationContentComponent extends UnsubscribeHelper implements OnInit {

  @Input() group: ChatGroupEnum;
  @Input() public attachmentUploadActive: boolean = false;

  @Output() isProfileDetailsDisplayed: EventEmitter<boolean> = new EventEmitter();
  @Output() isConversationParticipantsDisplayed: EventEmitter<{
    isDisplayed: boolean,
    conversationParticipants: CompanyUserShortResponse[]
  }> = new EventEmitter();

  public messages: ChatMessageResponse[] = [];

  // Group info
  public chatConversationType = ChatConversationType;
  public chatGroupEnum = ChatGroupEnum;

  //User data
  private getCurrentUserHelper = GetCurrentUserHelper;

  private conversation!: ConversationResponse;
  public conversationParticipants!: CompanyUserShortResponse[];

  // Assets
  public chatSvgRoutes = ChatSvgRoutes;

  constructor(
    //Router
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getResolvedData();
    this.getDataOnRouteChange();
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
                  participant.id !== this.getCurrentUserHelper.currentUserId
              );

        }
      );
  }

  public displayGroupParticipants(): void {
    this.isConversationParticipantsDisplayed.emit({ isDisplayed: true, conversationParticipants: this.conversationParticipants });
  }

  private getDataOnRouteChange(): void {
    this.router
      .events
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(() => {
        this.isProfileDetailsDisplayed.emit(false);
      });

    this.activatedRoute.queryParams.subscribe(params => {
      this.group = params[this.chatConversationType.CHANNEL] != this.group ?
        params[this.chatConversationType.CHANNEL] :
        this.group;
    });
  }
}
