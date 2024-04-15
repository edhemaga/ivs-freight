/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerModalComponent } from '@pages/owner/pages/owner-modal/owner-modal.component';

describe('OwnerModalComponent', () => {
    let component: OwnerModalComponent;
    let fixture: ComponentFixture<OwnerModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OwnerModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OwnerModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
