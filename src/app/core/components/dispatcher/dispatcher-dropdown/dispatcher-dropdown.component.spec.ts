import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatcherDropdownComponent } from './dispatcher-dropdown.component';

describe('DispatcherDropdownComponent', () => {
  let component: DispatcherDropdownComponent;
  let fixture: ComponentFixture<DispatcherDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DispatcherDropdownComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatcherDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
