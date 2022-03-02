import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation-subroute',
  templateUrl: './navigation-subroute.component.html',
  styleUrls: ['./navigation-subroute.component.scss'],
})
export class NavigationSubrouteComponent implements OnInit {
  @Input() subroute: {
    name: string;
    routes: [];
  };

  @Input() mode: string = null;

  constructor() {}

  ngOnInit(): void {}
}
