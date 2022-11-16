export class DisclosureRelease {
   id?: number;
   applicantId?: string;
   isFirstDisclosure: boolean;
   isSecondDisclosure: boolean;
   isThirdDisclosure: boolean;
   isFourthDisclosure: boolean;
   isFifthDisclosure: boolean;
   isSixthDisclosure: boolean;

   constructor(disclosureRelease?: DisclosureRelease) {
      this.id = disclosureRelease?.id ? disclosureRelease.id : undefined;
      this.applicantId = disclosureRelease?.applicantId
         ? disclosureRelease.applicantId
         : undefined;
      this.isFirstDisclosure = disclosureRelease?.isFirstDisclosure
         ? disclosureRelease.isFirstDisclosure
         : false;
      this.isSecondDisclosure = disclosureRelease?.isSecondDisclosure
         ? disclosureRelease.isSecondDisclosure
         : false;
      this.isThirdDisclosure = disclosureRelease?.isThirdDisclosure
         ? disclosureRelease.isThirdDisclosure
         : false;
      this.isFourthDisclosure = disclosureRelease?.isFourthDisclosure
         ? disclosureRelease.isFourthDisclosure
         : false;
      this.isFifthDisclosure = disclosureRelease?.isFifthDisclosure
         ? disclosureRelease.isFifthDisclosure
         : false;
      this.isSixthDisclosure = disclosureRelease?.isSixthDisclosure
         ? disclosureRelease.isSixthDisclosure
         : false;
   }
}
