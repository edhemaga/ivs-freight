import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAccountComponent } from '@pages/new-account/new-account.component';

describe('NewAccountComponent', () => {
    let component: NewAccountComponent;
    let fixture: ComponentFixture<NewAccountComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NewAccountComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(NewAccountComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
