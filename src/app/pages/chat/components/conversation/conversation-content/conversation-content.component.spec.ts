import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationContentComponent } from '@pages/chat/components/conversation/conversation-content/conversation-content.component';

describe('ConversationContentComponent', () => {
  let component: ConversationContentComponent;
  let fixture: ComponentFixture<ConversationContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConversationContentComponent]
    });
    fixture = TestBed.createComponent(ConversationContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
