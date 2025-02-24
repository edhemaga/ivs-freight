import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';

describe('TaTableBodyComponent', () => {
    let component: TaTableBodyComponent<any>;
    let fixture: ComponentFixture<any>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaTableBodyComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaTableBodyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
