import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaAppTooltipComponent } from '@shared/components/ta-app-tooltip/ta-app-tooltip.component';

describe('TaAppTooltipComponent', () => {
    let component: TaAppTooltipComponent;
    let fixture: ComponentFixture<TaAppTooltipComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaAppTooltipComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaAppTooltipComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
