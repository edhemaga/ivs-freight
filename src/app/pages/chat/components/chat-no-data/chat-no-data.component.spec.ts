import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatNoDataComponent } from './chat-no-data.component';

describe('ChatNoDataComponent', () => {
  let component: ChatNoDataComponent;
  let fixture: ComponentFixture<ChatNoDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatNoDataComponent ]
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
