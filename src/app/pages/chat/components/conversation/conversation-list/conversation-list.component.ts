import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup
} from '@angular/forms';

// Assets
import { ChatSvgRoutes } from '@pages/chat/utils/routes/chat-svg-routes';

// Config
import { ChatInput } from '@pages/chat/utils/config/chat-input.config';

// Models
import {
  CompanyUserChatResponse,
  CompanyUserChatResponsePagination
} from 'appcoretruckassist';
import { ChatCompanyChannelExtended } from '@pages/chat/models/chat-company-channels-extended.model';
import { ChatGroupStateInterface } from '@pages/chat/models/conversation-list/chat-group-state.interface';

// Enums
import { ConversationTypeEnum } from '@pages/chat/enums/shared/chat-conversation-type.enum';
import { ChatGroupEnum } from '@pages/chat/enums/conversation/conversation-list/chat-group.enum';
import { ChatGroupStateEnum } from '@pages/chat/enums/conversation/conversation-list/chat-group-state.enum';

// Animations
import { chatUserListSearchAnimation } from '@shared/animations/chat.animation';


@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.scss'],
  animations: [chatUserListSearchAnimation]
})
export class ConversationListComponent implements OnInit {

  // Data
  @Input() public departments: ChatCompanyChannelExtended[];
  @Input() public truckChannel: ChatCompanyChannelExtended[];
  @Input() public dispatchBoardChannel: ChatCompanyChannelExtended[];
  @Input() public companyUsers: CompanyUserChatResponsePagination;
  @Input() public drivers: CompanyUserChatResponsePagination;

  @Output() selectedConversation = new EventEmitter<{ id: number, type: ConversationTypeEnum }>();

  public searchForm!: UntypedFormGroup;

  // Assets
  public ChatSvgRoutes = ChatSvgRoutes;
  //TODO create enum?
  public titleIcon: string;

  // Config
  public ChatInput = ChatInput;
  public isAdvancedView: boolean = false;


  // Create list of states for all groups available

  public groupsState: ChatGroupStateInterface<ChatCompanyChannelExtended[] | CompanyUserChatResponsePagination>[] = [
    {
      id: ChatGroupEnum.Department,
      state: ChatGroupStateEnum.Expanded
    }, {
      id: ChatGroupEnum.Truck,
      state: ChatGroupStateEnum.Expanded
    },
    {
      id: ChatGroupEnum.Dispatch,
      state: ChatGroupStateEnum.Expanded
    }, {
      id: ChatGroupEnum.CompanyUser,
      state: ChatGroupStateEnum.Expanded
    }, {
      id: ChatGroupEnum.Driver,
      state: ChatGroupStateEnum.Expanded
    }
  ];

  public ChatGroupStateEnum = ChatGroupStateEnum;
  public ChatGroupEnum = ChatGroupEnum;
  public ConversationTypeEnum = ConversationTypeEnum;

  constructor(private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.initializeChatGroupStates();
    this.creteForm();
    // this.listenForSearchTermChange();
  }

  private creteForm(): void {
    this.searchForm = this.formBuilder.group({
      searchTerm: [null]
    });
  }

  private initializeChatGroupStates(): void {
    this.groupsState = [
      {
        ...this.findChatGroupState(ChatGroupEnum.Department),
        groupData: this.departments
      },
      {
        ...this.findChatGroupState(ChatGroupEnum.Truck),
        groupData: this.truckChannel
      },
      {
        ...this.findChatGroupState(ChatGroupEnum.Dispatch),
        groupData: this.dispatchBoardChannel
      },
      {
        ...this.findChatGroupState(ChatGroupEnum.CompanyUser),
        groupData: this.companyUsers
      },
      {
        ...this.findChatGroupState(ChatGroupEnum.Driver),
        groupData: this.drivers
      }
    ];
  }

  private findChatGroupState(groupId: ChatGroupEnum): ChatGroupStateInterface<ChatCompanyChannelExtended[] | CompanyUserChatResponsePagination> {
    return this.groupsState.find(group => group.id === groupId);
  }


  public toggleChatGroupState(id: ChatGroupEnum): void {

    this.groupsState = this.groupsState.map(group => {

      if (group.id !== id) return group;

      switch (group.state) {
        case ChatGroupStateEnum.Expanded:
          group.state = ChatGroupStateEnum.Collapsed;
          break;
        case ChatGroupStateEnum.Collapsed:
          group.state = ChatGroupStateEnum.Expanded;
          break;
        default:
          break;
      }

      return group;

    });

  };

  public selectConversation(item: ChatCompanyChannelExtended | CompanyUserChatResponse, type: ConversationTypeEnum): void {
    if ('companyUser' in item) {
      this.selectedConversation.emit(
        {
          id: item.companyUser?.id,
          type
        }
      );
      return;
    }

    if ('id' in item) {
      this.selectedConversation.emit({
        id: item.id,
        type
      });
      return;
    }

  }

}
