import { HttpParams } from '@angular/common/http';
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
  process,
} from '@progress/kendo-data-query';

export function tableSearch(
  res: any,
  backFilterQuery: any,
  selectedTab: string
): any {
  // On Typing
  if (!res.doReset && !res.isChipDelete && !res.chipAdded) {
    backFilterQuery[res.chip] = res.search;
    backFilterQuery.active = selectedTab === 'active' ? 1 : 0;

    return {
      query: backFilterQuery,
      action: 'api',
    };
  }
  // On Reset If In Input Less Then 3 Char
  else if (res.doReset) {
    backFilterQuery[res.chip] = undefined;

    if (res.all) {
      return {
        action: 'store',
      };
    } else {
      return {
        query: backFilterQuery,
        action: 'api',
      };
    }
  }
  // On Chip Add
  else if (res.chipAdded) {
    if (
      !backFilterQuery[res.query] ||
      backFilterQuery[res.query] !== res.search
    ) {
      backFilterQuery[res.query] = res.search;

      return {
        query: backFilterQuery,
        action: 'api',
      };
    }
  }
  // On Delete Chip
  else if (res.isChipDelete) {
    // If Other Chips Exist
    if (res.chips.length || res.search) {
      res.querys.map((query: any, i: number) => {
        backFilterQuery[query] = res.chips[i]?.searchText
          ? res.chips[i].searchText
          : undefined;
      });

      // If In Input Char Exist, Add To Next Search Query
      if (res.search) {
        backFilterQuery[res.addToQuery] = res.search;
      }

      return {
        query: backFilterQuery,
        action: 'api',
      };
    }
    // If No Other Exist
    else {
      return {
        action: 'store',
      };
    }
  }
}

export function closeAnimationAction(isDelete?: boolean, viewData?: any): any {
  if (!isDelete) {
    viewData = viewData.map((data: any) => {
      if (data?.actionAnimation) {
        delete data.actionAnimation;
      }

      return data;
    });

    return viewData;
  } else {
    let newViewData = [];

    viewData.map((data: any) => {
      if (!data.hasOwnProperty('actionAnimation')) {
        newViewData.push(data);
      }
    });

    viewData = newViewData;

    return viewData;
  }
}

export function ssnFormat(ssn: any): string {
  let count = 0;
  let newSSN = '';

  for (let i = 0; i < ssn.length; i++) {
    count++;

    if (count === 4 || count === 6) {
      newSSN += '-';
    }

    newSSN += ssn[i];
  }

  return newSSN;
}

/* Funkcija za proveru kopiranja */
export function pasteCheck(
  pastedText: any,
  foramtType: RegExp,
  convertToUpperCase?: boolean,
  isBusiness?: boolean,
  isFirstWord?: boolean,
  limitOfCaracters?: number
) {
  let newText = '';
  let formatedText = '';
  let countOfCaracters = 0;

  if (limitOfCaracters !== undefined) {
    for (const e of pastedText) {
      if (!e.match(foramtType)) {
        formatedText += e;
        countOfCaracters++;
      }

      if (countOfCaracters === limitOfCaracters) {
        break;
      }
    }
  } else {
    for (const e of pastedText) {
      if (!e.match(foramtType)) {
        formatedText += e;
      }
    }
  }

  if (isBusiness && isFirstWord) {
    const notAlowed = '*=+#% ';
    let count = 0;
    let curent = 0;
    for (let i = 0; i < formatedText.length; i++) {
      for (let j = 0; j < notAlowed.length; j++) {
        if (notAlowed[j] === formatedText[i]) {
          count++;
          break;
        }
      }
      if (curent === count) {
        newText += formatedText[i];
      }

      curent = count;
    }

    formatedText = newText;
    newText = '';
  }

  /* Izbacivanje viska spaca iz texta */
  for (let i = 0; i < formatedText.length; i++) {
    if (formatedText[i] === ' ') {
      if (formatedText[i + 1] !== ' ') {
        newText += formatedText[i];
      }
    } else {
      newText += formatedText[i];
    }
  }

  if (convertToUpperCase) {
    return newText.toUpperCase();
  } else {
    return newText;
  }
}

