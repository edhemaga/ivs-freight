import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchTableNoteComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-note/dispatch-table-note.component';

describe('DispatchTableNoteComponent', () => {
    let component: DispatchTableNoteComponent;
    let fixture: ComponentFixture<DispatchTableNoteComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DispatchTableNoteComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DispatchTableNoteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
