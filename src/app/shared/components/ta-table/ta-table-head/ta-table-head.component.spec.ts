import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';

describe('TaTableHeadComponent', () => {
    let component: TaTableHeadComponent;
    let fixture: ComponentFixture<TaTableHeadComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaTableHeadComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaTableHeadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
