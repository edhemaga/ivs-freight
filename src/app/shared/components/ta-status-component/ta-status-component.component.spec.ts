import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaStatusComponentComponent } from './ta-status-component.component';

describe('TaStatusComponentComponent', () => {
  let component: TaStatusComponentComponent;
  let fixture: ComponentFixture<TaStatusComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaStatusComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaStatusComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
