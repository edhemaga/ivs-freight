/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserModalComponent } from '@pages/user/pages/user-modal/user-modal.component';

describe('UserModalComponent', () => {
    let component: UserModalComponent;
    let fixture: ComponentFixture<UserModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UserModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
