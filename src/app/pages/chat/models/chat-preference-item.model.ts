export interface ChatPreferenceItem {
    id: string;
    name: string;
    value?: boolean;
    items?: ChatPreferenceItem[];
    isHighlighted: boolean;
    isExpandable: boolean;
    borderTop?: boolean;
    borderBottom?: boolean;
    icon?: string;
    isRadioButton?: boolean;
    isCheckmark?: boolean;
    toggleValue?(): void;
    toggleChildValue?(): void;
}
