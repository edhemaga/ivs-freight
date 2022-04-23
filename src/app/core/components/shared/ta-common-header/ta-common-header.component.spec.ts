import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaCommonHeaderComponent } from './ta-common-header.component';

describe('TaCommonHeaderComponent', () => {
  let component: TaCommonHeaderComponent;
  let fixture: ComponentFixture<TaCommonHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaCommonHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaCommonHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
