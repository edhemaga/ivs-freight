import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastLocationComponentComponent } from './last-location-component.component';

describe('LastLocationComponentComponent', () => {
  let component: LastLocationComponentComponent;
  let fixture: ComponentFixture<LastLocationComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LastLocationComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastLocationComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
