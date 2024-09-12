import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {
  map,
  Observable,
  Subject,
  takeUntil
} from 'rxjs';

// Assets routes
import { ChatSvgRoutes } from '@pages/chat/utils/routes';

// Services
import { UserChatService } from '@pages/chat/services';

// Models
import { UserType } from 'appcoretruckassist';
import { CompanyUserChatResponsePaginationReduced } from '@pages/chat/models';

@Component({
  selector: 'app-chat-user-list',
  templateUrl: './chat-user-list.component.html',
  styleUrls: ['./chat-user-list.component.scss'],
})
export class ChatUserListComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  @Input() contactsInfo: CompanyUserChatResponsePaginationReduced;
  @Input() type: string;

  @Output() selectedUser = new EventEmitter<number>();
  public selectedUserId: number = 0;

  // Assets and constants
  public ChatSvgRoutes = ChatSvgRoutes;

  // Search
  public isSearchActive: boolean = false;

  constructor(private userChatService: UserChatService) { }

  ngOnInit(): void { }

  public selectUser(userId: number): void {
    if (!userId) return;
    this.selectedUserId = userId;

    if (!this.selectedUserId) return;
    this.selectedUser.emit(this.selectedUserId);
  }

  public showOnlineUsers(): void { }

  public filterByDepartment(): void { }

  public openSearch(): void {
    this.isSearchActive = true;
  }

  public search(searchTerm: string): void {
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
      .getCompanyUserList(castedUserType, null, null, searchTerm?.trim())
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
    this.selectedUserId = 0;
    this.isSearchActive = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.cleanUp();
  }
}

