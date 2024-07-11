import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatNoDataComponent } from '@pages/chat/components/chat-no-data/chat-no-data.component';

describe('ChatNoDataComponent', () => {
  let component: ChatNoDataComponent;
  let fixture: ComponentFixture<ChatNoDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatNoDataComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChatNoDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
