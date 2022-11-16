import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputAddressDropdownComponent } from './input-address-dropdown.component';

describe('InputAddressDropdownComponent', () => {
  let component: InputAddressDropdownComponent;
  let fixture: ComponentFixture<InputAddressDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputAddressDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputAddressDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
