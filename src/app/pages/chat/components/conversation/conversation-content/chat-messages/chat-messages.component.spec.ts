import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessagesComponent } from '@pages/chat/components/conversation/conversation-content/chat-messages/chat-messages.component';

describe('ChatMessagesComponent', () => {
    let component: ChatMessagesComponent;
    let fixture: ComponentFixture<ChatMessagesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChatMessagesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ChatMessagesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
