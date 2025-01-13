export class AccountHelper {
    static generateUrlLink(url: string): string {
        const linkUrl = `https://${url.replace(/^https?:\/\//, '')}`;

        return linkUrl;
    }
}
