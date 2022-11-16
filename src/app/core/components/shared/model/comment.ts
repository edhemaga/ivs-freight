export interface Comments {
  parentId: number;
  entityName: string;
  entityId: number;
  commentText: string;
  attachmentId: string | number;
  doc: any;
  comment: string;
  createdAt: any;
  id: number;
  thumbDown: number;
  thumbUp: number;
  updatedAt: any;
  userAvatar: {
    id: string,
    src: string
  };
  userEmail: string;
  userFullName: string;
  userId: number;
}
