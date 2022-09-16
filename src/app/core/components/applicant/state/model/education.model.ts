export interface ContactModel {
  id: number;
  name: string;
  phone: string;
  relationship: string;
  isEditingContact: boolean;
}

export class Contact {
  id?: string;
  contactName: string;
  contactPhone: string;
  contactRelationship: string;
  isDeleted: boolean;

  constructor(contact?: Contact) {
    this.id = contact?.id ? contact.id : undefined;
    this.contactName = contact?.contactName ? contact.contactName : '';
    this.contactPhone = contact?.contactPhone ? contact.contactPhone : '';
    this.contactRelationship = contact?.contactRelationship
      ? contact.contactRelationship
      : '';
    this.isDeleted = contact?.isDeleted ? contact.isDeleted : false;
  }
}

export class Education {
  id?: number;
  applicantId?: string;
  grade: number;
  collegeGrade: number;
  specialTraining?: boolean;
  specialTrainingExplain: string;
  otherTraining?: boolean;
  otherTrainingExplain: string;
  knowledgeOfSafetyRegulations?: boolean;
  knowledgeOfSafetyRegulationsExplain: string;
  driverForCompanyBefore?: boolean;
  driverForCompanyBeforeExplain?: string;
  unableForJob?: boolean;
  isCompleted: boolean;
  contacts: Contact[];

  constructor(education?: Education) {
    this.id = education?.id ?? undefined;
    this.applicantId = education?.applicantId ?? undefined;
    this.grade = education?.grade ?? 0;
    this.collegeGrade = education?.collegeGrade ?? 0;
    this.specialTraining = education?.specialTraining ?? false;
    this.specialTrainingExplain = education?.specialTrainingExplain ?? '';
    this.otherTraining = education?.otherTraining ?? false;
    this.otherTrainingExplain = education?.otherTrainingExplain ?? '';
    this.knowledgeOfSafetyRegulations =
      education?.knowledgeOfSafetyRegulations ?? false;
    this.knowledgeOfSafetyRegulationsExplain =
      education?.knowledgeOfSafetyRegulationsExplain ?? '';
    this.driverForCompanyBefore = education?.driverForCompanyBefore ?? false;
    this.isCompleted = education?.isCompleted ? education.isCompleted : true;
    this.driverForCompanyBeforeExplain =
      education?.driverForCompanyBeforeExplain ?? undefined;
    this.unableForJob = education?.unableForJob ?? false;
    this.contacts = education?.contacts ? education.contacts : [];
  }
}
