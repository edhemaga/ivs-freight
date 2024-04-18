import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerCardModalComponent } from '@pages/owner/pages/owner-card-modal/owner-card-modal.component';

describe('OwnerCardModalComponent', () => {
  let component: OwnerCardModalComponent;
  let fixture: ComponentFixture<OwnerCardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnerCardModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerCardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
