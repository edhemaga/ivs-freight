import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchTableLastLocationComponentComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-last-location-component/dispatch-table-last-location-component.component';

describe('DispatchTableLastLocationComponentComponent', () => {
    let component: DispatchTableLastLocationComponentComponent;
    let fixture: ComponentFixture<DispatchTableLastLocationComponentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DispatchTableLastLocationComponentComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(
            DispatchTableLastLocationComponentComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
