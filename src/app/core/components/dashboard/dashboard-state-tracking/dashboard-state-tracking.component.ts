import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard-state-tracking',
  templateUrl: './dashboard-state-tracking.component.html',
  styleUrls: ['./dashboard-state-tracking.component.scss']
})
export class DashboardStateTrackingComponent implements OnInit {

  timeList: any = [
    {
      id: 1,
      name: 'All time',
      period: 'all'
    },
    {
      id: 2,
      name: 'Today',
      period: 'today'
    },
    {
      id: 3,
      name: 'WTD',
      period: 'wtd'
    },
    {
      id: 4,
      name: 'MTD',
      period: 'mtd'
    },
    {
      id: 5,
      name: 'YTD',
      period: 'ytd'
    },
    // {
    //   id: 6,
    //   name: "Custom"
    // }
  ];
  pickDeliveryData: any = [
    {
      id: 'pickup',
      name: 'Pickup',
      checked: false,
      inputName: "pickup"
    },
    {
      id: 'delivery',
      name: 'Delivery',
      checked: true,
      inputName: "pickup"
    },
  ];
  selectedPeriod: any = 'all';
  selectedType = 'revenue';
  countRavenueData: any = [
    {
      id: 'count',
      name: 'Count',
      checked: false,
      inputName: "revanue"
    },
    {
      id: 'ravenue',
      name: 'Revenue',
      checked: true,
      inputName: "revanue"
    },
  ];
  leadboardData: any = [
    {
      id: 30,
      name: 'IL',
      loads: 1,
      revenue: 336.749,
      miles: 894,
      percentOfLoads: 100.0,
      percentOfRevenue: 28.26,
      percentOfMiles: 100.0
    },
    {
      id: 40,
      name: 'IA',
      loads: 1,
      revenue: 295.071,
      miles: 894,
      percentOfLoads: 100.0,
      percentOfRevenue: 15.06,
      percentOfMiles: 100.0
    },
    {
      id: 41,
      name: 'AK',
      loads: 1,
      revenue: 295.071,
      miles: 894,
      percentOfLoads: 100.0,
      percentOfRevenue: 9,
      percentOfMiles: 100.0
    }
  ];
  percentageColors: any = [
    {
      start: 0,
      end: 0,
      color: '#E4E4E4'
    },
    {
      start: 0,
      end: 9,
      color: '#d4dff4'
    },
    {
      start: 10,
      end: 14,
      color: '#97a8dc'
    },
    {
      start: 15,
      end: 19,
      color: '#6d82c7'
    },
    {
      start: 20,
      end: 100,
      color: '#536bc2'
    }
  ];
  usaStates: any =
    {
      AL: {
        color: '#E4E4E4',
        country: 'Alabama'
      },
      AK: {
        color: '#E4E4E4',
        country: 'Alaska'
      },
      AS: {
        color: '#E4E4E4',
        country: 'American Samoa'
      },
      AZ: {
        color: '#E4E4E4',
        country: 'Arizona'
      },
      AR: {
        color: '#E4E4E4',
        country: 'Arkansas'
      },
      CA: {
        color: '#E4E4E4',
        country: 'California'
      },
      CO: {
        color: '#E4E4E4',
        country: 'Colorado'
      },
      CT: {
        color: '#E4E4E4',
        country: 'Connecticut'
      },
      DE: {
        color: '#E4E4E4',
        country: 'Delaware'
      },
      DC: {
        color: '#E4E4E4',
        country: 'District Of Columbia'
      },
      FM: {
        color: '#E4E4E4',
        country: 'Federated States Of Micronesia'
      },
      FL: {
        color: '#E4E4E4',
        country: 'Florida'
      },
      GA: {
        color: '#E4E4E4',
        country: 'Georgia'
      },
      GU: {
        color: '#E4E4E4',
        country: 'Guam'
      },
      HI: {
        color: '#E4E4E4',
        country: 'Hawaii'
      },
      ID: {
        color: '#E4E4E4',
        country: 'Idaho'
      },
      IL: {
        color: '#E4E4E4',
        country: 'Illinois'
      },
      IN: {
        color: '#E4E4E4',
        country: 'Indiana'
      },
      IA: {
        color: '#E4E4E4',
        country: 'Iowa'
      },
      KS: {
        color: '#E4E4E4',
        country: 'Kansas'
      },
      KY: {
        color: '#E4E4E4',
        country: 'Kentucky'
      },
      LA: {
        color: '#E4E4E4',
        country: 'Louisiana'
      },
      ME: {
        color: '#E4E4E4',
        country: 'Maine'
      },
      MH: {
        color: '#E4E4E4',
        country: 'Marshall Islands'
      },
      MD: {
        color: '#E4E4E4',
        country: 'Maryland'
      },
      MA: {
        color: '#E4E4E4',
        country: 'Massachusetts'
      },
      MI: {
        color: '#E4E4E4',
        country: 'Michigan'
      },
      MN: {
        color: '#E4E4E4',
        country: 'Minnesota'
      },
      MS: {
        color: '#E4E4E4',
        country: 'Mississippi'
      },
      MO: {
        color: '#E4E4E4',
        country: 'Missouri'
      },
      MT: {
        color: '#E4E4E4',
        country: 'Montana'
      },
      NE: {
        color: '#E4E4E4',
        country: 'Nebraska'
      },
      NV: {
        color: '#E4E4E4',
        country: 'Nevada'
      },
      NH: {
        color: '#E4E4E4',
        country: 'New Hampshire'
      },
      NJ: {
        color: '#E4E4E4',
        country: 'New Jersey'
      },
      NM: {
        color: '#E4E4E4',
        country: 'New Mexico'
      },
      NY: {
        color: '#E4E4E4',
        country: 'New York'
      },
      NC: {
        color: '#E4E4E4',
        country: 'North Carolina'
      },
      ND: {
        color: '#E4E4E4',
        country: 'North Dakota'
      },
      MP: {
        color: '#E4E4E4',
        country: 'Northern Mariana Islands'
      },
      OH: {
        color: '#E4E4E4',
        country: 'Ohio'
      },
      OK: {
        color: '#E4E4E4',
        country: 'Oklahoma'
      },
      OR: {
        color: '#E4E4E4',
        country: 'Oregon'
      },
      PW: {
        color: '#E4E4E4',
        country: 'Palau'
      },
      PA: {
        color: '#E4E4E4',
        country: 'Pennsylvania'
      },
      PR: {
        color: '#E4E4E4',
        country: 'Puerto Rico'
      },
      RI: {
        color: '#E4E4E4',
        country: 'Rhode Island'
      },
      SC: {
        color: '#E4E4E4',
        country: 'South Carolina'
      },
      SD: {
        color: '#E4E4E4',
        country: 'South Dakota'
      },
      TN: {
        color: '#E4E4E4',
        country: 'Tennessee'
      },
      TX: {
        color: '#E4E4E4',
        country: 'Texas'
      },
      UT: {
        color: '#E4E4E4',
        country: 'Utah'
      },
      VT: {
        color: '#E4E4E4',
        country: 'Vermont'
      },
      VI: {
        color: '#E4E4E4',
        country: 'Virgin Islands'
      },
      VA: {
        color: '#E4E4E4',
        country: 'Virginia'
      },
      WA: {
        color: '#E4E4E4',
        country: 'Washington'
      },
      WV: {
        color: '#E4E4E4',
        country: 'West Virginia'
      },
      WI: {
        color: '#E4E4E4',
        country: 'Wisconsin'
      },
      WY: {
        color: '#E4E4E4',
        country: 'Wyoming'
      },
    };

  constructor() {
  }

  ngOnInit(): void {
    this.calcuateData();
  }

  calcuateData(): void {
    this.leadboardData.map(item => {
      const clr = this.percentageColors.find(it => {
        return item.percentOfRevenue >= it.start && item.percentOfRevenue <= it.end;
      })?.color;

      this.usaStates[item.name].color = clr;
    });
  }

  switchType(e): void {

  }

  // {
  //   "id":40,
  //   "numOfShippers":null,
  //   "name":"IA",
  //   "location":"Buffalo, NY",
  //   "loads":1,
  //   "revenue":295.071,
  //   "miles":894,
  //   "percentOfLoads":100.0,
  //   "percentOfRevenue":21.06,
  //   "percentOfMiles":100.0
  // }

}
