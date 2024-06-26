import { AnnotationItem } from '@pages/applicant/pages/applicant-application/models/annotation-item.model';
import { ApplicantQuestion } from '@pages/applicant/pages/applicant-application/models/applicant-question.model';
import { WorkExpereience } from '@pages/applicant/pages/applicant-application/models/work-experience.model';
import {
    StringConstantsStep10,
    StringConstantsStep11,
    StringConstantsStep5,
    StringConstantsStep7,
    StringConstantsStep8,
    StringConstantsStep9,
} from '@pages/applicant/pages/applicant-application/models/string-constants.model';
import { AnswerChoices } from '@pages/applicant/pages/applicant-application/models/answer-choices.model';

export class ApplicantApplicationConstants {
    public static displayRadioRequiredNoteArray: {
        id: number;
        displayRadioRequiredNote: boolean;
    }[] = [
        { id: 0, displayRadioRequiredNote: false },
        { id: 1, displayRadioRequiredNote: false },
        { id: 2, displayRadioRequiredNote: false },
        { id: 3, displayRadioRequiredNote: false },
        { id: 4, displayRadioRequiredNote: false },
        { id: 5, displayRadioRequiredNote: false },
        { id: 6, displayRadioRequiredNote: false },
    ];

    public static questions: ApplicantQuestion[] = [
        {
            title: 'Are you a US citizen?',
            formControlName: 'usCitizen',
            formControlNameExplain: 'usCitizenExplain',
            answerChoices: [
                {
                    id: 1,
                    label: 'YES',
                    value: 'usCitizenYes',
                    name: 'usCitizenYes',
                    checked: false,
                    index: 0,
                },
                {
                    id: 2,
                    label: 'NO',
                    value: 'usCitizenNo',
                    name: 'usCitizenNo',
                    checked: false,
                    index: 0,
                },
            ],
        },
        {
            title: 'Do you have legal right to work in the US?',
            formControlName: 'legalWork',
            formControlNameExplain: 'legalWorkExplain',
            answerChoices: [
                {
                    id: 3,
                    label: 'YES',
                    value: 'legalWorkYes',
                    name: 'legalWorkYes',
                    checked: false,
                    index: 1,
                },
                {
                    id: 4,
                    label: 'NO',
                    value: 'legalWorkNo',
                    name: 'legalWorkNo',
                    checked: false,
                    index: 1,
                },
            ],
        },
        {
            title: 'Have you ever been known by any other name?',
            formControlName: 'anotherName',
            formControlNameExplain: 'anotherNameExplain',
            answerChoices: [
                {
                    id: 5,
                    label: 'YES',
                    value: 'anotherNameYes',
                    name: 'anotherNameYes',
                    checked: false,
                    index: 2,
                },
                {
                    id: 6,
                    label: 'NO',
                    value: 'anotherNameNo',
                    name: 'anotherNameNo',
                    checked: false,
                    index: 2,
                },
            ],
        },
        {
            title: 'Were you ever in the military?',
            formControlName: 'inMilitary',
            formControlNameExplain: 'inMilitaryExplain',
            answerChoices: [
                {
                    id: 7,
                    label: 'YES',
                    value: 'inMilitaryYes',
                    name: 'inMilitaryYes',
                    checked: false,
                    index: 3,
                },
                {
                    id: 8,
                    label: 'NO',
                    value: 'inMilitaryNo',
                    name: 'inMilitaryNo',
                    checked: false,
                    index: 3,
                },
            ],
        },
        {
            title: 'Have you ever been convicted of a felony?',
            formControlName: 'felony',
            formControlNameExplain: 'felonyExplain',
            answerChoices: [
                {
                    id: 9,
                    label: 'YES',
                    value: 'felonyYes',
                    name: 'felonyYes',
                    checked: false,
                    index: 4,
                },
                {
                    id: 10,
                    label: 'NO',
                    value: 'felonyNo',
                    name: 'felonyNo',
                    checked: false,
                    index: 4,
                },
            ],
        },
        {
            title: 'Have you ever been convicted of a misdemeanor?',
            formControlName: 'misdemeanor',
            formControlNameExplain: 'misdemeanorExplain',
            answerChoices: [
                {
                    id: 11,
                    label: 'YES',
                    value: 'misdemeanorYes',
                    name: 'misdemeanorYes',
                    checked: false,
                    index: 5,
                },
                {
                    id: 12,
                    label: 'NO',
                    value: 'misdemeanorNo',
                    name: 'misdemeanorNo',
                    checked: false,
                    index: 5,
                },
            ],
        },
        {
            title: 'Have you ever had a DUI, DWI, or OVI?',
            formControlName: 'drunkDriving',
            formControlNameExplain: 'drunkDrivingExplain',
            answerChoices: [
                {
                    id: 13,
                    label: 'YES',
                    value: 'drunkDrivingYes',
                    name: 'drunkDrivingYes',
                    checked: false,
                    index: 6,
                },
                {
                    id: 14,
                    label: 'NO',
                    value: 'drunkDrivingNo',
                    name: 'drunkDrivingNo',
                    checked: false,
                    index: 6,
                },
            ],
        },
    ];

