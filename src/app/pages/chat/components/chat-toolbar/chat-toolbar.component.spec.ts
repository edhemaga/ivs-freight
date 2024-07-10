import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatToolbarComponent } from '@pages/chat/components/chat-toolbar/chat-toolbar.component';

describe('ChatToolbarComponent', () => {
  let component: ChatToolbarComponent;
  let fixture: ComponentFixture<ChatToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatToolbarComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChatToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
