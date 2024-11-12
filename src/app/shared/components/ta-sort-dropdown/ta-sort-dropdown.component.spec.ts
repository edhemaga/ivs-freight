import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaSortDropdownComponent } from './ta-sort-dropdown.component';

describe('TaSortDropdownComponent', () => {
  let component: TaSortDropdownComponent;
  let fixture: ComponentFixture<TaSortDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaSortDropdownComponent]
    });
    fixture = TestBed.createComponent(TaSortDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
