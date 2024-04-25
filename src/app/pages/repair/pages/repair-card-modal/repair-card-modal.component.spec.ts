import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairCardModalComponent } from '@pages/repair/pages/repair-card-modal/repair-card-modal.component';

describe('RepairCardModalComponent', () => {
  let component: RepairCardModalComponent;
  let fixture: ComponentFixture<RepairCardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepairCardModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepairCardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
