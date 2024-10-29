// models
import { IFontSizeOption, ITextEditorToolbarAlignOption, ITextEditorToolbarConfig } from "@shared/components/ta-notice-of-asignment/models";

// svg routes
import { TaNoticeOfAsignmentSvgRoutes } from '@shared/components/ta-notice-of-asignment/utils/svg-routes';

export class TaNoticeOfAssignmentConstants {
    static STRING_EMPTY = '';

    static HTML_ELEMENT_BR = '<br>';

    static FONT_SIZE_SMALL: number = 10;
    static FONT_SIZE_DEFAULT: number = 13;
    static FONT_SIZE_LARGE: number = 18;

    static TEXT_ALIGN_LEFT: string = 'justifyLeft';
    static TEXT_ALIGN_CENTER: string = 'justifyCenter';
    static TEXT_ALIGN_RIGHT: string = 'justifyRight';
    static TEXT_ALIGN_FULL: string = 'justifyFull';

    static TOOLBAR_ACTION_BOLD: string = 'bold';
    static TOOLBAR_ACTION_ITALIC: string = 'italic';
    static TOOLBAR_ACTION_UNDERLINE: string = 'underline';
    static TOOLBAR_ACTION_STRIKETHROUGH: string = 'strikethrough';
    static TOOLBAR_ACTION_FONT_SIZE: string = 'fontSize';
    static TOOLBAR_ACTION_FORE_COLOR: string = 'foreColor';
    static TOOLBAR_ACTION_INDENT: string = 'indent';
    static TOOLBAR_ACTION_OUTDENT: string = 'outdent';
    static TOOLBAR_ACTION_INSERT_UNORDERED_LIST: string = 'insertUnorderedList';
    static TOOLBAR_ACTION_INSERT_ORDERED_LIST: string = 'insertOrderedList';

    static TOOLBAR_RGB_COLOR_DEFAULT: string = 'rgb(60, 60, 60)';
    static TOOLBAR_RGB_COLOR_BLUE: string = 'rgb(48, 116, 211)';
    static TOOLBAR_RGB_COLOR_GREEN: string = 'rgb(38, 166, 144)';
    static TOOLBAR_RGB_COLOR_RED: string = 'rgb(239, 83, 80)';
    static TOOLBAR_RGB_COLOR_ORANGE: string = 'rgb(255, 167, 38)';
    static TOOLBAR_RGB_COLOR_PURPLE: string = 'rgb(171, 71, 188)';

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

    static TOOLBAR_COLOR_OPTIONS: string[] = [
        this.TOOLBAR_RGB_COLOR_DEFAULT,
        this.TOOLBAR_RGB_COLOR_BLUE,
        this.TOOLBAR_RGB_COLOR_GREEN,
        this.TOOLBAR_RGB_COLOR_RED,
        this.TOOLBAR_RGB_COLOR_ORANGE,
        this.TOOLBAR_RGB_COLOR_PURPLE
    ];

    static FONT_SIZE_OPTION_DEFAULT: IFontSizeOption = { id: 2, name: 'Default', showName: 'Default', size: this.FONT_SIZE_DEFAULT };

    static TOOLBAR_ACTIONS_DEFAULT: ITextEditorToolbarConfig = {
        fontSize: true,
        bold: false,
        italic: false,
        foreColor: false,
        underline: false,
        strikeThrough: false
    };

    static TOOLBAR_ALIGN_OPTIONS_DEFAULT: ITextEditorToolbarAlignOption[] = [
        {
            name: this.TEXT_ALIGN_LEFT,
            value: false,
            imageUrl: TaNoticeOfAsignmentSvgRoutes.ICON_TEXT_ALIGN_LEFT_SVG_ROUTE,
        },
        {
            name: this.TEXT_ALIGN_CENTER,
            value: false,
            imageUrl: TaNoticeOfAsignmentSvgRoutes.ICON_TEXT_ALIGN_CENTER_SVG_ROUTE,
        },
        {
            name: this.TEXT_ALIGN_RIGHT,
            value: false,
            imageUrl: TaNoticeOfAsignmentSvgRoutes.ICON_TEXT_ALIGN_RIGHT_SVG_ROUTE,
        },
        {
            name: this.TEXT_ALIGN_FULL,
            value: false,
            imageUrl: TaNoticeOfAsignmentSvgRoutes.ICON_TEXT_ALIGN_FULL_SVG_ROUTE,
        }
    ];
}