import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatAttachmentUploadComponent } from './chat-attachment-upload.component';

describe('ChatAttachmentUploadComponent', () => {
  let component: ChatAttachmentUploadComponent;
  let fixture: ComponentFixture<ChatAttachmentUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatAttachmentUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatAttachmentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