export function emailCheck(event: any) {
  let k;
  k = event.charCode;
  return (
    (k > 64 && k < 91) ||
    (k > 96 && k < 123) ||
    (k >= 48 && k <= 57) ||
    k == 32 ||
    k == 64 ||
    k == 46 ||
    k == 45
  );
}

export function checkSelectedText(inputID: string, index?: number) {
  let ele;
  if (index !== undefined) {
    ele = document.getElementById(inputID + index) as HTMLInputElement;
  } else {
    ele = document.getElementById(inputID) as HTMLInputElement;
  }

  let text = ele.value;
  text = text.slice(0, ele.selectionStart) + text.slice(ele.selectionEnd);
  ele.value = text;
  return ele.value;
}

/* Doppler Radar */
/* export function imageMapType(rad: any) {
  return new google.maps.ImageMapType({
    getTileUrl(tile, zoom) {
      return (
        `http://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/${rad.nexrad}/` +
        zoom +
        '/' +
        tile.x +
        '/' +
        tile.y +
        '.png?' +
        new Date().getTime()
      );
    },
    tileSize: new google.maps.Size(256, 256),
    opacity: 0.0,
    name: 'NEXRAD',
  });
} */

/*User object maping*/

// TODO: dodati type za user
export function mapUserData(user: any): any {
  if (user.firstName && user.lastName) {
    user.firstName =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.firstName;
  }

  if (user.userType === 'master' || user.baseUserType === 'master') {
    user.userType = `Owner`;
  }

  if (
    user.userType === 'cmp_admin' ||
    user.userType === 'pwd_admin' ||
    user.userType === 'tmp_admin'
  ) {
    user.userType = user.userType ? `admin` : user.userType;
  }

  if (
    user.userType === 'cmp_dispatcher' ||
    user.userType === 'pwd_dispatcher' ||
    user.userType === 'tmp_dispatcher'
  ) {
    user.userType = user.userType ? `dispatcher` : user.userType;
  }

  if (user.userType) {
    user.userType = user.userType
      ? user.userType.charAt(0).toUpperCase() + user.userType.slice(1)
      : user.userType;
  }

  if (user.dateValue) {
    //user.dateValue = user.dateValue ? dateFormat(user.dateValue) : user.dateValue;
  }

  if (user.doc && user.doc.phone) {
    //user.doc.phone = user.doc.phone ? formatPhoneNumber(user.doc.phone) : user.doc.phone;
  }

  /* user.show = false; */

  return user;
}

/* Search Filter Methods */
export function onFilter(
  inputValue: string,
  filteredData: Array<any>[],
  data: any,
  fieldName: string
) {
  const availableFilters: (CompositeFilterDescriptor | FilterDescriptor)[] =
    checkDataForFiltering(inputValue, data, fieldName);

  filteredData = process(filteredData, {
    filter: {
      logic: 'or',
      filters: availableFilters,
    },
  }).data;

  return availableFilters;
}

function checkDataForFiltering(
  inputValue: string,
  data: any,
  fieldName: string
): (CompositeFilterDescriptor | FilterDescriptor)[] {
  const filterDescriptor = [];

  for (const d of data) {
    for (const [key, value] of Object.entries(d)) {
      if (key === fieldName) {
        filterDescriptor.push({
          field: value,
          operator: 'contains',
          value: inputValue,
        });
      }
    }
  }

  return filterDescriptor;
}

/* Animate From To Count */
let timerForAnimation: any;

export function animateDataCountFromTo(id, start, end, duration) {
  clearInterval(timerForAnimation);
  const obj = document.getElementById(id);
  if (start === end && obj?.innerHTML) {
    obj.innerHTML = start;
    return;
  }

  const range = end - start;
  let current = start;
  const increment = end > start ? 1 : -1;
  const stepTime = Math.abs(Math.floor(duration / range));

  if (obj?.innerHTML) {
    timerForAnimation = setInterval(function () {
      current += increment;
      obj.innerHTML = current;
      if (current == end) {
        clearInterval(timerForAnimation);
      }
    }, stepTime);
  }
}

