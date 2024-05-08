import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHeadBorderComponent } from '@shared/components/ta-table/ta-table-head/components/table-head-border/table-head-border.component';

describe('TableHeadBorderComponent', () => {
    let component: TableHeadBorderComponent;
    let fixture: ComponentFixture<TableHeadBorderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TableHeadBorderComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TableHeadBorderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
