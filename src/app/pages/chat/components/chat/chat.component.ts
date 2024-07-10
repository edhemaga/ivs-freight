import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

//Models
import { CompanyUserChatResponsePaginationReduced } from '@pages/chat/models/company-user.model';

// Service
import { UserChatService } from "@pages/chat/services/chat.service";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

//TODO move to models
type ChatTab = {
  name: string;
  count: number;
  isActive: boolean;
}

//TODO add clean up mechanism
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  title: string = "";

  companyUsers!: CompanyUserChatResponsePaginationReduced;
  drivers!: CompanyUserChatResponsePaginationReduced;
  archivedCompanyUsers!: CompanyUserChatResponsePaginationReduced;
  archivedDrivers!: CompanyUserChatResponsePaginationReduced;

  selectedConversation: number;

  //TODO move to separate file and maybe make it static class
  // Tab and header ribbon configuration
  tabs: ChatTab[] = [
    {
      name: 'Conversation',
      count: 0,
      isActive: true,
    },
    {
      name: 'Archive',
      count: 0,
      isActive: false
    }
  ];

  private userChatService = inject(UserChatService);

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  private getData(): void {
    this.activatedRoute.data.subscribe({
      next: res => {

        this.title = res.title;
        this.drivers = res.drivers;
        this.companyUsers = res.users;
        this.tabs[0].count = this.drivers.count + this.companyUsers.count;

      },
      error: () => { },
    })
  }

  public onSelectTab(item: ChatTab): void {
    this.tabs.forEach(arg => {
      if (arg.name != item.name) {
        arg.isActive = false;
      }
      else {
        arg.isActive = true;
      }

    })
    //TODO Set in localstorage 
  }

  createUserConversation(selectedUser: number): void {

    if (selectedUser == 0) return;

    this.userChatService
      .createConversation([selectedUser])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res && res?.id != 0) {
            this.selectedConversation = res.id;
            this.router.navigate(['chat/conversation', res.id]);
          }
        }
      });
  }

  onToolBarAction(action: string): void { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
