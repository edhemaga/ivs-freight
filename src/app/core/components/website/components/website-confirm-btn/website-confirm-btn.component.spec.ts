import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteConfirmBtnComponent } from './website-confirm-btn.component';

describe('WebsiteConfirmBtnComponent', () => {
  let component: WebsiteConfirmBtnComponent;
  let fixture: ComponentFixture<WebsiteConfirmBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebsiteConfirmBtnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsiteConfirmBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
