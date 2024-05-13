import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaModalTableComponent } from '@shared/components/ta-modal-table/ta-modal-table.component';

describe('TaModalTableComponent', () => {
    let component: TaModalTableComponent;
    let fixture: ComponentFixture<TaModalTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TaModalTableComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TaModalTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
