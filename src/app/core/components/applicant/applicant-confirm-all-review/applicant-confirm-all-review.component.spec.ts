import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantConfirmAllReviewComponent } from './applicant-confirm-all-review.component';

describe('ApplicantConfirmAllReviewComponent', () => {
  let component: ApplicantConfirmAllReviewComponent;
  let fixture: ComponentFixture<ApplicantConfirmAllReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantConfirmAllReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantConfirmAllReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
