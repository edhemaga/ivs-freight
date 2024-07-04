import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaInputDropdownStatusComponent } from '@shared/components/ta-input-dropdown-status/ta-input-dropdown-status.component';

describe('TaInputDropdownStatusComponent', () => {
  let component: TaInputDropdownStatusComponent;
  let fixture: ComponentFixture<TaInputDropdownStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaInputDropdownStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaInputDropdownStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
