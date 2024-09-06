import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Components
import { ChatMessagesComponent } from '@pages/chat/components/conversation/conversation-content/chat-messages/chat-messages.component';

// Models
import { ConversationType } from 'appcoretruckassist';
import { ChatResolvedData } from '@pages/chat/models/chat-resolved-data.model';
import { CompanyUserChatResponsePaginationReduced } from '@pages/chat/models/company-user-chat-response.model';

// Enums
import { ChatRoutesEnum } from '@pages/chat/enums/routes/chat-routes.enum';
import { ConversationTypeEnum } from '@pages/chat/enums/shared/chat-conversation-type.enum';

// Constants
import { ChatToolbarDataConstants } from '@pages/chat/utils/constants/chat-toolbar-data.constants';

// Routes
import { ChatSvgRoutes } from '@pages/chat/utils/routes/chat-svg-routes';

// Service
import { UserChatService } from "@pages/chat/services/chat.service";
import { ChatTab } from '@pages/chat/models/chat-tab.model';
import { ChatCompanyChannelExtended } from '@pages/chat/models/chat-company-channels-extended.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public title!: string;

  public companyUsers!: CompanyUserChatResponsePaginationReduced;
  public drivers!: CompanyUserChatResponsePaginationReduced;
  public archivedCompanyUsers!: CompanyUserChatResponsePaginationReduced;
  public archivedDrivers!: CompanyUserChatResponsePaginationReduced;
  public companyChannels!: ChatCompanyChannelExtended[];

  public unreadCount!: number;
  public selectedConversation: number;
  public ConversationTypeEnum = ConversationTypeEnum;

  // Tab and header ribbon configuration
  public tabs: ChatTab[] = ChatToolbarDataConstants.tabs;

  public ChatSvgRoutes = ChatSvgRoutes;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,

    // Services
    private chatService: UserChatService
  ) { }

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
        this.companyChannels = res.companyChannels;
        this.tabs[0].count = this.drivers.count + this.companyUsers.count;
        this.unreadCount = this.getUnreadCount(this.companyUsers, this.drivers);
      });
  }

  public onSelectTab(item: ChatTab): void {
    this.tabs.forEach(arg => {
      arg.checked = arg.name === item.name
    })
    //TODO Create store and set value there
  }

  public createUserConversation(
    selectedUser: number,
    chatType: ConversationType
  ): void {

    if (!selectedUser) return;

    this.chatService
      .createConversation([selectedUser], chatType)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res?.id !== 0) {
            this.selectedConversation = res.id;
            this.router.navigate([ChatRoutesEnum.CONVERSATION, res.id]);
          }
        }
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
      return accumulator + currentObject.unreadCount
    }, 0);

    if (archivedUsers)
      totalUnreadCount = archivedUsers.data.reduce((accumulator, currentObject) => {
        return accumulator + currentObject.unreadCount
      }, 0);

    // Drivers
    totalUnreadCount = drivers.data.reduce((accumulator, currentObject) => {
      return accumulator + currentObject.unreadCount
    }, 0);

    if (archivedDrivers) totalUnreadCount = archivedUsers.data.reduce((accumulator, currentObject) => {
      return accumulator + currentObject.unreadCount
    }, 0);

    return totalUnreadCount;
  }

  public onActivate(component: ChatMessagesComponent): void {
    if (component instanceof ChatMessagesComponent) {
      component.userTypingEmitter
        .pipe(takeUntil(this.destroy$))
        .subscribe((userId: number) => {
          if (userId) {
            const driver = this.drivers.data.find(driver => {
              driver.companyUser?.userId === userId;
            })
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
