export class AccountHelper {
    static generateLinkUrl(url: string): string {
        const linkUrl = `https://${url.replace(/^https?:\/\//, '')}`;

        return linkUrl;
    }
}
