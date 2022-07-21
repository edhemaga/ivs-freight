import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MvrAuthorizationComponent } from './mvr-authorization.component';

describe('MvrAuthorizationComponent', () => {
  let component: MvrAuthorizationComponent;
  let fixture: ComponentFixture<MvrAuthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MvrAuthorizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MvrAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
