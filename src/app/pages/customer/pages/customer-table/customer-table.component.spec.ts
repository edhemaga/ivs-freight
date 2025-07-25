import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTableComponent } from '@pages/customer/pages/customer-table/customer-table.component';

describe('CustomerTableComponent', () => {
    let component: CustomerTableComponent;
    let fixture: ComponentFixture<CustomerTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CustomerTableComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomerTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
