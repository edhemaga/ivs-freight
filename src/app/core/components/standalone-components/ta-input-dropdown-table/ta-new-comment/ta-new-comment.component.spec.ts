import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaNewCommentComponent } from './ta-new-comment.component';

describe('TaNewCommentComponent', () => {
  let component: TaNewCommentComponent;
  let fixture: ComponentFixture<TaNewCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TaNewCommentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaNewCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
