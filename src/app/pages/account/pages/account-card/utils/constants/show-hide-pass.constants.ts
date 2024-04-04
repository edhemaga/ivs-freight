import {
    SvgStyles,
    TooltipStyles,
} from '../../../../../../core/model/show-hide-directive.model';

export class ShowHidePassConstants {
    static TOOLTIP_STYLES: TooltipStyles = {
        position: 'absolute',
        visibility: 'hidden',
        'background-color': '#424242',
        color: '#FFFFFF',
        padding: '2px 6px',
        'border-radius': '3px',
        'z-index': '1',
        'font-size': '11px',
        'font-weight': '600',
        display: 'flex',
        'align-items': 'center',
    };

    static SVG_STYLES: SvgStyles = {
        'margin-right': '5px',
        height: '15px',
        width: '15px',
        cursor: 'pointer',
    };
}
