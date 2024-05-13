import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

describe('TaAppTooltipV2Component', () => {
    let component: TaAppTooltipV2Component;
    let fixture: ComponentFixture<TaAppTooltipV2Component>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaAppTooltipV2Component],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaAppTooltipV2Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
