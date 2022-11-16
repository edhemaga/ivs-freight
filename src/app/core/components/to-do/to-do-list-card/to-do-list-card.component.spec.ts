import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoListCardComponent } from './to-do-list-card.component';

describe('ToDoListCardComponent', () => {
  let component: ToDoListCardComponent;
  let fixture: ComponentFixture<ToDoListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToDoListCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToDoListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
