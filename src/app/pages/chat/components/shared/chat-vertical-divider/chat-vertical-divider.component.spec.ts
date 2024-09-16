import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatVerticalDividerComponent } from '@pages/chat/components/shared/chat-vertical-divider/chat-vertical-divider.component';

describe('ChatVerticalDividerComponent', () => {
  let component: ChatVerticalDividerComponent;
  let fixture: ComponentFixture<ChatVerticalDividerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatVerticalDividerComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChatVerticalDividerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
