import { AutocompleteSearchLayer } from '@ca-shared/models/autocomplete-search-layer.model';

export interface AddressProperties {
    query: string;
    searchLayers: AutocompleteSearchLayer[];
    closedBorder: boolean;
}
