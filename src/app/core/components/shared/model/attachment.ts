export interface Attachment {
  guid: string;
  table: string;
  id: number;
  property: string;
  propertyGuid: string;
  files: File[];
}

export interface File {
  fileName: string;
  base64Content: string;
}
