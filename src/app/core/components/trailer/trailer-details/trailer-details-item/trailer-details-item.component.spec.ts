import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerDetailsItemComponent } from './trailer-details-item.component';

describe('TrailerDetailsItemComponent', () => {
  let component: TrailerDetailsItemComponent;
  let fixture: ComponentFixture<TrailerDetailsItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrailerDetailsItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailerDetailsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
