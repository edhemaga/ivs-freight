import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Models
import { CompanyUserChatResponsePaginationReduced } from '@pages/chat/models/company-user-chat-response.model';

// Enums
import { ChatRoutesEnum } from '@pages/chat/enums/routes/chat-routes.enum';

// Constants
import { ChatToolbarData } from '@pages/chat/util/constants/chat-toolbar-data.constants';

// Routes
import { ChatSvgRoutes } from '@pages/chat/util/constants/chat-svg-routes.constants';

// Service
import { UserChatService } from "@pages/chat/services/chat.service";
import { ChatTab } from '@pages/chat/models/chat-tab.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public title!: string;

  companyUsers!: CompanyUserChatResponsePaginationReduced;
  drivers!: CompanyUserChatResponsePaginationReduced;
  archivedCompanyUsers!: CompanyUserChatResponsePaginationReduced;
  archivedDrivers!: CompanyUserChatResponsePaginationReduced;

  selectedConversation: number;

  // Tab and header ribbon configuration
  public tabs: ChatTab[] = ChatToolbarData.tabs;

  public ChatSvgRoutes = ChatSvgRoutes;

  private userChatService = inject(UserChatService);

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getResolvedData();
  }

  private getResolvedData(): void {
    this.activatedRoute.data.subscribe({
      next: res => {
        this.title = res.title;
        this.drivers = res.drivers;
        this.companyUsers = res.users;
        this.tabs[0].count = this.drivers.count + this.companyUsers.count;
      }
    });
  }

  public trackById(index: number, tab: ChatTab): number {
    return tab.id;
  }

  public onSelectTab(item: ChatTab): void {
    this.tabs.forEach(arg => {
      arg.checked = arg.name === item.name
    })
    //TODO Create store and set value there
  }

  public createUserConversation(selectedUser: number): void {

    if (selectedUser === 0) return;

    this.userChatService
      .createConversation([selectedUser])
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
