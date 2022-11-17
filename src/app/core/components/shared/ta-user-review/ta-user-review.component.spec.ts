/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaUserReviewComponent } from './ta-user-review.component';

describe('TaUserReviewComponent', () => {
  let component: TaUserReviewComponent;
  let fixture: ComponentFixture<TaUserReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaUserReviewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaUserReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
