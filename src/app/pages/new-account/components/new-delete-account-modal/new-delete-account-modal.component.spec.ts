import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDeleteAccountModalComponent } from './new-delete-account-modal.component';

describe('NewDeleteAccountModalComponent', () => {
  let component: NewDeleteAccountModalComponent;
  let fixture: ComponentFixture<NewDeleteAccountModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDeleteAccountModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewDeleteAccountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
