import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHeadRowsComponent } from '@shared/components/ta-table/ta-table-head/components/table-head-rows/table-head-rows.component';

describe('TableHeadRowsComponent', () => {
    let component: TableHeadRowsComponent;
    let fixture: ComponentFixture<TableHeadRowsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TableHeadRowsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TableHeadRowsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
