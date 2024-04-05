import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaTableBodyComponent } from './ta-table-body.component';

describe('TaTableBodyComponent', () => {
    let component: TaTableBodyComponent;
    let fixture: ComponentFixture<TaTableBodyComponent>;

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
