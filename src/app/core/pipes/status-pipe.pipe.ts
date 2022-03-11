import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'statusPipe',
})
export class StatusPipePipe implements PipeTransform {
  dispatch: any = {
    offStatus: [0, 1000],
    activeStatus: [1000, 0, 7000, 8000],
    dispatchedStatus: [2000, 3000, 7000],
    checkedInStatus: [3000, 4000, 9000],
    subCheckedInStatus: [3100, 3200, 4070],
    subLoadedStatus: [3200, 4000, 3100, 4070],
    loadedStatus: [4000, 5000, 4070],
    deliveryStatus: [5000, 4070, 6000],
    subDeliveryStatus: [5100, 5200, 4070],
    offloaddedStatus: [5200, 6000, 5100, 4070],
    emptyStatus: [6000, 1000, 8000, 7000],
    loadRepairShopStatus: [4070, 4000],
    repairShopStatus: [7000, 0, 1000],
    deadHeadingStatus: [8000, 0, 1000, 7000]
  };

  load: any = {
    offStatus: [0, 1, 4],
    assignStatus: [1, 0, 2, 4],
    dispatchedStatus: [2, 3, 4],
    canceledStatus: [4, 5, 0],
    repairShopStatus: [5, 6, 0],
    emptyStatus: [4, 5, 0],
    loadedStatus: [3, 6],
    deliveredStatus: [6, 1000, 1100],
    activeStatus: [1000, 1200, 1300, 1400, 1500], // 1100 Needs to go
    tonuStatus: [5, 5010],
    // new one
    reviseStatus: [1100, 1112, 1113, 1114, 1115],
    paidStatus: [1200],
    shortPaidStatus: [1300, 1200, 1500],
    unpaidedStatus: [1400, 1200, 1300, 1500],
    claimStatuses: [1500, 1200, 1300, 1400],

    revisedPaid: [1112],
    reviseShortPaid: [1113, 1112, 1115],
    reviseUnpaid: [1114, 1112, 1113, 1115],
    reviseClaim: [1115, 1112, 1113, 1114],

    tonuInvoicedStatus: [5010, 5012, 5013, 5014, 5015],
    tonuPaidStatus: [5012],
    tonuShortPaid: [5013, 5012],
    tonuUnpaid: [5014, 5012, 5013, 5015],
    tonuClaim: [5015, 5012, 5013, 5014]
  };


  statusRelation: any = {
    0: 'offStatus',
    1: 'assignStatus',
    2: 'dispatchedStatus',
    3: 'loadedStatus',
    4: 'canceledStatus',
    5: 'tonuStatus',
    6: 'deliveredStatus',
    7: 'tonuStatus',
    1000: 'activeStatus',
    5010: 'tonuInvoicedStatus',
    1100: 'reviseStatus',
    1200: 'paidStatus',
    5012: 'tonuPaidStatus',
    1112: 'revisedPaid',
    1300: 'shortPaidStatus',
    5013: 'tonuShortPaid',
    1113: 'reviseShortPaid',
    1400: 'unpaidedStatus',
    5014: 'tonuUnpaid',
    1114: 'reviseUnpaid',
    1500: 'claimStatuses',
    1115: 'reviseClaim',
    2000: 'dispatchedStatus',
    3000: 'checkedInStatus',
    3100: 'subCheckedInStatus',
    3200: 'subLoadedStatus',
    4000: 'loadedStatus',
    4070: 'loadRepairShopStatus',
    5000: 'deliveryStatus',
    5005: 'tonuClaim',
    5100: 'subDeliveryStatus',
    5200: 'offloaddedStatus',
    6000: 'emptyStatus',
    7000: 'repairShopStatus',
    8000: 'deadHeadingStatus'
  };

  findSubStatuses(mainStatuses, pickupInfo, value) {
    const {id, statusId, statusCounter, pickupNumber, deliveryNumber, previousStatusId} = pickupInfo;
    value.map((item) => {
      if (item.load_count) {
        item.load_count = 1;
        if (statusCounter) {
          if (statusId == item.id || item.id > statusId) {
            item.load_count = statusCounter;
          } else if (statusId == 4070 || statusId == 7000) {
            item.load_count = statusCounter;
          } else {
            item.load_count = statusCounter + 1;
          }
        }
      }
      switch (item.id) {
        case 2000:
          mainStatuses.dispatchedStatus = [2000, 7000, 9000];
          if (pickupNumber > 1) {
            mainStatuses.dispatchedStatus.push(3100);
          } else {
            mainStatuses.dispatchedStatus.push(3000);
          }
          break;
        case 3100:
          mainStatuses.subCheckedInStatus = [3100, 4070];
          if (pickupNumber > 1 && statusCounter == pickupNumber) {
            mainStatuses.subCheckedInStatus.push(4000);
          } else {
            mainStatuses.subCheckedInStatus.push(3200);
          }
          break;
        case 3200:
          mainStatuses.subLoadedStatus = [3200, 4070];
          if (pickupNumber > 1 && statusCounter < pickupNumber) {
            mainStatuses.subLoadedStatus.push(3100);
          } else {
            mainStatuses.subLoadedStatus.push(4000);
          }
          break;
        case 4000:
          mainStatuses.loadedStatus = [4000, 4070];
          if (deliveryNumber > 1) {
            mainStatuses.loadedStatus.push(5100);
          } else {
            mainStatuses.loadedStatus.push(5000);
          }
          break;
        case 5100:
          mainStatuses.subDeliveryStatus = [5100, 4070];
          if (deliveryNumber > 1 && statusCounter == deliveryNumber) {
            mainStatuses.subDeliveryStatus.push(6000);
          } else {
            mainStatuses.subDeliveryStatus.push(5200);
          }
          break;
        case 5200:
          mainStatuses.offloaddedStatus = [5200, 4070];
          if (deliveryNumber > 1 && statusCounter < deliveryNumber) {
            mainStatuses.offloaddedStatus.push(5100);
          } else {
            mainStatuses.offloaddedStatus.push(6000);
          }
          break;
        case 4070:
          mainStatuses.loadRepairShopStatus = [4070, 0];
          if (previousStatusId) {
            mainStatuses.loadRepairShopStatus.push(previousStatusId);
          }
          break;
        case 7000:
          mainStatuses.repairShopStatus = [7000, 0];
          if (previousStatusId) {
            mainStatuses.repairShopStatus.push(previousStatusId);
          }
          break;
      }
      return item;
    });

    return {mainStatuses, value};
  }

  transform(value: any[], args: number, type: string, pickupInfo: any, return_finded?: boolean): unknown {
    const data = [];
    let mainStatuses = type == 'dispatch' ? this.dispatch : this.load;
    if (pickupInfo && type == 'dispatch') {
      const new_statuses = this.findSubStatuses(mainStatuses, pickupInfo, value);
      mainStatuses = new_statuses.mainStatuses;
      value = new_statuses.value;
    }

    value.forEach((element) => {
      if (this.statusRelation[args]) {
        if (mainStatuses[this.statusRelation[args]].includes(element.id)) {
          data.push(element);
        }
      }
    });

    if (return_finded) {
      const new_data = data.find(item => item.id == args);
      return new_data?.name;
    }

    data.sort(function (a, b) {
      return a.sort - b.sort;
    });
    return data;

  }
}
