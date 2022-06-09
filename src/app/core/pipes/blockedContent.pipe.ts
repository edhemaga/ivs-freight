import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'blockedContent'
})
export class BlockedContentPipe implements PipeTransform {

  transform(value: string): boolean {
    console.log(value)
    if(['login','register','thank you', 'forgot password'].includes(value.toLowerCase())) {
      return true;
    }
    return false;
  }

}
