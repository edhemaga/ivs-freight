import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SvgMorphComponent} from './svg-morph.component';

describe('SvgMorphComponent', () => {
  let component: SvgMorphComponent;
  let fixture: ComponentFixture<SvgMorphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SvgMorphComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgMorphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
