import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-driver-card',
  templateUrl: './driver-card.component.html',
  styleUrls: ['./driver-card.component.scss']
})
export class DriverCardComponent implements OnInit {
  @Input() viewData : any;

  constructor() { }

  ngOnInit(): void {
    console.log("DRIVER DATA");
    console.log(this.viewData);
  }

  changeChatBox(e, indx) {
    //this.driverBox[indx].checked = e.target.checked;
  }

}
