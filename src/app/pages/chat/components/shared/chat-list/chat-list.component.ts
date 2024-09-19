import { Component, Input, OnInit } from '@angular/core';

// Models
import { ChatNoData } from '@pages/chat/models';

@Component({
    selector: 'app-chat-list',
    templateUrl: './chat-list.component.html',
    styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
    @Input() public itemsCount!: number;
    @Input() public isSearchActive: boolean = false;
    @Input() public noDataConfig!: ChatNoData;

    constructor() {}

    ngOnInit(): void {}
}
