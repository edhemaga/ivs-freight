import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatUserListItemComponent } from '@pages/chat/components/left-side-panel/user/chat-user-list-item/chat-user-list-item.component';

describe('UserChatListItemComponent', () => {
    let component: ChatUserListItemComponent;
    let fixture: ComponentFixture<ChatUserListItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChatUserListItemComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ChatUserListItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
