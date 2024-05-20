import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaModalTableContactComponent } from '@shared/components/ta-modal-table/components/ta-modal-table-contact/ta-modal-table-contact.component';

describe('TaModalTableContactComponent', () => {
    let component: TaModalTableContactComponent;
    let fixture: ComponentFixture<TaModalTableContactComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaModalTableContactComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TaModalTableContactComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
