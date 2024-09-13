import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessageAttachmentPreviewComponent } from './chat-message-attachment-preview.component';

describe('ChatMessageAttachmentPreviewComponent', () => {
  let component: ChatMessageAttachmentPreviewComponent;
  let fixture: ComponentFixture<ChatMessageAttachmentPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatMessageAttachmentPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatMessageAttachmentPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
