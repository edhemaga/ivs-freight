import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateManagerService } from '@shared/services/template-manager.service';

@Component({
    selector: 'app-reusable-templates',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './reusable-templates.component.html',
    styleUrls: ['./reusable-templates.component.scss'],
})
export class ReusableTemplatesComponent {
    @ViewChild('templateOne', { static: true }) templateOne: ElementRef;
    @ViewChild('templateTwo', { static: true }) templateTwo: ElementRef;
}
