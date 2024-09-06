import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatUserListComponent } from '@pages/chat/components/conversation-list/chat-user-list/chat-user-list.component';

describe('ChatUserListComponent', () => {
  let component: ChatUserListComponent;
  let fixture: ComponentFixture<ChatUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatUserListComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChatUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
