import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DispatcherGpsTableComponent} from './dispatcher-gps-table.component';

describe('DispatcherGpsTableComponent', () => {
  let component: DispatcherGpsTableComponent;
  let fixture: ComponentFixture<DispatcherGpsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DispatcherGpsTableComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatcherGpsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
