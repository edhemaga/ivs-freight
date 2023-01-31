import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCompanyWelcomeComponent } from './register-company-welcome.component';

describe('RegisterCompanyWelcomeComponent', () => {
  let component: RegisterCompanyWelcomeComponent;
  let fixture: ComponentFixture<RegisterCompanyWelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterCompanyWelcomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterCompanyWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
