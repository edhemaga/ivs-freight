import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'detailActiveItem',
    standalone: true,
})
export class DetailsActiveItemPipe implements PipeTransform {
    transform<
        T extends {
            active?: boolean;
            name?: string;
            svg?: string;
            folder?: string;
        },
    >(options: T[]): { name?: string; svg?: string; folder?: string } {
        const { name, svg, folder } = options?.find((item) => item.active);

        return {
            name,
            svg: svg ? `assets/svg/${folder}/${svg}` : null,
            folder,
        };
    }
}
