import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';

// SVG routes
import { ChatSvgRoutes } from '@pages/chat/util/constants/chat-svg-routes.constants';

// Models
import { CompanyUserChatResponse } from 'appcoretruckassist';
import { CompanyUserChatResponsePaginationReduced } from '@pages/chat/models/company-user-chat-response.model';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-chat-user-list',
  templateUrl: './chat-user-list.component.html',
  styleUrls: ['./chat-user-list.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('*', style(
        { 'overflow-y': 'hidden' }
      )),
      state('void', style(
        { 'overflow-y': 'hidden' }
      )),
      transition('* => void', [
        style(
          { height: '*' }
        ),
        animate(350, style(
          { height: 0 }
        ))
      ]),
      transition('void => *', [
        style(
          { height: '0' }
        ),
        animate(350, style(
          { height: '*' }
        ))
      ])
    ]),
  ]
})
export class ChatUserListComponent implements OnInit, OnDestroy {

  @Input() contactsInfo: CompanyUserChatResponsePaginationReduced;
  @Input() type: string;

  @Output() selectedUser = new EventEmitter<number>();
  public selectedUserId: number = 0;

  public filteredUsers!: CompanyUserChatResponse[];

  public ChatSvgRoutes = ChatSvgRoutes;

  public searchForm!: UntypedFormGroup;
  public isSearchActive: boolean = false;
  public searchTerm: string = "";

  constructor(private formBuilder: UntypedFormBuilder) {
    this.creteForm();
  }

  ngOnInit(): void {
    this.listenForSearchTermChange();
  }

  public selectUser(userId: number): void {
    if (!userId) return;
    this.selectedUserId = userId;

    if (!this.selectedUserId) return;
    this.selectedUser.emit(this.selectedUserId);
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

  public toggleSearch(isActive?: boolean): void {
    this.isSearchActive = isActive ?? !this.isSearchActive;
  }

  private listenForSearchTermChange(): void {
    if (!this.searchForm) return;
    this.searchForm
      .valueChanges
      .pipe(
        debounceTime(350)
      )
      .subscribe(arg => { this.search(arg.searchTerm) })
  }

  private search(searchTerm: string): void {
    this.filteredUsers = this.contactsInfo
      .data
      .filter(
        contact =>
          contact
            .companyUser
            ?.fullName
            ?.includes(searchTerm)
      )
    this.contactsInfo.data = this.filteredUsers;
  }

  cleanUp(): void {
    this.searchForm = null;
    this.selectedUserId = 0;
    this.searchTerm = "";
    this.isSearchActive = false;
  }

  ngOnDestroy(): void {
    this.cleanUp();
  }
}
