import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDetailsStopsComponent } from '@pages/new-load/pages/new-load-details/components/load-details-stops/load-details-stops.component';

describe('LoadDetailsStopsComponent', () => {
  let component: LoadDetailsStopsComponent;
  let fixture: ComponentFixture<LoadDetailsStopsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadDetailsStopsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadDetailsStopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
