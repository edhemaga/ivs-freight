import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationListComponent } from '@pages/chat/components/conversation/conversation-list/conversation-list.component';

describe('ConversationListComponent', () => {
    let component: ConversationListComponent;
    let fixture: ComponentFixture<ConversationListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ConversationListComponent],
        });
        fixture = TestBed.createComponent(ConversationListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
