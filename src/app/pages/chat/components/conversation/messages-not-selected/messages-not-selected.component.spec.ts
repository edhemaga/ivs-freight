import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesNotSelectedComponent } from '@pages/chat/components/conversation/messages-not-selected/messages-not-selected.component';

describe('MessagesNotSelectedComponent', () => {
  let component: MessagesNotSelectedComponent;
  let fixture: ComponentFixture<MessagesNotSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessagesNotSelectedComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MessagesNotSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
