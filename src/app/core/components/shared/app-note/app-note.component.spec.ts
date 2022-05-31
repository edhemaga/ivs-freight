import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppNoteComponent } from './app-note.component';

describe('AppNoteComponent', () => {
  let component: AppNoteComponent;
  let fixture: ComponentFixture<AppNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
