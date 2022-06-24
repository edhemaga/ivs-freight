import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-performance',
  templateUrl: './dashboard-performance.component.html',
  styleUrls: ['./dashboard-performance.component.scss']
})
export class DashboardPerformanceComponent implements OnInit {

  dashboardSwitchTabs: any[] = [];

  backgroundCards: any[] = ['73D0F1', 'FFD54F', 'BDE08E', 'F69FF3', 'A1887F'];
  selectedColors: any = {
    income: '8A9AEF',
    miles: 'FDB46B',
    roadside: 'F27B8E',
    driver: '6DC089',
    accident: 'A574C3'
  }


  constructor() { }

  ngOnInit(): void {
    
    this.dashboardSwitchTabs = [
      {
        id: 1,
        name: 'Today'
      },
      {
        id: 2,
        name: 'WTD'
      },
      {
        id: 1,
        name: 'MTD'
      },
      {
        id: 1,
        name: 'YTD'
      },
      {
        id: 1,
        name: 'All Time'
      },
      {
        id: 1,
        name: 'Custom'
      }
    ]
  }

  changeDashboardTabs(ev){

  }

  setColor(type: string){
    // Provera da li se u objektu nalazi vec ovaj tip sa vrednoscu boje
    if( type in this.selectedColors ){
      // Iz glavnog niza boja vratiti zauzetu boju na pocetak niza
      this.backgroundCards.unshift(this.selectedColors[type]);
      // Obrisati iz objekta tu vrednost
      delete this.selectedColors[type];
    }else{
      // Proveriti da li se u nizu nalazi bar jedna boja da bi mogli da dajemo novoj kocki sledecu boju
      if( this.backgroundCards.length > 0 ){
        // Uzeti prvu vrednost iz niza i ujedno iz glavnog niza boja sklonuti prvu boju
        const firstInArray = this.backgroundCards.shift();
        // Dodati novu vrednost u objekat sa bojom koju smo pokupili iz niza
        this.selectedColors[type] = firstInArray;
      }
    }
    
  }

}
