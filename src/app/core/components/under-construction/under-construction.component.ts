import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, startWith, Subscription } from 'rxjs';

@Component({
    selector: 'app-under-construction',
    templateUrl: './under-construction.component.html',
    styleUrls: ['./under-construction.component.scss'],
})
export class UnderConstructionComponent implements OnInit, OnDestroy {
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
