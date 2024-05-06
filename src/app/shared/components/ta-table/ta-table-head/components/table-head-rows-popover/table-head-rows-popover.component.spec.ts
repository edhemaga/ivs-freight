import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHeadRowsPopoverComponent } from '@shared/components/ta-table/ta-table-head/components/table-head-rows-popover/table-head-rows-popover.component';

describe('TableHeadRowsPopoverComponent', () => {
    let component: TableHeadRowsPopoverComponent;
    let fixture: ComponentFixture<TableHeadRowsPopoverComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TableHeadRowsPopoverComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TableHeadRowsPopoverComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
