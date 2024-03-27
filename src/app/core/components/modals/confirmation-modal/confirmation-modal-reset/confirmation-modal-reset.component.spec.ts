import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationModalResetComponent } from './confirmation-modal-reset.component';

describe('ConfirmationModalResetComponent', () => {
  let component: ConfirmationModalResetComponent;
  let fixture: ComponentFixture<ConfirmationModalResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ConfirmationModalResetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationModalResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
