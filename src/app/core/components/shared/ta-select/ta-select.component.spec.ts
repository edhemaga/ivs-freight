import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaSelectComponent} from './ta-select.component';

describe('TaSelectComponent', () => {
  let component: TaSelectComponent;
  let fixture: ComponentFixture<TaSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaSelectComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
