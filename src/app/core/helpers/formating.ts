export function formatPhoneNumber(value: any): string {
  if (value.toString().includes('-')) {
    return value;
  }
  const cleaned = ('' + value).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return null;
}

export function formatSSNfield(value: string): string {
  if (value.toString().includes('-')) {
    return value;
  }
  let newValue = '';
  for (let i = 0; i < value.length; i++) {
    if (value[i] !== undefined) {
      if (i === 3 || i === 5) {
        newValue += '-' + value[i];
      } else {
        newValue += value[i];
      }
    }
  }
  return newValue;
}

export function numberWithCommas(x: any, formatedValue: boolean): string {
  return formatedValue
    ? Number(x.replace(',', ''))
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// export function millage(value: any): string {
//   let newValue = '';
//   let count: number = 0;
//   for (let i = 0; i < value.length; i++) {
//     count++;
//   }

//   if (count > 3 && count <= 6) {
//     for (let i = 0; i < value.length; i++) {
//       if (value[i] !== undefined) {
//         if (i === value.length - 3) {
//           newValue += ',' + value[i];
//         } else {
//           newValue += value[i];
//         }
//       }
//     }

//     return newValue;
//   } else if (count >= 6) {
//     for (let i = 0; i < value.length; i++) {
//       if (value[i] !== undefined) {
//         if (i === value.length - 3 || i === value.length - 6) {
//           newValue += ',' + value[i];
//         } else {
//           newValue += value[i];
//         }
//       }
//     }

//     return newValue;
//   } else {
//     return value;
//   }
// }

export function dateFormat(value: any): string {
  let newValue = '';

  /* Day */
  for (let i = 0; i < value.length; i++) {
    if (value[i] !== undefined) {
      if (i >= 5 && i <= 7) {
        if (value[i] == '-') {
          newValue += '/';
        } else {
          newValue += value[i];
        }
      }
    }
  }

  /* Month */
  for (let i = 0; i < value.length; i++) {
    if (value[i] !== undefined) {
      if (i > 7 && i <= 10) {
        if (value[i] == 'T') {
          newValue += '/';
        } else {
          newValue += value[i];
        }
      }
    }
  }

  /* Year */
  for (let i = 0; i < value.length; i++) {
    if (value[i] !== undefined) {
      if (i >= 2 && i <= 3) {
        newValue += value[i];
      }
    }
  }

  return newValue;
}

export function timeFormat(value: any): string {
  let hours = value.getHours();
  let minutes = value.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  let strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

export function dollarFormat(value: any, removeDot?: boolean): string | number {
  // let newValue = '';
  // let valueAfterDot = '';
  // let afterDot = '';
  // let isDot = false;
  // let countAfterDot = 0;
  // let dollarFormat = '$';

  // if (removeDot) {
  //   for (let v of value.toString()) {
  //     if (v !== '.' && !isDot) {
  //       newValue += v;
  //     }else{
  //       afterDot +=  v;
  //       countAfterDot++;
  //       isDot = true;
  //     }

  //     if(countAfterDot === 3){
  //       break;
  //     }
  //   }

  //   valueAfterDot = newValue;
  //   newValue = '';
  // }

  // if(removeDot){
  //   newValue = millage(valueAfterDot);
  // }else{
  //   newValue = millage(value.toString());
  // }

  // dollarFormat += newValue;
  // dollarFormat += afterDot;

  return '$' + Number(value).toFixed(2).toString().replace('.00', '');
}

export function proprietorTaxNumberFormat(value: any): string {
  let newValue = '';

  for (let i = 0; i < value.length; i++) {
    if (i === 3 || i === 5) {
      newValue += '-' + value[i];
    } else {
      newValue += value[i];
    }
  }

  return newValue;
}

export function companyTaxNumberFormat(value: any): string {
  let newValue = '';

  for (let i = 0; i < value.length; i++) {
    if (i === 2) {
      newValue += '-' + value[i];
    } else {
      newValue += value[i];
    }
  }

  return newValue;
}

export function formatAddress(value: any): string {
  let newValue = '';
  let count = 0;
  for (const character of value) {
    if (character === ',') {
      count++;
    }

    if (count < 2) {
      newValue += character;
    } else {
      break;
    }
  }

  return newValue;
}
