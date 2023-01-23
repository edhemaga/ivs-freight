import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, startWith } from 'rxjs';

@Component({
    selector: 'app-under-construction',
    templateUrl: './under-construction.component.html',
    styleUrls: ['./under-construction.component.scss'],
})
export class UnderConstructionComponent implements OnInit {
    public title: string = '';
    constructor(private router: Router) {}

    ngOnInit(): void {
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                startWith(this.router)
            )
            .subscribe((url: any) => {
                let ruteName = url.url.split('/');
                if (ruteName[2]) {
                    this.title = ruteName[2];
                } else {
                    this.title = ruteName[1];
                }
                console.log(url.url);
            });
    }
}
