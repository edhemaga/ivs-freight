import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHeadActionsComponent } from '@shared/components/ta-table/ta-table-head/components/table-head-actions/table-head-actions.component';

describe('TableHeadActionsComponent', () => {
    let component: TableHeadActionsComponent;
    let fixture: ComponentFixture<TableHeadActionsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TableHeadActionsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TableHeadActionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
