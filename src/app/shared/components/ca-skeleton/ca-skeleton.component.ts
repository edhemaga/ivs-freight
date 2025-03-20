import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';

@Component({
    selector: 'app-ca-skeleton',
    templateUrl: './ca-skeleton.component.html',
    styleUrl: './ca-skeleton.component.scss',
    standalone: true,
    imports: [CommonModule],
})
export class CaSkeletonComponent<T> {
    @Input() width!: number;
    @Input() height!: number;
    @Input() isLoading: boolean = false;
    @Input() isCircle: boolean = false;
    @Input() contentTemplate!: TemplateRef<T>;
}
