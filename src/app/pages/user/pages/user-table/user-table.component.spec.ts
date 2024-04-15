import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTableComponent } from '@pages/user/pages/user-table/user-table.component';

describe('UserTableComponent', () => {
    let component: UserTableComponent;
    let fixture: ComponentFixture<UserTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserTableComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UserTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
