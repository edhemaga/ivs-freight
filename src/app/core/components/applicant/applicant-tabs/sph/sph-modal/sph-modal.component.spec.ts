import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SphModalComponent } from './sph-modal.component';

describe('SphModalComponent', () => {
  let component: SphModalComponent;
  let fixture: ComponentFixture<SphModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SphModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SphModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
