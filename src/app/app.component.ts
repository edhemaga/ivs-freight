import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter, map, mergeMap} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    public titleService: Title,
    private activatedRoute: ActivatedRoute,
  ) {
  }


  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route: any) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route: any) => route.data)
      )
      .subscribe((event: any) => {
        this.titleService.setTitle("TruckAssist" + " | " + event.title);
        //const user = JSON.parse(localStorage.getItem('currentUser'));
        // TODO check also if user is on trial from User response (future).
        //this.trialVisible = (!(this.router.url.includes('applicant') || user == undefined || false));
      });
  }


}
