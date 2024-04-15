import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaSearchV2Component } from '@shared/components/ta-search-v2/ta-search-v2.component';

describe('TaSearchV2Component', () => {
    let component: TaSearchV2Component;
    let fixture: ComponentFixture<TaSearchV2Component>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaSearchV2Component],
        }).compileComponents();

        fixture = TestBed.createComponent(TaSearchV2Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
