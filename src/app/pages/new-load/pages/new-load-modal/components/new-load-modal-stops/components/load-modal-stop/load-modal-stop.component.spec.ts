import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadModalStopComponent } from './load-modal-stop.component';

describe('LoadModalStopComponent', () => {
  let component: LoadModalStopComponent;
  let fixture: ComponentFixture<LoadModalStopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadModalStopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadModalStopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
