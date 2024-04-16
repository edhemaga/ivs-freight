import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaSpecialFilterComponent } from '@shared/components/ta-special-filter/ta-special-filter.component';

describe('TaSpecialFilterComponent', () => {
    let component: TaSpecialFilterComponent;
    let fixture: ComponentFixture<TaSpecialFilterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaSpecialFilterComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TaSpecialFilterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
