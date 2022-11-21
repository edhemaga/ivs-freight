import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantNextBackBtnComponent } from './applicant-next-back-btn.component';

describe('ApplicantNextBackBtnComponent', () => {
  let component: ApplicantNextBackBtnComponent;
  let fixture: ComponentFixture<ApplicantNextBackBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicantNextBackBtnComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantNextBackBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
