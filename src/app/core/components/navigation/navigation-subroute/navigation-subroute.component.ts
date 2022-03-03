import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-navigation-subroute',
  templateUrl: './navigation-subroute.component.html',
  styleUrls: ['./navigation-subroute.component.scss'],
})
export class NavigationSubrouteComponent {
  @Input() subroute: {
    name: string;
    routes: [];
  };

  @Input() mode: string = null;

  identifySubroute(index: number, item: string): string {
    return item;
  }
 
}
