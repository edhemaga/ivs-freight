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
      color: '#B7B7B766'
    },
    {
      start: 0,
      end: 9,
      color: '#AEC2EB'
    },
    {
      start: 10,
      end: 14,
      color: '#7691C4'
    },
    {
      start: 15,
      end: 19,
      color: '#375A9F'
    },
    {
      start: 20,
      end: 100,
      color: '#1D3667'
    }
  ];
  usaStates: any =
    {
      AL: {
        color: '#B7B7B766',
        country: 'Alabama'
      },
      AK: {
        color: '#B7B7B766',
        country: 'Alaska'
      },
      AS: {
        color: '#B7B7B766',
        country: 'American Samoa'
      },
      AZ: {
        color: '#B7B7B766',
        country: 'Arizona'
      },
      AR: {
        color: '#B7B7B766',
        country: 'Arkansas'
      },
      CA: {
        color: '#B7B7B766',
        country: 'California'
      },
      CO: {
        color: '#B7B7B766',
        country: 'Colorado'
      },
      CT: {
        color: '#B7B7B766',
        country: 'Connecticut'
      },
      DE: {
        color: '#B7B7B766',
        country: 'Delaware'
      },
      DC: {
        color: '#B7B7B766',
        country: 'District Of Columbia'
      },
      FM: {
        color: '#B7B7B766',
        country: 'Federated States Of Micronesia'
      },
      FL: {
        color: '#B7B7B766',
        country: 'Florida'
      },
      GA: {
        color: '#B7B7B766',
        country: 'Georgia'
      },
      GU: {
        color: '#B7B7B766',
        country: 'Guam'
      },
      HI: {
        color: '#B7B7B766',
        country: 'Hawaii'
      },
      ID: {
        color: '#B7B7B766',
        country: 'Idaho'
      },
      IL: {
        color: '#B7B7B766',
        country: 'Illinois'
      },
      IN: {
        color: '#B7B7B766',
        country: 'Indiana'
      },
      IA: {
        color: '#B7B7B766',
        country: 'Iowa'
      },
      KS: {
        color: '#B7B7B766',
        country: 'Kansas'
      },
      KY: {
        color: '#B7B7B766',
        country: 'Kentucky'
      },
      LA: {
        color: '#B7B7B766',
        country: 'Louisiana'
      },
      ME: {
        color: '#B7B7B766',
        country: 'Maine'
      },
      MH: {
        color: '#B7B7B766',
        country: 'Marshall Islands'
      },
      MD: {
        color: '#B7B7B766',
        country: 'Maryland'
      },
      MA: {
        color: '#B7B7B766',
        country: 'Massachusetts'
      },
      MI: {
        color: '#B7B7B766',
        country: 'Michigan'
      },
      MN: {
        color: '#B7B7B766',
        country: 'Minnesota'
      },
      MS: {
        color: '#B7B7B766',
        country: 'Mississippi'
      },
      MO: {
        color: '#B7B7B766',
        country: 'Missouri'
      },
      MT: {
        color: '#B7B7B766',
        country: 'Montana'
      },
      NE: {
        color: '#B7B7B766',
        country: 'Nebraska'
      },
      NV: {
        color: '#B7B7B766',
        country: 'Nevada'
      },
      NH: {
        color: '#B7B7B766',
        country: 'New Hampshire'
      },
      NJ: {
        color: '#B7B7B766',
        country: 'New Jersey'
      },
      NM: {
        color: '#B7B7B766',
        country: 'New Mexico'
      },
      NY: {
        color: '#B7B7B766',
        country: 'New York'
      },
      NC: {
        color: '#B7B7B766',
        country: 'North Carolina'
      },
      ND: {
        color: '#B7B7B766',
        country: 'North Dakota'
      },
      MP: {
        color: '#B7B7B766',
        country: 'Northern Mariana Islands'
      },
      OH: {
        color: '#B7B7B766',
        country: 'Ohio'
      },
      OK: {
        color: '#B7B7B766',
        country: 'Oklahoma'
      },
      OR: {
        color: '#B7B7B766',
        country: 'Oregon'
      },
      PW: {
        color: '#B7B7B766',
        country: 'Palau'
      },
      PA: {
        color: '#B7B7B766',
        country: 'Pennsylvania'
      },
      PR: {
        color: '#B7B7B766',
        country: 'Puerto Rico'
      },
      RI: {
        color: '#B7B7B766',
        country: 'Rhode Island'
      },
      SC: {
        color: '#B7B7B766',
        country: 'South Carolina'
      },
      SD: {
        color: '#B7B7B766',
        country: 'South Dakota'
      },
      TN: {
        color: '#B7B7B766',
        country: 'Tennessee'
      },
      TX: {
        color: '#B7B7B766',
        country: 'Texas'
      },
      UT: {
        color: '#B7B7B766',
        country: 'Utah'
      },
      VT: {
        color: '#B7B7B766',
        country: 'Vermont'
      },
      VI: {
        color: '#B7B7B766',
        country: 'Virgin Islands'
      },
      VA: {
        color: '#B7B7B766',
        country: 'Virginia'
      },
      WA: {
        color: '#B7B7B766',
        country: 'Washington'
      },
      WV: {
        color: '#B7B7B766',
        country: 'West Virginia'
      },
      WI: {
        color: '#B7B7B766',
        country: 'Wisconsin'
      },
      WY: {
        color: '#B7B7B766',
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
