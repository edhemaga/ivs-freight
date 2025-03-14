import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDetailsGeneralComponent } from '@pages/new-load/pages/new-load-details/components/load-details-general/load-details-general.component';

describe('LoadDetailsGeneralComponent', () => {
  let component: LoadDetailsGeneralComponent;
  let fixture: ComponentFixture<LoadDetailsGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadDetailsGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadDetailsGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
