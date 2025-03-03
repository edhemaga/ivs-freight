// helpers
import {
    AvatarColorsHelper,
    DropdownMenuContentHelper,
    MethodsCalculationsHelper,
} from '@shared/utils/helpers';

// models
import { CompanyContactResponse } from 'appcoretruckassist';
import { IContactsViewModelData } from '@pages/contacts/pages/contacts-table/models/contacts-view-data.model';

// pipes
import { NameInitialsPipe } from '@shared/pipes';

export class ContactStoreHelper {
    public static mapContactData(
        data: CompanyContactResponse
    ): IContactsViewModelData {
        const nameInitialsPipe: NameInitialsPipe = new NameInitialsPipe();

        return {
            ...data,
            isSelected: false,
            email: data?.contactEmails[0]?.email ?? null,
            emailSecond: data?.contactEmails[1]?.email ?? null,
            phone: data?.contactPhones[0]?.phone ?? null,
            phoneSecond: data?.contactPhones[1]?.phone ?? null,
            phoneThird: data?.contactPhones[2]?.phone ?? null,
            company: data?.companyName,
            textAddress: data?.address?.address ?? null,
            textShortName: nameInitialsPipe.transform(data.name),
            avatarColor: AvatarColorsHelper.getAvatarColors(),
            avatarImg: data?.avatarFile?.url ?? null,
            isShared: data.shared,
            lable: data?.companyContactLabel
                ? {
                      name: data?.companyContactLabel?.name ?? null,
                      color: data?.companyContactLabel?.code ?? null,
                  }
                : null,
            added: MethodsCalculationsHelper.convertDateFromBackend(
                data?.createdAt
            ),
            edited: MethodsCalculationsHelper.convertDateFromBackend(
                data?.updatedAt
            ),
            tableDropdownContent:
                DropdownMenuContentHelper.getContactDropdownContent(),
        };
    }
}
