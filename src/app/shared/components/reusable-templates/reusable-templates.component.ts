import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

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
