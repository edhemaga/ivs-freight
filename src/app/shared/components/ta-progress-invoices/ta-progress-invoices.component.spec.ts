import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaProgressInvoicesComponent } from '@shared/components/ta-progress-invoices/ta-progress-invoices.component';

describe('TaProgressInvoicesComponent', () => {
    let component: TaProgressInvoicesComponent;
    let fixture: ComponentFixture<TaProgressInvoicesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaProgressInvoicesComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaProgressInvoicesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
