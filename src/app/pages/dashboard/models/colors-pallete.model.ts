export interface TopRatedMainColorsPalette {
    color: string;
    code: string;
}

export interface TopRatedSecondaryColorsPallete {
    code: string;
}

export interface LinePerformanceColorsPallete {
    code: string;
    hoverCode: string;
    isSelected: boolean;
}

export interface BarPerformanceColorsPallete {
    color: string;
}

export interface ByStateColorsPallete extends TopRatedSecondaryColorsPallete { }
