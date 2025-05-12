import { FileResponse } from 'appcoretruckassist';

// interfaces
import { DocumentsDrawerTag } from '@shared/interfaces';

export class TagsHelper {
    static createDocumentsDrawerTags(
        files: FileResponse[]
    ): DocumentsDrawerTag[] {
        let tags = [];

        files.forEach((file) => {
            tags = [...tags, ...file.tags];
        });

        return tags.map((tag, index) => {
            return {
                id: index + 1,
                title: tag,
                isSelected: false,
            };
        });
    }

    static filterTagsAndFiles(
        tableAttachmentTags: DocumentsDrawerTag[],
        tableAttachments: FileResponse[],
        tagId: number
    ): {
        tags: DocumentsDrawerTag[];
        files: FileResponse[];
    } {
        const tags = tableAttachmentTags.map((tag) =>
            tag.id === tagId ? { ...tag, isSelected: !tag.isSelected } : tag
        );

        const selectedTag = tags.find((tag) => tag.id === tagId);

        const files = tableAttachments.filter((file) =>
            file.tags.includes(selectedTag.title)
        );

        return {
            tags,
            files,
        };
    }
}
