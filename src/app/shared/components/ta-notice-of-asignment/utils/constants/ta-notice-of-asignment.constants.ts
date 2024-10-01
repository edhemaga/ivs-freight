// interfaces
import { IFontSizeOption } from "@shared/components/ta-notice-of-asignment/interfaces";

export class TaNoticeOfAssignmentConstants {
    static FONT_SIZE_SMALL: number = 10;
    static FONT_SIZE_DEFAULT: number = 13;
    static FONT_SIZE_LARGE: number = 18;

    static TEXT_ALIGN_LEFT = 'justifyLeft';
    static TEXT_ALIGN_CENTER = 'justifyCenter';
    static TEXT_ALIGN_RIGHT = 'justifyRight';
    static TEXT_ALIGN_FULL = 'justifyFull';

    static TOOLBAR_ACTION_BOLD = 'bold';
    static TOOLBAR_ACTION_ITALIC = 'italic';
    static TOOLBAR_ACTION_UNDERLINE = 'underline';
    static TOOLBAR_ACTION_STRIKETHROUGH = 'strikethrough';
    static TOOLBAR_ACTION_FONT_SIZE = 'fontSize';
    static TOOLBAR_ACTION_FORE_COLOR = 'foreColor';
    static TOOLBAR_ACTION_INDENT = 'indent';
    static TOOLBAR_ACTION_OUTDENT = 'outdent';
    static TOOLBAR_ACTION_INSERT_UNORDERED_LIST = 'insertUnorderedList';
    static TOOLBAR_ACTION_INSERT_ORDERED_LIST = 'insertOrderedList';

    static FONT_SIZE_OPTIONS: IFontSizeOption[] = [
        {
            id: 1,
            name: 'Large',
            showName: 'Large',
            size: this.FONT_SIZE_LARGE,
        },
        {
            id: 2,
            name: 'Default',
            showName: 'Default',
            size: this.FONT_SIZE_DEFAULT,
        },
        {
            id: 3,
            name: 'Small',
            showName: 'Small',
            size: this.FONT_SIZE_SMALL,
        },
    ];
}