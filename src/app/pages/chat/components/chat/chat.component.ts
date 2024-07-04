import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

//Models
import { CompanyUserChatResponsePaginationReduced } from '@pages/chat/models/company-user.model';

//TODO move to models
type ChatTab = {
  name: string;
  count: number;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  title: string = "";

  companyUsers!: CompanyUserChatResponsePaginationReduced;
  drivers!: CompanyUserChatResponsePaginationReduced;

  //TODO move to separate file and maybe make it static class
  // Tab and header ribbon configuration
  tabs: ChatTab[] = [
    {
      name: 'Conversation',
      count: 5
    },
    {
      name: 'Archive',
      count: 1
    }
  ];
  selectedTab!: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getData();
  }

  private getData(): void {
    this.activatedRoute.data.subscribe({
      next: res => {

        this.title = res.title;
        this.drivers = res.drivers;
        this.companyUsers = res.users;

      },
      error: () => { }
    })
  }

  public onSelectTab(item: ChatTab): void {
    this.selectedTab = item.name;
    //TODO Set in localstorage 
  }

  onToolBarAction(action: string): void { }

}
