// Pipes
import { Pipe, PipeTransform } from '@angular/core';

// Enums
import { EBankAccountStatus } from '@pages/settings/enums';

@Pipe({
    name: 'settingsBankAccountStatus',
    standalone: true,
})
export class SettingsBankAccountStatusPipe implements PipeTransform {
    transform(status: string | number | null, isHovered?: boolean): string {
        switch (true) {
            case !status:
                return EBankAccountStatus.VERIFY;
            case (status === EBankAccountStatus.UNVERIFIED ||
                status === EBankAccountStatus.FAILED) &&
                isHovered:
                return EBankAccountStatus.VERIFY;
            case status === 0:
                return EBankAccountStatus.PENDING;
            case status === EBankAccountStatus.VERIFIED:
                return EBankAccountStatus.VERIFIED;
            case status === EBankAccountStatus.FAILED:
                return EBankAccountStatus.FAILED;
            default:
                return EBankAccountStatus.PENDING;
        }
    }
}
