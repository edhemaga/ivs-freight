import { Pipe, PipeTransform } from '@angular/core';

// Pipes
import { EBankAccountStatus } from '@pages/settings/enums';

@Pipe({
  name: 'settingsBankAccountStatus',
  standalone: true
})
export class SettingsBankAccountStatusPipe implements PipeTransform {

  transform(
    status: string | number | null,
    isHovered?: boolean
  ): string {
    console.log(status);
    switch (true) {
      case !status:
        return EBankAccountStatus.VERIFY;
      case status ===
        EBankAccountStatus.UNVERIFIED &&
        isHovered:
        return EBankAccountStatus.VERIFY;
      case status === 0:
        return EBankAccountStatus.PENDING;
      case status ===
        EBankAccountStatus.VERIFIED:
        return EBankAccountStatus.VERIFIED;
      default:
        return EBankAccountStatus.PENDING;
    }
  }

}
