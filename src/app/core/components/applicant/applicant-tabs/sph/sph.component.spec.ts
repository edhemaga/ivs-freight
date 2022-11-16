import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SphComponent } from './sph.component';

describe('SphComponent', () => {
  let component: SphComponent;
  let fixture: ComponentFixture<SphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