/* GPS Legend Data */
export function getGPSLegendData() {
  return [
    {
      title: 'Moving vehicle',
      index: 0,
      type: [
        {
          icon: '../../assets/img/svgs/GPS/Moving Directions/N.svg',
          text: 'Assigned moving vehicle',
        },
        {
          icon: '../../assets/img/svgs/GPS/Unassign/N.svg',
          text: 'Unassigned moving vehicle',
        },
      ],
    },
    {
      title: 'Multiple vehicles',
      index: 1,
      type: [
        {
          icon: '../../assets/img/svgs/GPS/Legend/Moving 2+ vehicles.svg',
          text: 'Moving 2+ vehicles',
        },
        {
          icon: '../../assets/img/svgs/GPS/Legend/Short stop 2+ vehicles.svg',
          text: 'Short stop 2+ vehicles ',
        },
        {
          icon: '../../assets/img/svgs/GPS/Legend/New-Extended stop 2+ vehicles.svg',
          text: 'Extended stop 2+ vehicles',
        },
        {
          icon: '../../assets/img/svgs/GPS/Legend/Parked 2+ vehicles.svg',
          text: 'Parked 2+ vehicles',
        },
        {
          icon: '../../assets/img/svgs/GPS/Legend/Mix 2+ vehicles.svg',
          text: 'Mix 2+ vehicles',
        },
      ],
    },
    {
      title: 'Stopped vehicles',
      index: 2,
      type: [
        {
          icon: '../../assets/img/svgs/GPS/Legend/New-Short stop - From 0m to 30mNew.svg',
          text: 'Short stop - From 0m to 30m',
        },
        {
          icon: '../../assets/img/svgs/GPS/Legend/New-Extended stop - From 30m to 12h.svg',
          text: 'Extended stop - From 30m to 12h',
        },
        {
          icon: '../../assets/img/svgs/GPS/Legend/Parking- 12+ hours.svg',
          text: 'Parking- 12+ hours',
        },
      ],
    },
    {
      title: '',
      index: 3,
      type: [
        {
          icon: '../../assets/img/svgs/GPS/Status/ASSIGNED/Ignation-On/New-SHORT STOP IG ON.svg',
          text: 'Ignition on',
        },
        {
          icon: '../../assets/img/svgs/GPS/Status/ASSIGNED/Ignation-Off/New-SHORT STOP IG OFF.svg',
          text: 'Ignition off',
        },
        {
          icon: '../../assets/img/svgs/GPS/Status/UNASSIGNED/Ignation-On/New-SHORT STOP IG ON.svg',
          text: 'Unassigned Ignition on',
        },
        {
          icon: '../../assets/img/svgs/GPS/Status/UNASSIGNED/Ignation-Off/New-SHORT STOP IG OFF.svg',
          text: 'Unassigned Ignition off',
        },
        {
          icon: '../../assets/img/svgs/GPS/Status/ASSIGNED/Ignation-On/New-EXTENDED STOP IG-ON.svg',
          text: 'Ignition on',
        },
        {
          icon: '../../assets/img/svgs/GPS/Status/ASSIGNED/Ignation-Off/New-EXTENDET STOP IG-OFF.svg',
          text: 'Ignition off',
        },
        {
          icon: '../../assets/img/svgs/GPS/Status/UNASSIGNED/Ignation-On/New-EXTENDED STOP IG-ON.svg',
          text: 'Unassigned Ignition on',
        },
        {
          icon: '../../assets/img/svgs/GPS/Status/UNASSIGNED/Ignation-Off/New-EXTENDED STOP IG-OFF.svg',
          text: 'Unassigned Ignition off',
        },

        {
          icon: '../../assets/img/svgs/GPS/Status/ASSIGNED/Ignation-On/PARKING IG-ON.svg',
          text: 'Ignition on',
        },
        {
          icon: '../../assets/img/svgs/GPS/Status/ASSIGNED/Ignation-Off/PARKING IG-OFF.svg',
          text: 'Ignition off',
        },
        {
          icon: '../../assets/img/svgs/GPS/Status/UNASSIGNED/Ignation-On/PARKING IG-ON.svg',
          text: 'Unassigned Ignition on',
        },
        {
          icon: '../../assets/img/svgs/GPS/Status/UNASSIGNED/Ignation-Off/PARKING IG-OFF.svg',
          text: 'Unassigned Ignition off',
        },
      ],
    },
  ];
}

