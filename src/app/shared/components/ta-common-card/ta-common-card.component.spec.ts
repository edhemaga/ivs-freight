import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaCommonCardComponent } from './ta-common-card.component';

describe('TaReCardComponent', () => {
    let component: TaCommonCardComponent;
    let fixture: ComponentFixture<TaCommonCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaCommonCardComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaCommonCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
