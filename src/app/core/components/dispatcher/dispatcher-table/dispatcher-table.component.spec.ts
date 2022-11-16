import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatcherTableComponent } from './dispatcher-table.component';

describe('DispatcherTableComponent', () => {
  let component: DispatcherTableComponent;
  let fixture: ComponentFixture<DispatcherTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DispatcherTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatcherTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
