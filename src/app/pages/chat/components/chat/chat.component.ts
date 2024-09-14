import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

// Models
import { ConversationType } from 'appcoretruckassist';
import {
  ChatResolvedData,
  CompanyUserChatResponsePaginationReduced,
  ChatTab,
  ChatCompanyChannelExtended,
} from '@pages/chat/models';

// Enums
import { ChatGroupEnum, ChatRoutesEnum, ConversationTypeEnum } from '@pages/chat/enums';

// Constants
import { ChatToolbarDataConstant } from '@pages/chat/utils/constants';

// Routes
import { ChatSvgRoutes } from '@pages/chat/utils/routes';

// Service
import { UserChatService } from '@pages/chat/services';

// Helpers
import { UnsubscribeHelper } from '@pages/chat/utils/helpers/unsubscribe-helper';

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

  // Tab and header ribbon configuration
  public tabs: ChatTab[] = ChatToolbarDataConstant.tabs;

  public ChatSvgRoutes = ChatSvgRoutes;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,

    // Services
    private chatService: UserChatService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getResolvedData();
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
          this.drivers.count + this.companyUsers.count;
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
    group: ChatGroupEnum
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
                queryParams: { group }
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
}