    public static openAnnotationArray: AnnotationItem[] = [
        {
            lineIndex: 0,
            lineInputs: [false, false, false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 1,
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 7,
            lineInputs: [false, false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 8,
            lineInputs: [false, false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 9,
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 10,
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 11,
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 12,
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 13,
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 14,
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 15,
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
    ];
    public static workExperienceArray: WorkExpereience[] = [
        {
            id: 1,
            isEditingWorkExperience: false,
            workExperienceItemReview: null,
            employer: 'asdas',
            employerPhone: '(222) 222-2222',
            employerEmail: 'asd@asd.com',
            employerFax: '(122) 222-2222',
            employerAddress: {
                address: 'Chimney Rock Rd, Houston, TX, US',
            },
            employerAddressUnit: '2',
            jobDescription: 'Asd',
            fromDate: '01/07/23',
            toDate: '01/07/23',
            reasonForLeaving: 'Better opportunity',
            accountForPeriod: 'asdas',

            isDrivingPosition: true,
            classesOfEquipment: [
                {
                    vehicleType: 'Semi Truck',
                    trailerType: 'Reefer',
                    trailerLength: '20 ft',
                    cfrPart: true,
                    fmCSA: true,
                },
                {
                    vehicleType: 'Semi Sleeper',
                    trailerType: 'Dry Van',
                    trailerLength: '22 ft',
                    cfrPart: false,
                    fmCSA: false,
                },
                {
                    vehicleType: 'Spotter',
                    trailerType: 'Side Kit',
                    trailerLength: '24 ft',
                    cfrPart: true,
                    fmCSA: false,
                },
            ],
        },
    ];

    public static answerChoicesStep3: AnswerChoices[] = [
        {
            id: 1,
            label: 'YES',
            value: 'permitYes',
            name: 'permitYes',
            checked: false,
        },
        {
            id: 2,
            label: 'NO',
            value: 'permitNo',
            name: 'permitNo',
            checked: false,
        },
    ];
    public static openAnnotationArrayStep3: AnnotationItem[] = [
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {
            lineIndex: 14,
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
    ];

    public static stringConstantsStep5: StringConstantsStep5 = {
        title: 'Traffic violations',
        pleaseListAllMotorTrafficViolations: `
            Please list all motor vehicle traffic violations in which you were involved 
            (both commercial and private vehicle) during the past 12 months prior to the application date.
        `,
        notBeenConvicted: `
            I certify I have not been convicted or forfeited bond or 
            collateral on account of any violation required to be listed 
            during the past 3 years.
        `,
        onlyOneHoldLicense: `
            I further certify that the above license is the only one I hold.  
        `,
        noViolationsForPastTwelveMonths: `
            No traffic violations for past 12 months
        `,
        listAnyAdditonalViolations: `
            List any additional violations in past 12 months
        `,
        certify: `
            I certify that the following is a true and complete 
            list of traffic violations (other than parking tickets) for 
            which I have been convicted or forfeited bond or collateral 
            during the past 3 years.
        `,
    };

    public static questionsStep6: ApplicantQuestion[] = [
        {
            title: 'Have you received any safety awards or special training?',
            formControlName: 'specialTraining',
            formControlNameExplain: 'specialTrainingExplain',
            answerChoices: [
                {
                    id: 1,
                    label: 'YES',
                    value: 'specialTrainingYes',
                    name: 'specialTrainingYes',
                    checked: false,
                    index: 0,
                },
                {
                    id: 2,
                    label: 'NO',
                    value: 'specialTrainingNo',
                    name: 'specialTrainingNo',
                    checked: false,
                    index: 0,
                },
            ],
        },
        {
            title: 'Have you received any other training?',
            formControlName: 'otherTraining',
            formControlNameExplain: 'otherTrainingExplain',
            answerChoices: [
                {
                    id: 3,
                    label: 'YES',
                    value: 'otherTrainingYes',
                    name: 'otherTrainingYes',
                    checked: false,
                    index: 1,
                },
                {
                    id: 4,
                    label: 'NO',
                    value: 'otherTrainingNo',
                    name: 'otherTrainingNo',
                    checked: false,
                    index: 1,
                },
            ],
        },
        {
            title: 'Do you have full knowledge of the federal moto carrier safety regulations?',
            formControlName: 'knowledgeOfSafetyRegulations',
            formControlNameExplain: 'knowledgeOfSafetyRegulationsExplain',
            answerChoices: [
                {
                    id: 5,
                    label: 'YES',
                    value: 'knowledgeOfSafetyRegulationsYes',
                    name: 'knowledgeOfSafetyRegulationsYes',
                    checked: false,
                    index: 2,
                },
                {
                    id: 6,
                    label: 'NO',
                    value: 'knowledgeOfSafetyRegulationsNo',
                    name: 'knowledgeOfSafetyRegulationsNo',
                    checked: false,
                    index: 2,
                },
            ],
        },
        {
            title: 'Have you been a driver for this company before?',
            formControlName: 'driverForCompany',
            formControlNameExplain: 'driverForCompanyBeforeExplain',
            answerChoices: [
                {
                    id: 7,
                    label: 'YES',
                    value: 'driverForCompanyBeforeYes',
                    name: 'driverForCompanyBeforeYes',
                    checked: false,
                    index: 3,
                },
                {
                    id: 8,
                    label: 'NO',
                    value: 'driverForCompanyBeforeNo',
                    name: 'driverForCompanyBeforeNo',
                    checked: false,
                    index: 3,
                },
            ],
        },
        {
            title: 'Is there any reason you might be unable to preform the functions of the job for which you have applied?',
            formControlName: 'unableForJob',
            formControlNameExplain: 'unableForJobExplain',
            answerChoices: [
                {
                    id: 9,
                    label: 'YES',
                    value: 'unableForJobYes',
                    name: 'unableForJobYes',
                    checked: false,
                    index: 4,
                },
                {
                    id: 10,
                    label: 'NO',
                    value: 'unableForJobNo',
                    name: 'unableForJobNo',
                    checked: false,
                    index: 4,
                },
            ],
        },
    ];

    public static openAnnotationArrayStep6: AnnotationItem[] = [
        {
            lineIndex: 0,
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 1,
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 2,
            lineInputs: [false, false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 3,
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
    ];

    public static displayRadioRequiredNoteArrayStep6: {
        id: number;
        displayRadioRequiredNote: boolean;
    }[] = [
        { id: 0, displayRadioRequiredNote: false },
        { id: 1, displayRadioRequiredNote: false },
        { id: 2, displayRadioRequiredNote: false },
        { id: 3, displayRadioRequiredNote: false },
        { id: 4, displayRadioRequiredNote: false },
    ];

    public static questionsStep7: ApplicantQuestion[] = [
        {
            title: 'Are you currently working for another employer?',
            formControlName: 'anotherEmployer',
            formControlNameExplain: 'anotherEmployerExplain',
            answerChoices: [
                {
                    id: 1,
                    label: 'YES',
                    value: 'anotherEmployerYes',
                    name: 'anotherEmployerYes',
                    checked: false,
                    index: 0,
                },
                {
                    id: 2,
                    label: 'NO',
                    value: 'anotherEmployerNo',
                    name: 'anotherEmployerNo',
                    checked: false,
                    index: 0,
                },
            ],
        },
        {
            title: 'At this time do you intend to work for another employer while still employed by this company?',
            formControlName: 'intendToWorkAnotherEmployer',
            formControlNameExplain: 'intendToWorkAnotherEmployerExplain',
            answerChoices: [
                {
                    id: 3,
                    label: 'YES',
                    value: 'intendToWorkAnotherEmployerYes',
                    name: 'intendToWorkAnotherEmployerYes',
                    checked: false,
                    index: 1,
                },
                {
                    id: 4,
                    label: 'NO',
                    value: 'intendToWorkAnotherEmployerNo',
                    name: 'intendToWorkAnotherEmployerNo',
                    checked: false,
                    index: 1,
                },
            ],
        },
    ];

    public static openAnnotationArrayStep7: AnnotationItem[] = [
        {
            lineIndex: 0,
            lineInputs: [false, false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 1,
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 2,
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
    ];

    public static stringConstantsStep7: StringConstantsStep7 = {
        title: '7 Days HOS',
        instructionsMotorCarriers: `
            Instructions: Motor Carriers when
            using a driver for the first time shall obtain from the driver a
            signed statement giving the total time on-duty during the
            immediately preceding 7 days and time at which such driver was last
            relived from duty prior to beginning work for such motor carrier.
            Rule 395.8(j) (2) Federal Motor Carrier Safety Regulations.
        `,
        hoursForCompensated: `
            NOTE: Hours for any compensated
            work during the preceding 7 days, including work for a non-motor
            carrier entity, must be recorded on this form.
        `,
        isValidHos: `
            I hereby certify that the information given above is correct
            to the best of my Knowledge and behalf,
            and that I was released from work on:   
            `,
        dateReleasedFrom: `
            Date released from work and location?
        `,
        instructionsEmployedMotorCarrier: `
            Instructions: When
            employed by motor carrier, a driver must report to the motor
            carrier all on-duty time working for other employers. The
            definition of on-duty time found in Section 395.2 paragraphs
            8 and 9 of the Federal Motor Carrier Safety Regulations
            includes time performing any other work in the capacity of,
            or in the employment or service of a common, contract or
            private motor carrier, also performing any compensated work
            for any non-motor carrier entity.
        `,
        isValidAnotherEmployer: `
            I hereby certify that the information given above is true and 
            I understand that once I begin driving for this company, if 
            I begin working for any additional employer(s) for compensation 
            that I must inform this company immediately of such employment 
            activity.
        `,
    };

    public static questionStep8: ApplicantQuestion = {
        title: 'Have you, the applicant, tested positive, or refused to test, on any pre-employment drug or alcohol test administered by an employer to which you applied for, but did not obtain, safety-sensitive transportation work covered by DOT agency drug and alcohol testing rules during the past two years?',
        formControlName: 'drugTest',
        answerChoices: [
            {
                id: 1,
                label: 'YES',
                value: 'drugTestYes',
                name: 'drugTestYes',
                checked: false,
            },
            {
                id: 2,
                label: 'NO',
                value: 'drugTestNo',
                name: 'drugTestNo',
                checked: false,
            },
        ],
    };

    public static openAnnotationArrayStep8: AnnotationItem[] = [
        {
            lineIndex: 0,
            lineInputs: [false, false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 1,
            lineInputs: [false, false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 2,
            lineInputs: [false, false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 3,
            lineInputs: [false, false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
    ];

    public static stringConstantsStep8: StringConstantsStep8 = {
        title: 'Drug & alcohol statement',
        federalMotorCarrierSafetyRegulations: `
            Section 40.25(j) of the Federal Motor Carrier Safety Regulations,
            requires each motor carrier to inquire to prospective drivers and
            prospective drivers are required to respond to the information in
            the question below.
        `,
        inAdditionSubstanceAbuseProfessional: `
            In addition, if the answer to the above question is YES,
            please list the name and contact information for the
            Substance Abuse Professional (SAP) who completes you
            evaluation:
        `,
        informationTrueAndCorrect: `
            I certify that the information provided on this document is true and correct.
        `,
    };

    public static stringConstantsStep9: StringConstantsStep9 = {
        title: 'Driver rights',
        subtitle_1: `
            391.23(I)(1)
        `,
        driverProvidedWithCertainRights: `
            As a driver you are provided with certain rights under the Federal Motor
            Carrier Safety Regulation in Part 391.23. These rights are:
        `,
        rightToReviewInformation: `
            (I) The right to review
            information provided by previous employers
        `,
        rightToHaveErrorsInformation: `
           (II) The right to have errors in
            the information corrected by the previous employer and for that
            previous employer to re-send the corrected information to the
            prospective employer
        `,
        rightToHaveRebuttalStatement: `
           (III) The right to have a rebuttal
            statement attached to the alleged erroneous information, if the
            previous employer and the driver cannot agree on the accuracy of the
            information.
        `,
        subtitle_2: `
            391.23(I)(2)
        `,
        driversPreviousDepartmentOfTransportation: `
            Drivers who have previous Department of Transportation regulated
            employment history in the preceding three years, and wish to review
            previous employer-provided investigative information must submit a
            written request to the prospective employer, which may be done at
            any time, including when applying, or as late 30 days after being
            employed or being notified of denial of employment. The prospective
            employer must provide this information to the applicant within five
            (5) business days of receiving the written request. If the
            prospective employer has not yet received the requested information
            from previous employer(s), then the five-business day’s deadline
            will begin when the prospective employer receives the requested
            safety performance history information. If the driver has not
            arranged to pick up or receive the request record within thirty (30)
            days of the prospective employer making them available, the
            prospective motor carrier may consider the driver to have waived
            his/her request to review the record.
        `,
        subtitle_3: `
            391.23(j)(1)
        `,
        requestCorrectionErroneousInformation: `
            Drivers wishing to request correction of erroneous information in
            record received pursuant to paragraph (I) of this section must send
            the request for the correction to the previous employer that provide
            the records to the prospective employer.
        `,
        subtitle_4: `
            391.23(j)(2)
        `,
        mustCorrectAndForwardInformation: `
            After October 29, 2004 the previous employer must correct and
            forward the information to the prospective motor carrier employer,
            on notify the driver within 15 days of receiving a driver’s request
            to correct the data that it does not agree to correct the data. If
            the previous employer corrects and forwards the data as requested,
            that employer must also retain the corrected information.
        `,
        partOfSafetyPerformanceHistory: `
            As part of the driver’s safety performance history record and
            provide it to subsequent prospective employers when requests for
            this information are received. If the previous employer corrects the
            data and forwards it to the prospective motor carrier employer,
            there is no need to notify the driver.
        `,
        subtitle_5: `
            391.23(j)(3)
        `,
        driversWishingToRebut: `
            Drivers wishing to rebut information in records pursuant to
            paragraph (I) of this section must send rebuttal to the previous
            employer with instructions to include the rebuttal in that driver’s
            safety performance history.
        `,
        subtitle_6: `
            391.23(j)(4)
        `,
        fiveBusinessDaysOfReceiving: `
            After October 29, 2004, within five business days of receiving a
            rebuttal from a driver, the previous employer must:
        `,
        forwardCopyOfRebuttal: `
            (I) forward a copy of the rebuttal
            to the prospective motor carrier employer
        `,
        appendRebuttalToDriver: `
            (II) Append the rebuttal to the
            driver’s information in the carrier’s appropriate file, to be
            included as part of the response for any subsequent investigating
            prospective employers for the duration of the three-year data
            retention requirement.
        `,
        subtitle_7: `
            391.23(j)(5)
        `,
        rebuttalWithoutRequest: `
            The driver may submit a rebuttal initially without a request for
            correction, or subsequent to request for correction.
        `,
        subtitle_8: `
            391.23(j)(6)
        `,
        reportFailuresPreviousEmployers: `
            The driver may report failures of previous employers to correct
            information or include the driver’s rebuttal as part of the safety
            performance information, to the FMCSA following procedures specified
            at Sec. 386.12.
        `,
        subtitle_9: `
            391.23(k)(1)
        `,
        prospectiveMotorCarrierEmployer: `
            The prospective motor carrier employer must use the information
            described in paragraphs (d) and (e) of this section only as part of
            deciding whether to hire the driver.
        `,
        subtitle_10: `
            391.23(k)(2)
        `,
        agentsAndInsurersMustTake: `
            The prospective motor carrier employer, its agents and insurers must
            take all precautions reasonably necessary to protect the record from
            disclosure to any person not directly involved in deciding whether
            to hire the driver. The prospective motor carrier employer may not
            provide any alcohol or controlled substances information to the
            prospective motor carrier employer’s insurer.
        `,
        noActionOrProceedingForDefamation: `
            No action or proceeding for defamation, invasion of privacy, or
            interference with a contract that is based on the furnishing or use
            information in accordance with this section may be brought against
        `,
        motorCarrierInvestigation: `
            (I) A motor carrier investigation
            the information, described in paragraphs (d) and (e) of this
            section, of an individual under consideration for employment as a
            commercial motor vehicle driver
        `,
        personWhoHasInformation: `
            (II) A person who has provide such
            information or
        `,
        insurersDescribedInParagraph: `
            (III) The agents or insurers of a
            person described in paragraph (1) (1) (I) or (ii) of this section,
            except insurers are not granted a limitation on liability for any
            alcohol and controlled substance information.
        `,
        protectionInParagraph: `
            The protections in paragraph (1) (1) of this section do not apply to
            person who knowingly furnish false information, or who are not in
            compliance with the procedures specified for these investigations.
        `,
        readAndUnderstand: `
           I read and understand the above-mentioned rights
        `,
    };

    static stringConstantsStep10(companyName: string): StringConstantsStep10 {
        return {
            title: 'Disclosure & release',
            becauseIMustDrive: `
                1. Because I must drive as an essential function of my
                employment or potential employment, I hereby give permission
                to ${companyName} to obtain my state driving record (also
                known as my motor vehicle record or MVR) in accordance with
                the Fair Credit Reporting Act (FCRA) and the Federal
                Driver’s Privacy Protection Act (DPPA).
            `,
            publicRecordInformation: `
                2. I acknowledge and understand that my driving record is a
                consumer report that contains public record information.
            `,
            stateDrivingRecord: `
                3. I authorize, without reservation any party or agency
                contacted by ${companyName} to furnish
                ${companyName} a copy of my state driving record.
            `,
            twoYearDrivingRecord: `
                4. I understand that I have the right to request a copy of
                my driving record and to know the source or sources of my
                driving record, for a two-year period preceding my request.
            `,
            authorizationRemainOnFile: `
                5. This authorization shall remain on file by
                ${companyName} for the duration of my and will serve as
                ongoing authorization for ${companyName} to procure my
                state driving record at any time during my employment
                period.
            `,
            adverseActionAffectinEmployment: `
                6. I understand that ${companyName} may take adverse
                action affecting my employment, based on information in my
                driving record.If such adverse action is taken, I
                acknowledge that my rights are as follows:
            `,
            writingAdverseAction: `
                - Employer must notify me in writing of any such adverse
                action
            `,
            rightCopyDrivingRecord: `
                - I have the right to receive a copy of the driving record
                upon which the adverse action was based.
            `,
            rightSummaryFairCreditReportingAct: `
                - I have the right to receive a summary of my rights under
                the Fair Credit Reporting Act. I have the right to know the
                name, address and phone number of the consumer reporting
                agency that provided my driving record to ${companyName}.
            `,
            drivingRecord60Days: `
                - I have the right to obtain a free copy of my driving
                record from the agency that provided it, if such request is
                made within 60 days from the date that Employer took adverse
                action.
            `,
            disputeAccuracyCompleteness: `
                - I have the right to dispute the accuracy or completeness
                of my driving record with the consumer reporting agency that
                provided it, and request that errors be corrected.
            `,
        };
    }

    public static stringConstantsStep11: StringConstantsStep11 = {
        title: 'Authorization',
        isFirstAuthorization: `
            I hereby authorize this company to release all records of
            employment, including assessments of my job previous
            ability, and fitness (including dates of any and all alcohol
            or drug tests, those confirmed results and/or my refusing to
            any alcohol or drug tests and any rehabilitation completion
            under direction of SAP/MRO) to each and every company (their
            authorized agents) which may request such information in
            connection with my application for employment company. I
            hereby release this company, and its employees, officers,
            directors, and agents from any and all liable type as a
            result of providing the following information to the below
            mentioned person and/or company.
        `,
        isSecondAuthorization: `
            I authorize the carrier to make such inquiries and
            investigations of my personal, employment, driving,
            financial or medical history and other related matters as
            may be necessary in arriving at an employment decision.
            (Generally, inquiries regarding medical history will be made
            only if and after a conditional offer of employment has been
            extended.) I hereby release employer, schools health care
            providers and other persons from all liability in responding
            to inquiries and releasing information in connection with my
            application.
        `,
        isThirdAuthorization: `
            In the event of employment, I understand that false or
            misleading information given in my application or
            interview(s) may result in discharge. I agree to abide by
            the rules and regulations of the carrier as well as the
            Federal Motor Carrier Safety Regulations. I also agree and
            understand that if I am selected to drive for the carrier
            that I will be on a probationary period during which time I
            may be discharge without recourse.      
            `,
        isFourthAuthorization: `
            This certifies that I completed this application, and that
            all entries on it and information in it are true and
            completed to the best of my knowledge.
        `,
    };
}
