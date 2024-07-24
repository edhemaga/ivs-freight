import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {
  debounceTime,
  map,
  Observable,
  Subject,
  takeUntil
} from 'rxjs';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';

// Assets routes
import { ChatSvgRoutes } from '@pages/chat/util/constants/chat-svg-routes.constants';

// Animations
import { chatUserListSearchAnimation } from '@shared/animations/chat.animation';

// Config
import { ChatInput } from '@pages/chat/util/config/chat-input.config';

// Services
import { UserChatService } from '@pages/chat/services/chat.service';

// Models
import { CompanyUserChatResponse, UserType } from 'appcoretruckassist';
import { CompanyUserChatResponsePaginationReduced } from '@pages/chat/models/company-user-chat-response.model';

@Component({
  selector: 'app-chat-user-list',
  templateUrl: './chat-user-list.component.html',
  styleUrls: ['./chat-user-list.component.scss'],
  animations: [chatUserListSearchAnimation]
})
export class ChatUserListComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  @Input() contactsInfo: CompanyUserChatResponsePaginationReduced;
  @Input() type: string;

  @Output() selectedUser = new EventEmitter<number>();
  public selectedUserId: number = 0;

  // Assets
  public ChatSvgRoutes = ChatSvgRoutes;

  // Config
  public ChatInput: ChatInput = ChatInput;

  // Search
  public searchForm!: UntypedFormGroup;
  public isSearchActive: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userChatService: UserChatService
  ) { }

  ngOnInit(): void {
    this.creteForm();
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
        takeUntil(this.destroy$),
        debounceTime(350)
      )
      .subscribe(arg => {
        this.search(arg.searchTerm)
      })
  }

  private search(searchTerm: string): void {
    if (!searchTerm) {
      this.getUpdatedData()
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          res => {
            this.contactsInfo = res;
          }
        );
      return;
    };
    this.getUpdatedData(searchTerm)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        res => {
          this.contactsInfo = res;
        }
      );
  }

  private getUpdatedData(searchTerm?: string): Observable<CompanyUserChatResponsePaginationReduced> {
    const castedUserType: UserType = UserType[this.type];

    return this.userChatService
      .getCompanyUserList(castedUserType, searchTerm?.trim())
      .pipe(takeUntil(this.destroy$),
        map(res => {
          const listOfUsers: CompanyUserChatResponsePaginationReduced = {
            count: res?.pagination?.count,
            data: res?.pagination?.data
          }
          return listOfUsers;
        }))
  }

  private cleanUp(): void {
    this.searchForm = null;
    this.selectedUserId = 0;
    this.isSearchActive = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.cleanUp();
  }
}

