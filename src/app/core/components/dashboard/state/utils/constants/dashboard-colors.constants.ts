import {
    MainColorsPallete,
    SecondaryColorsPallete,
} from '../../models/dashboard-color-models/colors-pallete.model';

export class DashboardColors {
    static MAIN_COLORS_PALLETE: MainColorsPallete[] = [
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

    static SECONDARY_COLORS_PALLETE: SecondaryColorsPallete[] = [
        { code: '#92b1f5' },
        { code: '#fbc88b' },
        { code: '#ed9292' },
        { code: '#86c9c3' },
        { code: '#c999f4' },
    ];
}