/* Get Route And Markers Data */
export function getRouteAndMarkerData(
  mapData: any,
  getMarkers: boolean,
  getRoute: boolean
) {
  let markers = [];
  let waypoints = [];
  const routes = [];
  if (mapData.length) {
    /* Get Markers Data */
    if (getMarkers) {
      for (const data of mapData) {
        markers.push({
          lat: data.latitude,
          lng: data.longitude,
          location: data.location,
        });
      }
    }

    /* Get Route Data */
    if (getRoute) {
      let countOfData = 0,
        origin = '',
        destination = '',
        originLatLong = {
          lat: 0,
          lng: 0,
        };
      for (let i = 0; i < mapData.length; i++) {
        countOfData++;

        /* Get Origin */
        if (countOfData === 1) {
          origin = mapData[i].location;
          originLatLong = {
            lat: mapData[i].latitude,
            lng: mapData[i].longitude,
          };
        } else if (
          countOfData > 1 &&
          countOfData < 6 &&
          i !== mapData.length - 1
        ) {
          /* Get Waypoints */
          waypoints.push({
            position: {
              lat: mapData[i].latitude,
              lng: mapData[i].longitude,
            },
            location: mapData[i].location,
          });
        } else if (countOfData === 6 && i !== mapData.length - 1) {
          /* Get Destination */
          destination = mapData[i].location;
          routes.push({
            origin: origin,
            originLatLong: originLatLong,
            destination: destination,
            destinationLatLong: {
              lat: mapData[i].latitude,
              lng: mapData[i].longitude,
            },
            waypoints: waypoints,
          });
          countOfData = 0;
          i -= 1;
          waypoints = [];
        } else if (i === mapData.length - 1) {
          /* No More Loactions */
          routes.push({
            origin: origin,
            originLatLong: originLatLong,
            destination: mapData[i].location,
            destinationLatLong: {
              lat: mapData[i].latitude,
              lng: mapData[i].longitude,
            },
            waypoints: waypoints,
          });
        }
      }
    }
  }

  return {
    markers: markers,
    route: routes,
  };
}

/* Get Flag From Miles Filter  */
export function getFlagOfFilterMiles(
  flag: boolean,
  dataToFilterForFlag: any,
  highlightingWords: any
) {
  /* Empty Miles */
  if (
    dataToFilterForFlag?.emptyMiles
      .trim()
      .toLowerCase()
      .includes(highlightingWords[0].text.toLowerCase().trim()) &&
    !flag
  ) {
    flag = true;
  }

  /* Gallons */
  if (
    dataToFilterForFlag?.gallons
      .trim()
      .toLowerCase()
      .includes(highlightingWords[0].text.toLowerCase().trim()) &&
    !flag
  ) {
    flag = true;
  }

  /* Loaded Miles */
  if (
    dataToFilterForFlag?.loadedMiles
      .trim()
      .toLowerCase()
      .includes(highlightingWords[0].text.toLowerCase().trim()) &&
    !flag
  ) {
    flag = true;
  }

  /* Loads */
  if (
    dataToFilterForFlag?.loads
      .trim()
      .toLowerCase()
      .includes(highlightingWords[0].text.toLowerCase().trim()) &&
    !flag
  ) {
    flag = true;
  }

  /* Miles */
  if (
    dataToFilterForFlag?.miles
      .trim()
      .toLowerCase()
      .includes(highlightingWords[0].text.toLowerCase().trim()) &&
    !flag
  ) {
    flag = true;
  }

  /* Miles Per Gallon */
  if (
    dataToFilterForFlag?.milesPerGallon
      .trim()
      .toLowerCase()
      .includes(highlightingWords[0].text.toLowerCase().trim()) &&
    !flag
  ) {
    flag = true;
  }

  /* Stops */
  if (
    dataToFilterForFlag?.stops
      .trim()
      .toLowerCase()
      .includes(highlightingWords[0].text.toLowerCase().trim()) &&
    !flag
  ) {
    flag = true;
  }

  /* Unit */
  if (
    dataToFilterForFlag?.unit
      .trim()
      .toLowerCase()
      .includes(highlightingWords[0].text.toLowerCase().trim()) &&
    !flag
  ) {
    flag = true;
  }

  return flag;
}

