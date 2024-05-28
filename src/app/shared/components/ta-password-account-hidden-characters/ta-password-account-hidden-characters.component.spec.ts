import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaPasswordAccountHiddenCharactersComponent } from './ta-password-account-hidden-characters.component';

describe('TaPasswordAccountHiddenCharactersComponent', () => {
  let component: TaPasswordAccountHiddenCharactersComponent;
  let fixture: ComponentFixture<TaPasswordAccountHiddenCharactersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaPasswordAccountHiddenCharactersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaPasswordAccountHiddenCharactersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
