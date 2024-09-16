import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

// Components
import { ConversationContentComponent } from '@pages/chat/components/conversation/conversation-content/conversation-content.component';

// Models
import {
  ConversationInfoResponse,
  ConversationType
} from 'appcoretruckassist';
import {
  ChatResolvedData,
  CompanyUserChatResponsePaginationReduced,
  ChatTab,
  ChatCompanyChannelExtended,
} from '@pages/chat/models';

// Enums
import {
  ChatGroupEnum,
  ChatRoutesEnum,
  ConversationTypeEnum
} from '@pages/chat/enums';

// Constants
import { ChatToolbarDataConstant } from '@pages/chat/utils/constants';

// Routes
import { ChatSvgRoutes } from '@pages/chat/utils/routes';

// Service
import {
  UserChatService,
  UserProfileService
} from '@pages/chat/services';

// Helpers
import { UnsubscribeHelper } from '@pages/chat/utils/helpers/unsubscribe-helper';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent
  extends UnsubscribeHelper
  implements OnInit, OnDestroy {

  public title!: string;

  // Data
  public departments!: ChatCompanyChannelExtended[];
  public companyChannels: ChatCompanyChannelExtended[];
  public companyUsers!: CompanyUserChatResponsePaginationReduced;
  public drivers!: CompanyUserChatResponsePaginationReduced;
  public archivedCompanyUsers!: CompanyUserChatResponsePaginationReduced;
  public archivedDrivers!: CompanyUserChatResponsePaginationReduced;

  public unreadCount!: number;
  public selectedConversation: number;
  public ConversationTypeEnum = ConversationTypeEnum;

  // Attachment upload
  public attachmentUploadActive: boolean = false;

  // User Profile Data
  public userProfileData!: Observable<ConversationInfoResponse>;
  public isProfileDetailsDisplayed: boolean = false;
  public isGroupMembersDisplayed: boolean = false;

  // Tab and header ribbon configuration
  public tabs: ChatTab[] = ChatToolbarDataConstant.tabs;

  public ChatSvgRoutes = ChatSvgRoutes;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,

    // Services
    private chatService: UserChatService,
    public userProfileService: UserProfileService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getResolvedData();
    this.userProfileData = this.userProfileService.getProfile();
  }

  private getResolvedData(): void {
    this.activatedRoute.data
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: ChatResolvedData) => {
        this.title = res.title;
        this.drivers = res.drivers;
        this.companyUsers = res.users;
        this.departments = res.departments;
        this.tabs[0].count =
          this.drivers.count + this.companyUsers.count + this.departments.length;
        this.unreadCount = this.getUnreadCount(
          this.companyUsers,
          this.drivers
        );
      });
  }

  public onSelectTab(item: ChatTab): void {
    this.tabs.forEach((arg) => {
      arg.checked = arg.name === item.name;
    });
    //TODO Create store and set value there
  }

  public createUserConversation(
    selectedConversation: number[],
    chatType: ConversationType,
    channel: ChatGroupEnum
  ): void {

    if (!selectedConversation?.length) return;

    this.chatService
      .createConversation(selectedConversation, chatType)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res?.id !== 0) {
            this.selectedConversation = res.id;
            this.router.navigate(
              [ChatRoutesEnum.CONVERSATION, res.id],
              {
                queryParams: { channel }
              }
            );
          }
        },
      });
  }

  public searchDepartment(searchTerm: string): void { }

  private getUnreadCount(
    users: CompanyUserChatResponsePaginationReduced,
    drivers: CompanyUserChatResponsePaginationReduced,
    archivedUsers?: CompanyUserChatResponsePaginationReduced,
    archivedDrivers?: CompanyUserChatResponsePaginationReduced
  ): number {
    let totalUnreadCount = 0;
    // Users
    totalUnreadCount = users.data.reduce((accumulator, currentObject) => {
      return accumulator + (currentObject.hasUnreadMessage ? 1 : 0);
    }, 0);

    if (archivedUsers)
      totalUnreadCount = archivedUsers.data.reduce(
        (accumulator, currentObject) => {
          return (
            accumulator + (currentObject.hasUnreadMessage ? 1 : 0)
          );
        },
        0
      );

    // Drivers
    totalUnreadCount = drivers.data.reduce((accumulator, currentObject) => {
      return accumulator + (currentObject.hasUnreadMessage ? 1 : 0);
    }, 0);

    if (archivedDrivers)
      totalUnreadCount = archivedUsers.data.reduce(
        (accumulator, currentObject) => {
          return (
            accumulator + (currentObject.hasUnreadMessage ? 1 : 0)
          );
        },
        0
      );

    return totalUnreadCount;
  }

  public displayProfileDetails(value: boolean): void {

    if (this.isProfileDetailsDisplayed && !value) {
      this.isProfileDetailsDisplayed = value;
      return;
    }

    if (/*this.conversation?.id &&*/ value) {

      this.chatService
        .getAllConversationFiles(/*this.conversation.id*/ 0)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: ConversationInfoResponse) => {
          this.isProfileDetailsDisplayed = value;
          this.userProfileService.setProfile(data);
        })
    }
  }

  public displayGroupParticipants(isDisplayed: Observable<boolean>): void {
    isDisplayed
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (arg: boolean) => {
          if (arg !== undefined)
            this.isGroupMembersDisplayed = arg;
          console.log(this.isGroupMembersDisplayed);
        })
  }

  public onActivate(event: ConversationContentComponent): void {
    this.displayGroupParticipants(event?.
      isConversationParticipantsDisplayed);

  }
}
