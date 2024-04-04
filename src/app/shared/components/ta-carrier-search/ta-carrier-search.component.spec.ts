import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaCarrierSearchComponent } from './ta-carrier-search.component';

describe('TaCarrierSearchComponent', () => {
    let component: TaCarrierSearchComponent;
    let fixture: ComponentFixture<TaCarrierSearchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TaCarrierSearchComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TaCarrierSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
