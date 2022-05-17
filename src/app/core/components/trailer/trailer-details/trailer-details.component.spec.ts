import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerDetailsComponent } from './trailer-details.component';

describe('TrailerDetailsComponent', () => {
  let component: TrailerDetailsComponent;
  let fixture: ComponentFixture<TrailerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