/* Get Data From Gps SignalR Response */
export function getDataFromGpsResponse(gpsRespons: any, i: number) {
  const marker = getGpsMarkerData(gpsRespons[i], gpsRespons[i].truckId).marker;
  const statusOfVehicle = getGpsMarkerData(
    gpsRespons[i],
    gpsRespons[i].truckId
  ).statusOfVehicle;
  const speed = getGpsMarkerData(gpsRespons[i], gpsRespons[i].truckId).speed;

  return {
    lat: gpsRespons[i].latitude,
    long: gpsRespons[i].longitude,
    speed,
    vehicleStatus: statusOfVehicle,
    statusTime: getTimeDifference(gpsRespons[i], true),
    statusDays: getTimeDifference(gpsRespons[i], false),
    course: gpsRespons[i].course,
    eventDateTime: gpsRespons[i].eventDateTime,
    hardwareID: gpsRespons[i].uniqueId,
    marker: marker ? marker : '',
    driverName:
      gpsRespons[i].driverFullName !== ' '
        ? gpsRespons[i].driverFullName
        : 'No Driver',
    distance: gpsRespons[i].distance,
    totalDistance: gpsRespons[i].totalDistance,
    altitude: gpsRespons[i].altitude,
    truckId: gpsRespons[i].truckId ? gpsRespons[i].truckId : undefined,
    truckNumber: gpsRespons[i].truckNumber
      ? gpsRespons[i].truckNumber
      : 'No Data',
    truckLoadNumber: gpsRespons[i].truckloadId
      ? gpsRespons[i].truckloadId
      : 'No Data',
    trailerNumber: gpsRespons[i].trailerNumber
      ? gpsRespons[i].trailerNumber
      : 'No Data',
    fullAddress: gpsRespons[i].address ? gpsRespons[i].address : '',
    fullLocation: gpsRespons[i].location ? gpsRespons[i].location : '',
    dispatchBoardStatus: gpsRespons[i].dispatchBoardStatus
      ? gpsRespons[i].dispatchBoardStatus
      : '',
    ignition: gpsRespons[i].ignition,
    animation: '',
    motion: gpsRespons[i].motion,
    shortStop: gpsRespons[i].shortStop,
    parking: gpsRespons[i].parking,
    extendedStop: gpsRespons[i].extendedStop,
  };
}

/* Get GPS Marker Data */
export function getGpsMarkerData(gpsData: any, isAssigned) {
  let marker: string;
  let statusOfVehicle: string;
  let speed: string;
  let driverNameColor: string;
  let clusterMurker: string;

  if (gpsData.motion) {
    /*  FOR MOVING */
    marker = !isAssigned
      ? `../../assets/img/svgs/GPS/Unassign/${gpsData.course}.svg`
      : `../../assets/img/svgs/GPS/Moving Directions/${gpsData.course}.svg`;
    statusOfVehicle = 'Moving';
    speed = Math.round(gpsData.speed) + ' Mph';
    driverNameColor = '#5673AA';
    clusterMurker = marker;
  } else {
    const millSec = getTimeDifference(gpsData, true);

    if (Math.round(millSec / (1000 * 60 * 60)) >= 12) {
      /* FOR PARKING */
      if (gpsData.ignition) {
        marker = !isAssigned
          ? `../../assets/img/svgs/GPS/Status/UNASSIGNED/Ignation-On/PARKING IG-ON.svg`
          : `../../assets/img/svgs/GPS/Status/ASSIGNED/Ignation-On/PARKING IG-ON.svg`;
      } else {
        marker = !isAssigned
          ? `../../assets/img/svgs/GPS/Status/UNASSIGNED/Ignation-Off/PARKING IG-OFF.svg`
          : `../../assets/img/svgs/GPS/Status/ASSIGNED/Ignation-Off/PARKING IG-OFF.svg`;
      }
      statusOfVehicle = 'Parking';
      speed = '/';
      driverNameColor = '#6C6C6C';
      clusterMurker =
        '../../assets/img/svgs/GPS/Cluster Dropdown/cluster-parking.svg';
    } else if (
      Math.round(millSec / (1000 * 60)) >= 30 &&
      Math.round(millSec / (1000 * 60 * 60)) < 12
    ) {
      /* FOR EXTENDED STOP */
      if (gpsData.ignition) {
        marker = !isAssigned
          ? `../../assets/img/svgs/GPS/Status/UNASSIGNED/Ignation-On/New-EXTENDED STOP IG-ON.svg`
          : `../../assets/img/svgs/GPS/Status/ASSIGNED/Ignation-On/New-EXTENDED STOP IG-ON.svg`;
      } else {
        marker = !isAssigned
          ? `../../assets/img/svgs/GPS/Status/UNASSIGNED/Ignation-Off/New-EXTENDED STOP IG-OFF.svg`
          : `../../assets/img/svgs/GPS/Status/ASSIGNED/Ignation-Off/New-EXTENDET STOP IG-OFF.svg`;
      }
      statusOfVehicle = 'Extended Stop';
      speed = '/';
      driverNameColor = '#F96C62';
      clusterMurker =
        '../../assets/img/svgs/GPS/Cluster Dropdown/cluster-cluster-extended stop.svg';
    } else {
      /* FOR SHORT STOP */
      if (gpsData.ignition) {
        marker = !isAssigned
          ? `../../assets/img/svgs/GPS/Status/UNASSIGNED/Ignation-On/New-SHORT STOP IG ON.svg`
          : `../../assets/img/svgs/GPS/Status/ASSIGNED/Ignation-On/New-SHORT STOP IG ON.svg`;
      } else {
        marker = !isAssigned
          ? `../../assets/img/svgs/GPS/Status/UNASSIGNED/Ignation-Off/New-SHORT STOP IG OFF.svg`
          : `../../assets/img/svgs/GPS/Status/ASSIGNED/Ignation-Off/New-SHORT STOP IG OFF.svg`;
      }
      statusOfVehicle = 'Short Stop';
      speed = '/';
      driverNameColor = '#FFA24E';
      clusterMurker =
        '../../assets/img/svgs/GPS/Cluster Dropdown/cluster-short-stop.svg';
    }
  }

  return {
    marker,
    statusOfVehicle,
    speed,
    driverNameColor,
    clusterMurker,
  };
}

