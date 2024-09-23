import { Pipe, PipeTransform } from '@angular/core';

import { CompanyResponse } from 'appcoretruckassist';

@Pipe({
    name: 'settingsCompanyAdditionalInfoHasDataP',
    standalone: true,
    pure: true
})
export class SettingsCompanyAdditionalInfoHasDataPipe implements PipeTransform {
    transform(companyData: CompanyResponse): boolean {
        const result = !!(
            companyData?.ifta || 
            companyData?.irp || 
            companyData?.toll || 
            companyData?.scac || 
            companyData?.timeZone?.name ||
            companyData?.currency?.name
        );

        return result;
    }
}
