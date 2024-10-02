import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaModalTableDepartmentComponent } from '@shared/components/ta-modal-table/components/ta-modal-table-department/ta-modal-table-department.component';

describe('TaModalTableDepartmentComponent', () => {
    let component: TaModalTableDepartmentComponent;
    let fixture: ComponentFixture<TaModalTableDepartmentComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TaModalTableDepartmentComponent],
        });
        fixture = TestBed.createComponent(TaModalTableDepartmentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
