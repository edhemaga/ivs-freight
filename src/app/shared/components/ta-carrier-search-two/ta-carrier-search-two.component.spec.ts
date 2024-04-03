import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaCarrierSearchTwoComponent } from './ta-carrier-search-two.component';

describe('TaCarrierSearchTwoComponent', () => {
    let component: TaCarrierSearchTwoComponent;
    let fixture: ComponentFixture<TaCarrierSearchTwoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaCarrierSearchTwoComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TaCarrierSearchTwoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
