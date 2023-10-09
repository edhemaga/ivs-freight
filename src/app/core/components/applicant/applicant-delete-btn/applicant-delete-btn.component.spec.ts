import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantDeleteBtnComponent } from './applicant-delete-btn.component';

describe('ApplicantDeleteBtnComponent', () => {
  let component: ApplicantDeleteBtnComponent;
  let fixture: ComponentFixture<ApplicantDeleteBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantDeleteBtnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicantDeleteBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