/* Get Time Difference  */
export function getTimeDifference(gpsResponse: any, isTime: boolean) {
  const date1 = new Date(gpsResponse.eventDateTime);
  const date2 = new Date();
  const time = date2.getTime() - date1.getTime();
  const days = Math.round(time / (1000 * 3600 * 24));
  if (isTime) {
    return time;
  } else {
    return days;
  }
}

/* Pagination And Filter Paramas */
export function checkParamas(queryParams: any) {
  if (queryParams) {
    let params = new HttpParams()
      .set('Search', queryParams.filterData.search)
      .set('Search1', queryParams.filterData.search1)
      .set('Search2', queryParams.filterData.search2)
      .set('Sort', queryParams.filterData.sort)
      .set('StartDate', queryParams.filterData.startDate)
      .set('EndDate', queryParams.filterData.endDate)
      .set('TruckNumber', queryParams.filterData.truckNumber);

    if (
      !queryParams.filterData.search ||
      queryParams.filterData.search === ''
    ) {
      params = params.delete('Search', undefined);
    }
    if (
      !queryParams.filterData.search1 ||
      queryParams.filterData.search1 === ''
    ) {
      params = params.delete('Search1', undefined);
    }
    if (
      !queryParams.filterData.search2 ||
      queryParams.filterData.search2 === ''
    ) {
      params = params.delete('Search2', undefined);
    }
    if (!queryParams.filterData.sort || queryParams.filterData.sort === '') {
      params = params.delete('Sort', undefined);
    }
    if (
      !queryParams.filterData.startDate ||
      queryParams.filterData.startDate === ''
    ) {
      params = params.delete('StartDate', undefined);
    }
    if (
      !queryParams.filterData.endDate ||
      queryParams.filterData.endDate === ''
    ) {
      params = params.delete('EndDate', undefined);
    }
    if (
      !queryParams.filterData.truckNumber ||
      queryParams.filterData.truckNumber === ''
    ) {
      params = params.delete('TruckNumber', undefined);
    }

    return params;
  } else {
    return new HttpParams();
  }
}

