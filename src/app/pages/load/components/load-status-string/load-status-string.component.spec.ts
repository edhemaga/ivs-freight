import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadStatusStringComponent } from './load-status-string.component';

describe('LoadStatusStringComponent', () => {
  let component: LoadStatusStringComponent;
  let fixture: ComponentFixture<LoadStatusStringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadStatusStringComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadStatusStringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
