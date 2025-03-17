import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDetailsAdditionalComponent } from '@pages/new-load/pages/new-load-details/components/load-details-additional/load-details-additional.component';

describe('LoadDetailsAdditionalComponent', () => {
  let component: LoadDetailsAdditionalComponent;
  let fixture: ComponentFixture<LoadDetailsAdditionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadDetailsAdditionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadDetailsAdditionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
