import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadRequirementComponent } from '@pages/load/components/load-requirement/load-requirement.component';

describe('LoadRequirementComponent', () => {
  let component: LoadRequirementComponent;
  let fixture: ComponentFixture<LoadRequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadRequirementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
