import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-driver-card',
  templateUrl: './driver-card.component.html',
  styleUrls: ['./driver-card.component.scss']
})
export class DriverCardComponent implements OnInit {

  driverBox: any[] = [
    {
      img: 'assets/svg/detail-cards/driver-img.svg',
      name: 'Alex Middleman',
      phone: '(482) 120-8701',
      email: 'dropshipper023@yahoo.com'
    },
    {
      img: 'assets/svg/detail-cards/driver-img.svg',
      name: 'Glen Cotton',
      phone: '(325) 540-1157',
      email: 'g.cotton@live.com'
    },
    {
      img: 'assets/svg/detail-cards/driver-img.svg',
      name: 'Angelo Trotter',
      phone: '(621) 321-2232',
      email: 'angelo.trotter@gmail.com',
    },
    {
      img: 'assets/svg/detail-cards/driver-img.svg',
      name: 'Donald Duckling',
      phone: '(325) 540-1157',
      email: 'donald@gmail.com'
    },
    {
      img: 'assets/svg/detail-cards/driver-img.svg',
      name: 'A. Djordjevic',
      phone: '(482) 120-8701',
      email: 'alex.djordjevic23-321@gmail.com'
    },
    {
      img: 'assets/svg/detail-cards/driver-img.svg',
      name: 'Eric Reid',
      phone: '(325) 643-6315',
      email: 'office@reid.com'
    },
    {
      img: 'assets/svg/detail-cards/driver-img.svg',
      name: 'Jovan Jovanovic',
      phone: '(325) 540-1157',
      email: 'dragon@mts.rs'
    },
    {
      img: 'assets/svg/detail-cards/driver-img.svg',
      name: 'Glen Cotton',
      phone: '(325) 540-1157',
      email: 'g.cotton@live.com'
    },
    {
      img: 'assets/svg/detail-cards/driver-img.svg',
      name: 'Alex Middleman',
      phone: '(482) 120-8701',
      email: 'dropshipper023@yahoo.com'
    },
    {
      img: 'assets/svg/detail-cards/driver-img.svg',
      name: 'A. Djordjevic',
      phone: '(482) 120-8701',
      email: 'alex.djordjevic23-321@gmail.com'
    },
    {
      img: 'assets/svg/detail-cards/driver-img.svg',
      name: 'Donald Duckling',
      phone: '(325) 540-1157',
      email: 'donald@gmail.com'
    },
    {
      img: 'assets/svg/detail-cards/driver-img.svg',
      name: 'Eric Reid',
      phone: '(325) 643-6315',
      email: 'office@reid.com'
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

  changeChatBox(e, indx) {
    console.log(e.target.checked);
    this.driverBox[indx].checked = e.target.checked;
  }

}
