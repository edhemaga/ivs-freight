import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerCardModalComponent } from '@pages/trailer/pages/trailer-card-modal/trailer-card-modal.component';

describe('TrailerCardModalComponent', () => {
  let component: TrailerCardModalComponent;
  let fixture: ComponentFixture<TrailerCardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailerCardModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrailerCardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
