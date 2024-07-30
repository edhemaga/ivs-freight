import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessagesNotSelectedComponent } from '@pages/chat/components/conversation/chat-messages-not-selected/chat-messages-not-selected.component';
describe('ChatMessagesNotSelectedComponent', () => {
  let component: ChatMessagesNotSelectedComponent;
  let fixture: ComponentFixture<ChatMessagesNotSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatMessagesNotSelectedComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChatMessagesNotSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
