import { ApplicantConfigParams } from '@pages/applicant/models/applicant-input-config.model';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

export class Step3Config {
    static getLicenseNumberInputConfig(
        config: ApplicantConfigParams
    ): ITaInput {
        return {
            name: 'License',
            type: 'text',
            label: 'License No.',
            isRequired: true,
            textTransform: 'uppercase',
            autoFocus: config.selectedMode === 'APPLICANT_MODE',
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isLicenseValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }

    static getCountryInputConfig(config: ApplicantConfigParams): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Country',
            isRequired: true,
            isDropdown: true,
            dropdownWidthClass: config.isEditing ? 'w-col-238' : 'w-col-240',
            isDisabled: config.selectedMode !== 'APPLICANT_MODE',
        };
    }

    static getStateInputConfig(config: ApplicantConfigParams): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'State',
            isRequired: true,
            isDisabled:
                (config.selectedMode === 'APPLICANT_MODE' &&
                    !config.licenseForm.get('country').value) ||
                config.selectedMode !== 'APPLICANT_MODE',
            isDropdown: true,
            dropdownWidthClass: 'w-col-140',
        };
    }

    static getClassTypeInputConfig(config: ApplicantConfigParams): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Class',
            isRequired: true,
            isDropdown: true,
            dropdownWidthClass: 'w-col-124',
            isDisabled: config.selectedMode !== 'APPLICANT_MODE',
        };
    }

    static getIssueDateInputConfig(config: ApplicantConfigParams): ITaInput {
        return {
            name: 'datepicker',
            type: 'text',
            label: 'Issue Date',
            isDropdown: true,
            placeholderIcon: 'date',
            isRequired: true,
            customClass: 'datetimeclass',
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isExpDateValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }

    static getExpDateInputConfig(config: ApplicantConfigParams): ITaInput {
        return {
            name: 'datepicker',
            type: 'text',
            label: 'Exp. Date',
            isDropdown: true,
            placeholderIcon: 'date',
            isRequired: true,
            customClass: 'datetimeclass',
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isExpDateValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }

    static getRestrictionsInputConfig(config: ApplicantConfigParams): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Restrictions',
            isDropdown: true,
            multiselectDropdown: true,
            multiSelectItemRange: true,
            dropdownWidthClass: config.isEditing ? 'w-col-606' : 'w-col-616',
            isDisabled: config.selectedMode !== 'APPLICANT_MODE',
        };
    }

    static getEndorsmentsInputConfig(config: ApplicantConfigParams): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Endorsments',
            isDropdown: true,
            multiselectDropdown: true,
            dropdownWidthClass: config.isEditing ? 'w-col-606' : 'w-col-616',
            isDisabled: config.selectedMode !== 'APPLICANT_MODE',
        };
    }

    static getPermitExplainInputConfig(
        config: ApplicantConfigParams
    ): ITaInput {
        return {
            name: 'Explain',
            type: 'text',
            label: 'Please explain',
            isRequired: true,
            textTransform: 'capitalize',
            placeholder: 'Please explain',
            placeholderInsteadOfLabel: true,
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isCdlDeniedExplanationValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }
}
