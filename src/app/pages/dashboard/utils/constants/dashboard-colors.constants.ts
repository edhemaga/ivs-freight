import {
    ByStateColorsPallete,
    PerformanceColorsPallete,
    TopRatedMainColorsPallete,
    TopRatedSecondaryColorsPallete,
} from '../../models/colors-pallete.model';

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

    static TOP_RATED_SECONDARY_COLORS_PALLETE: TopRatedSecondaryColorsPallete[] =
        [
            { code: '#92b1f5' },
            { code: '#fbc88b' },
            { code: '#ed9292' },
            { code: '#86c9c3' },
            { code: '#c999f4' },
        ];

    static PERFORMANCE_COLORS_PALLETE: PerformanceColorsPallete[] = [
        { code: '#6692f1', hoverCode: '#3B73ED', isSelected: false },
        { code: '#fab15c', hoverCode: '#F89B2E', isSelected: false },
        { code: '#e66767', hoverCode: '#DF3C3C', isSelected: false },
        { code: '#56b4ac', hoverCode: '#259F94', isSelected: false },
        { code: '#b370f0', hoverCode: '#9E47EC', isSelected: false },
        { code: '#5755df', hoverCode: '#2724D6', isSelected: false },
        { code: '#ff906d', hoverCode: '#FF7043', isSelected: false },
        { code: '#77bf56', hoverCode: '#50AC25', isSelected: false },
        { code: '#e668a0', hoverCode: '#DF3D85', isSelected: false },
        { code: '#a08266', hoverCode: '#865E3A', isSelected: false },
    ];

    static BY_STATE_COLORS_PALLETE: ByStateColorsPallete[] = [
        { code: '#0B49D1' },
        { code: '#3B73ED' },
        { code: '#6692F1' },
        { code: '#92B1F5' },
        { code: '#BED0F9' },
    ];
}
