import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilesMapComponent } from './miles-map.component';

describe('MilesMapComponent', () => {
  let component: MilesMapComponent;
  let fixture: ComponentFixture<MilesMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MilesMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MilesMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
