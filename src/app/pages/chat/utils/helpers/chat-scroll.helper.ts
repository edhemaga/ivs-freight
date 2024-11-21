export const scrollToBottom = (nativeElement: HTMLElement): void => {
    if (!nativeElement) return;

    nativeElement.scrollTop = nativeElement?.scrollHeight;
};

export const scrollToTop = (nativeElement: HTMLElement): void => {
    if (!nativeElement) return;

    nativeElement.scrollTop = 0;
};
