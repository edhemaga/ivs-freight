/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmModalComponent } from '@pages/pm-truck-trailer/pages/pm-modal/pm-modal.component';

describe('PmModalComponent', () => {
    let component: PmModalComponent;
    let fixture: ComponentFixture<PmModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PmModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PmModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
