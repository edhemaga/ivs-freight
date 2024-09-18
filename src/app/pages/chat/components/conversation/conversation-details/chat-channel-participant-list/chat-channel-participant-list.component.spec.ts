import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatChannelParticipantListComponent } from '@pages/chat/components/conversation/conversation-details/chat-channel-participant-list/chat-channel-participant-list.component';

describe('ChatChannelParticipantListComponent', () => {
  let component: ChatChannelParticipantListComponent;
  let fixture: ComponentFixture<ChatChannelParticipantListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatChannelParticipantListComponent]
    });
    fixture = TestBed.createComponent(ChatChannelParticipantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
