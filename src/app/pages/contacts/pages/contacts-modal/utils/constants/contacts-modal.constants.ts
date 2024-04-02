import { CroppieOptions } from 'croppie';

export class ContactsModalConstants {
    static CROPIE_OPTIONS: CroppieOptions = {
        enableExif: true,
        viewport: {
            width: 194,
            height: 194,
            type: 'circle',
        },
        boundary: {
            width: 456,
            height: 194,
        },
    };
}
