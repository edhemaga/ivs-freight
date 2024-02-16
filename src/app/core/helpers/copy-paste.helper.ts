export class PasteHelper {
    static onPaste(event: ClipboardEvent): void {
        event.preventDefault();

        const pastedData = event.clipboardData.getData('text/plain');

        document.execCommand('insertText', false, pastedData);
    }
}
