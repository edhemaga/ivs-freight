import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'detailActiveItem',
})
export class DetailsActiveItemPipe implements PipeTransform {
  transform(options: any[], template?: string): any {
    const option = options.find((item) => item.active);
    switch (template) {
      default: {
        return {
          name: option?.name,
          svg: option?.svg
            ? `assets/svg/${option?.folder}/${option?.svg}`
            : null,
          folder: option?.folder,
        };
      }
    }
  }
}
