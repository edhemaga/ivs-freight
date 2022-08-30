export function dropActionNameDriver(any: any, action: string) {
  let dropAction;
  if (any.type === 'edit') {
    switch (action) {
      case 'cdl': {
        dropAction = 'edit-licence';
        break;
      }
      case 'mvr': {
        dropAction = 'edit-mvr';
        break;
      }
      case 'medical': {
        dropAction = 'edit-medical';
        break;
      }
      case 'test': {
        dropAction = 'edit-drug';
        break;
      }
    }
  }
  if (any.type === 'delete-item') {
    switch (action) {
      case 'cdl': {
        dropAction = 'delete-cdl';
        break;
      }
      case 'mvr': {
        dropAction = 'delete-mvr';
        break;
      }
      case 'medical': {
        dropAction = 'delete-medical';
        break;
      }
      case 'test': {
        dropAction = 'delete-test';
        break;
      }
    }
  }
  return dropAction;
}
export function dropActionNameTrailerTruck(any: any, action: string) {
  let dropAction;
  if (any.type === 'edit') {
    switch (action) {
      case 'registration': {
        dropAction = 'edit-registration';
        break;
      }
      case 'inspection': {
        dropAction = 'edit-inspection';
        break;
      }
      case 'title': {
        dropAction = 'edit-title';
        break;
      }
    }
  }

  if (any.type === 'delete-item') {
    switch (action) {
      case 'registration': {
        dropAction = 'delete-registration';
        break;
      }
      case 'inspection': {
        dropAction = 'delete-inspection';
        break;
      }
      case 'title': {
        dropAction = 'delete-title';
        break;
      }
    }
  }
  return dropAction;
}
