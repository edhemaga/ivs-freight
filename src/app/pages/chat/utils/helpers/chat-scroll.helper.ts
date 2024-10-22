export const scrollToBottom = (nativeElement: HTMLElement): void => {
    if (!nativeElement) return;

    nativeElement.scrollTop = nativeElement?.scrollHeight;
};
