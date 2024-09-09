import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

// Assets
import { ChatSvgRoutes } from '@pages/chat/utils/routes/chat-svg-routes';

// Config
import { ChatInput } from '@pages/chat/utils/config/chat-input.config';

// Models
import { CompanyUserChatResponsePagination } from 'appcoretruckassist';
import { ChatCompanyChannelExtended } from '@pages/chat/models/chat-company-channels-extended.model';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.scss']
})
export class ConversationListComponent implements OnInit {

  public searchForm!: UntypedFormGroup;

  // Assets
  public ChatSvgRoutes = ChatSvgRoutes;
  //TODO create enum?
  public titleIcon: string;

  // Config
  public ChatInput = ChatInput;

  // Data
  @Input() public departments: ChatCompanyChannelExtended[];
  @Input() public channels: any[];
  @Input() public companyUsers: CompanyUserChatResponsePagination;
  @Input() public drivers: CompanyUserChatResponsePagination;

  constructor(private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.creteForm();
    // this.listenForSearchTermChange();
  }

  private creteForm(): void {
    this.searchForm = this.formBuilder.group({
      searchTerm: [null]
    });
  }
}
