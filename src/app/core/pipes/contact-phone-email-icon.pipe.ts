import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'setPhoneEmailIcon',
})
export class ContactPhoneEmailIconPipe implements PipeTransform {
    transform(_, column, row): string {
        if (
            (column?.field === 'phone' &&
                row?.contactPhones[0]?.contactPhoneType.name === 'Work') ||
            (column?.field === 'phoneSecond' &&
                row?.contactPhones[1]?.contactPhoneType.name === 'Work') ||
            (column?.field === 'phoneThird' &&
                row?.contactPhones[2]?.contactPhoneType.name === 'Work') ||
            (column?.field === 'email' &&
                row?.contactEmails[0]?.contactEmailType.name === 'Work') ||
            (column?.field === 'emailSecond' &&
                row?.contactEmails[1]?.contactEmailType.name === 'Work')
        ) {
            return 'assets/svg/common/ic_company.svg';
        }

        if (
            (column?.field === 'phone' &&
                row.contactPhones[0]?.contactPhoneType.name === 'Home') ||
            (column?.field === 'phoneSecond' &&
                row.contactPhones[1]?.contactPhoneType.name === 'Home') ||
            (column?.field === 'phoneThird' &&
                row.contactPhones[2]?.contactPhoneType.name === 'Home') ||
            (column?.field === 'email' &&
                row?.contactEmails[0]?.contactEmailType.name === 'Home') ||
            (column?.field === 'emailSecond' &&
                row?.contactEmails[1]?.contactEmailType.name === 'Home')
        ) {
            return 'assets/svg/common/ic_home.svg';
        }

        if (
            (column?.field === 'phone' &&
                row?.contactPhones[0]?.contactPhoneType.name === 'Mobile') ||
            (column?.field === 'phoneSecond' &&
                row?.contactPhones[1]?.contactPhoneType.name === 'Mobile') ||
            (column?.field === 'phoneThird' &&
                row?.contactPhones[2]?.contactPhoneType.name === 'Mobile')
        ) {
            return 'assets/svg/common/ic_phone.svg';
        }

        return '';
    }
}
