import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchTableComponent } from './dispatch-table.component';

describe('DispatchTableComponent', () => {
  let component: DispatchTableComponent;
  let fixture: ComponentFixture<DispatchTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