export function getPmDefaultFilterList() {
  return [
    {
      active: false,
      icon: '../../../assets/img/svgs/table/PM-Filter/Engine oil and filter changes.svg',
      name: 'Engine oil and filter changes',
      customIconText: '',
    },
    {
      active: false,
      icon: '../../../assets/img/svgs/table/PM-Filter/Engine air filter.svg',
      name: 'Engine air filter',
      customIconText: '',
    },
    {
      active: false,
      icon: '../../../assets/img/svgs/table/PM-Filter/Belts.svg',
      name: 'Belts',
      customIconText: '',
    },
    {
      active: false,
      icon: '../../../assets/img/svgs/table/PM-Filter/Transmission fluid.svg',
      name: 'Transmission fluid',
      customIconText: '',
    },
    {
      active: false,
      icon: '../../../assets/img/svgs/table/PM-Filter/Engine tune-up.svg',
      name: 'Engine tune-up',
      customIconText: '',
    },
    {
      active: false,
      icon: '../../../assets/img/svgs/table/PM-Filter/Alignment.svg',
      name: 'Alignment',
      customIconText: '',
    },
  ];
}

export function getPmDefaultList() {
  return [
    {
      id: 0,
      miles: '15,000 Miles',
      milesCount: 15,
      pms: [
        {
          icon: '../../../assets/img/svgs/table/PM-Filter/Engine oil and filter changes.svg',
          iconName: 'Engine oil and filter changes',
          customIconText: '',
          edit: false,
        },
      ],
    },
    {
      id: 1,
      miles: '75,000 Miles',
      milesCount: 75,
      pms: [
        {
          icon: '../../../assets/img/svgs/table/PM-Filter/Engine air filter.svg',
          iconName: 'Engine air filter',
          customIconText: '',
          edit: false,
        },
        {
          icon: '../../../assets/img/svgs/table/PM-Filter/Belts.svg',
          iconName: 'Belts',
          customIconText: '',
          edit: false,
        },
      ],
    },
    {
      id: 2,
      miles: '150,000 Miles',
      milesCount: 150,
      pms: [
        {
          icon: '../../../assets/img/svgs/table/PM-Filter/Transmission fluid.svg',
          iconName: 'Transmission fluid',
          customIconText: '',
          edit: false,
        },
        {
          icon: '../../../assets/img/svgs/table/PM-Filter/Engine tune-up.svg',
          iconName: 'Engine tune-up',
          customIconText: '',
          edit: false,
        },
        {
          icon: '../../../assets/img/svgs/table/PM-Filter/Alignment.svg',
          iconName: 'Alignment',
          customIconText: '',
          edit: false,
        },
      ],
    },
  ];
}

export function getDefaultMoveToList() {
  return [
    { count: 15, id: 0 },
    { count: 75, id: 1 },
    { count: 150, id: 2 },
  ];
}

export function getRepairTypesData() {
  const shopTypeFilter = JSON.parse(
    localStorage.getItem('repair_shops_shopTypeFilter')
  );

  let types = [
    { option: 'Truck', active: false },
    { option: 'Trailer', active: false },
    { option: 'Mobile', active: false },
    { option: 'Shop', active: false },
    { option: 'Towing', active: false },
    { option: 'Parts', active: false },
    { option: 'Tire', active: false },
    { option: 'Dealer', active: false },
  ];

  if (shopTypeFilter?.length) {
    for (const type of types) {
      for (const shopType of shopTypeFilter) {
        if (type.option === shopType.option) {
          type.active = shopType.active;
        }
      }
    }
  }

  return types;
}

// Function for checking number of spaces

export function checkNumberOfSpaces(k: number, numOfSpaces: number) {
  if (numOfSpaces < 2) {
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k <= 121) ||
      (k >= 48 && k <= 57) ||
      k == 8 ||
      k == 32 ||
      (k >= 42 && k <= 46) ||
      k === 64 ||
      k === 61 ||
      (k >= 35 && k <= 38)
    );
  } else {
    event.preventDefault();
  }
}

export const applyDrag = (arr, dragResult) => {
	const { removedIndex, addedIndex, payload } = dragResult;
	if (removedIndex === null && addedIndex === null) return arr;

	const result = [...arr];
	let itemToAdd = payload;

	if (removedIndex !== null) {
		itemToAdd = result.splice(removedIndex, 1)[0];
	}

	if (addedIndex !== null) {
		result.splice(addedIndex, 0, itemToAdd);
	}

	return result;
};
