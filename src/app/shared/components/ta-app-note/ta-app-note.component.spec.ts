import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaAppNoteComponent } from './ta-app-note.component';

describe('AppNoteComponent', () => {
    let component: TaAppNoteComponent;
    let fixture: ComponentFixture<TaAppNoteComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaAppNoteComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaAppNoteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
