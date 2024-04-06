import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { filter, startWith, Subscription } from 'rxjs';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
    selector: 'app-ta-under-construction',
    templateUrl: './ta-under-construction.component.html',
    styleUrls: ['./ta-under-construction.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, AngularSvgIconModule],
})
export class TaUnderConstructionComponent implements OnInit, OnDestroy {
    public title: string = '';
    subscription: Subscription;

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.subscription = this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                startWith(this.router)
            )
            .subscribe((url: any) => {
                let ruteName = url.url.split('/');
                if (ruteName[2]) {
                    this.title = ruteName[2];
                } else {
                    ruteName[1] == 'file-manager'
                        ? (this.title = 'file manager')
                        : (this.title = ruteName[1]);
                }
            });
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
