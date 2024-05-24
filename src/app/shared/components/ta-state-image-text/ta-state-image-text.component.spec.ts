import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaStateImageTextComponent } from './ta-state-image-text.component';

describe('TaStateImageTextComponent', () => {
  let component: TaStateImageTextComponent;
  let fixture: ComponentFixture<TaStateImageTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TaStateImageTextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaStateImageTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
