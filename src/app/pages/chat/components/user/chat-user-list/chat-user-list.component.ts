import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';

// SVG routes
import { ChatSvgRoutes } from '@pages/chat/util/constants/chat-svg-routes.constants';

// Models
import { CompanyUserChatResponse } from 'appcoretruckassist';
import { CompanyUserChatResponsePaginationReduced } from '@pages/chat/models/company-user-chat-response.model';

@Component({
  selector: 'app-chat-user-list',
  templateUrl: './chat-user-list.component.html',
  styleUrls: ['./chat-user-list.component.scss'],
})
export class ChatUserListComponent implements OnInit {

  @Input() contact: CompanyUserChatResponsePaginationReduced;
  @Input() type: string;

  @Output() selectedUser = new EventEmitter<number>();

  public ChatSvgRoutes = ChatSvgRoutes;

  public searchForm!: UntypedFormGroup;
  public isSearchActive: boolean = false;
  public searchTerm: string = "";

  constructor(private formBuilder: UntypedFormBuilder) {
    this.creteForm();
  }

  ngOnInit(): void { }

  public selectUser(userId: number): void {
    this.selectedUser.emit(userId);
  }

  public trackById(index: number, chat: CompanyUserChatResponse): number {
    return chat.companyUser.id;
  }

  public showOnlineUsers(): void { }

  public filterByDepartment(): void { }

  private creteForm(): void {
    this.searchForm = this.formBuilder.group({
      searchTerm: [null]
    });
  }

  public toggleSearch(): void {
    this.isSearchActive = !this.isSearchActive;
  }
}
