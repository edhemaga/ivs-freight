export const checkForLink = (string: string): boolean => {
    const urlPattern = new RegExp(
        '^(https?:\\/\\/)?' + // Protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // Domain
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // Port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // Query string
            '(\\#[-a-z\\d_]*)?$',
        'i'
    ); // Fragment locator
    return !!urlPattern.test(string);
};
