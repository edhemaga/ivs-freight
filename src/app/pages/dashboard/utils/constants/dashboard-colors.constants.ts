import {
    BarPerformanceColorsPallete,
    ByStateColorsPallete,
    LinePerformanceColorsPallete,
    TopRatedMainColorsPallete,
    TopRatedSecondaryColorsPallete,
} from '@pages/dashboard/models/colors-pallete.model';

export class DashboardColors {
    static TOP_RATED_MAIN_COLORS_PALLETE: TopRatedMainColorsPallete[] = [
        { color: 'light-blue', code: '#6692f1' },
        { color: 'orange', code: '#fab15c' },
        { color: 'red', code: '#e66767' },
        { color: 'turquoise', code: '#56b4ac' },
        { color: 'purple', code: '#b370f0' },
        { color: 'blue', code: '#5755df' },
        { color: 'light-orange', code: '#ff906d' },
        { color: 'green', code: '#77bf56' },
        { color: 'pink', code: '#e668a0' },
        { color: 'brown', code: '#a08266' },
        { color: 'grey', code: '#cccccc' },
    ];

    static TOP_RATED_SECONDARY_COLORS_PALLETE: TopRatedSecondaryColorsPallete[] = [
        { code: '#92b1f5' },
        { code: '#fbc88b' },
        { code: '#ed9292' },
        { code: '#86c9c3' },
        { code: '#c999f4' },
    ];

    static LINE_PERFORMANCE_COLORS_PALLETE: LinePerformanceColorsPallete[] = [
        {
            code: 'rgba(102, 146, 241, 1)',
            hoverCode: 'rgba(59, 115, 237, 1)',
            isSelected: false,
        },
        {
            code: 'rgba(250, 177, 92, 1)',
            hoverCode: 'rgba(248, 155, 46, 1)',
            isSelected: false,
        },
        {
            code: 'rgba(230, 103, 103, 1)',
            hoverCode: 'rgba(223, 60, 60, 1)',
            isSelected: false,
        },
        {
            code: 'rgba(86, 180, 172, 1)',
            hoverCode: 'rgba(37, 159, 148, 1)',
            isSelected: false,
        },
        {
            code: 'rgba(179, 112, 240, 1)',
            hoverCode: 'rgba(158, 71, 236, 1)',
            isSelected: false,
        },
        {
            code: 'rgba(87, 85, 223, 1)',
            hoverCode: 'rgba(39, 36, 214, 1)',
            isSelected: false,
        },
        {
            code: 'rgba(255, 144, 109, 1)',
            hoverCode: 'rgba(255, 112, 67, 1)',
            isSelected: false,
        },
        {
            code: 'rgba(119, 191, 86, 1)',
            hoverCode: 'rgba(80, 172, 37, 1)',
            isSelected: false,
        },
        {
            code: 'rgba(230, 104, 160, 1)',
            hoverCode: 'rgba(223, 61, 133, 1)',
            isSelected: false,
        },
        {
            code: 'rgba(160, 130, 102, 1)',
            hoverCode: 'rgba(134, 94, 58, 1)',
            isSelected: false,
        },
    ];

    static BAR_PERFORMANCE_COLORS_PALLETE: BarPerformanceColorsPallete[] = [
        {color: 'rgba(170, 170, 170, 1)' },
        {color: 'rgba(218, 218, 218, 1)' }
    ];

    static BY_STATE_COLORS_PALLETE: ByStateColorsPallete[] = [
        { code: '#0B49D1' },
        { code: '#3B73ED' },
        { code: '#6692F1' },
        { code: '#92B1F5' },
        { code: '#BED0F9' },
    ];

}
