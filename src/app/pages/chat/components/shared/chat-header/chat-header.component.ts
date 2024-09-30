import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { takeUntil, debounceTime } from 'rxjs';

// Enums
import { ChatSearchPlaceHolders } from '@pages/chat/enums';

// Animations
import { chatFadeVerticallyAnimation } from '@shared/animations/chat-fade-vertically.animation';

// Config
import { ChatInput } from '@pages/chat/utils/configs';

// Helpers
import { UnsubscribeHelper } from '@pages/chat/utils/helpers';

@Component({
    selector: 'app-chat-header',
    templateUrl: './chat-header.component.html',
    styleUrls: ['./chat-header.component.scss'],
    animations: [chatFadeVerticallyAnimation],
})
export class ChatHeaderComponent extends UnsubscribeHelper implements OnInit {
    @Input() public isBottomBorderDisplayed: boolean = true;

    // Search
    @Input() public isSearchActive: boolean = false;

    @Output() searchEvent: EventEmitter<string> = new EventEmitter();

    public searchForm!: UntypedFormGroup;

    // Config
    public chatInput = ChatInput;

    // Enums
    public chatSearchPlaceHolders = ChatSearchPlaceHolders;

    constructor(private formBuilder: UntypedFormBuilder) {
        super();
    }

    ngOnInit(): void {
        this.creteForm();
        this.listenForSearchTermChange();
    }

    private creteForm(): void {
        this.searchForm = this.formBuilder.group({
            searchTerm: [null],
        });
    }

    private listenForSearchTermChange(): void {
        if (!this.searchForm) return;
        this.searchForm.valueChanges
            .pipe(takeUntil(this.destroy$), debounceTime(350))
            .subscribe((arg) => {
                this.searchEvent.emit(arg.searchTerm);
            });
    }

    public toggleSearch(isActive?: boolean): void {
        this.isSearchActive = isActive ?? !this.isSearchActive;
    }
}
