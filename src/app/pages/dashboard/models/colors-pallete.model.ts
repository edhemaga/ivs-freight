export interface TopRatedMainColorsPallete {
    color: string;
    code: string;
}

export interface TopRatedSecondaryColorsPallete {
    code: string;
}

export interface PerformanceColorsPallete {
    code: string;
    hoverCode: string;
    isSelected: boolean;
}

export interface ByStateColorsPallete extends TopRatedSecondaryColorsPallete {}
