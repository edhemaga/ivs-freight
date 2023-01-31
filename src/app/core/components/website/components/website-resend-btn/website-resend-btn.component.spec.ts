import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteResendBtnComponent } from './website-resend-btn.component';

describe('WebsiteResendBtnComponent', () => {
  let component: WebsiteResendBtnComponent;
  let fixture: ComponentFixture<WebsiteResendBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebsiteResendBtnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsiteResendBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
