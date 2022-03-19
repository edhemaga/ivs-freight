import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LogoChangeComponent} from './logo-change.component';

describe('LogoChangeComponent', () => {
  let component: LogoChangeComponent;
  let fixture: ComponentFixture<LogoChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LogoChangeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
