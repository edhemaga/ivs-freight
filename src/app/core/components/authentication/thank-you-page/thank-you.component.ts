import {Component, HostListener, OnInit} from '@angular/core';
import moment from "moment";

@Component({
  selector: 'app-thank-you-component',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent implements OnInit {
  email = null;
  copyrightYear!: number;

  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorage() {
    localStorage.removeItem('thankYouEmail');
  }

  ngOnInit() {
    // @ts-ignore
    this.email = localStorage.getItem('thankYouEmail');
    this.copyrightYear = moment().year();
  }
}
