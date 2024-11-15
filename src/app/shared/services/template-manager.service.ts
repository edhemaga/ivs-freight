import { ElementRef, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root', // Makes this service available application-wide
})
export class TemplateManagerService {
    private templates: { [key: string]: ElementRef } = {};

    setTemplate(key: string, template: ElementRef): void {
        this.templates[key] = template;
    }

    getTemplate(key: string): ElementRef | null {
        return this.templates[key] || null;
    }
}
