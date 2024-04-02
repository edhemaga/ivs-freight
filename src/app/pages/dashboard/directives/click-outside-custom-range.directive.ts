import { DOCUMENT } from '@angular/common';
import {
    AfterViewInit,
    Directive,
    ElementRef,
    EventEmitter,
    Inject,
    OnDestroy,
    Output,
} from '@angular/core';

import { Subscription, filter, fromEvent } from 'rxjs';

// enums
import { DashboardStringEnum } from '../enums/dashboard-string.enum';

@Directive({
    selector: '[clickOutsideElement]',
    standalone: true,
})
export class ClickOutsideCustomRangeDirective
    implements AfterViewInit, OnDestroy
{
    @Output() clickOutsideEmitter = new EventEmitter<void>();

    private documentClickSubscription: Subscription | undefined;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private element: ElementRef
    ) {}

    ngAfterViewInit(): void {
        this.startDocumentClickSubscriptipon();
    }

    private startDocumentClickSubscriptipon(): void {
        this.documentClickSubscription = fromEvent(
            this.document,
            DashboardStringEnum.CLICK
        )
            .pipe(
                filter((event) => {
                    return !this.checkIfInsideClick(
                        event.target as HTMLElement
                    );
                })
            )
            .subscribe(() => {
                this.clickOutsideEmitter.emit();
            });
    }

    private checkIfInsideClick(elementToCheck: HTMLElement): boolean {
        return (
            elementToCheck.classList.contains(
                DashboardStringEnum.CLASS_DROPDOWN_OPTION
            ) ||
            elementToCheck === this.element.nativeElement ||
            this.element.nativeElement.contains(elementToCheck)
        );
    }

    ngOnDestroy(): void {
        this.documentClickSubscription?.unsubscribe();
    }
}
