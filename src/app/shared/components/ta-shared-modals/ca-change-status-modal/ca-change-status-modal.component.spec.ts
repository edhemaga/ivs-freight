import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaChangeStatusModalComponent } from './ca-change-status-modal.component';

describe('CaChangeStatusModalComponent', () => {
  let component: CaChangeStatusModalComponent;
  let fixture: ComponentFixture<CaChangeStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaChangeStatusModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaChangeStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
