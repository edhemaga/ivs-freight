import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ContentObserver} from '@angular/cdk/observers';

import {gsap, Linear, MorphSVGPlugin, TimelineMax} from 'gsap/all';

gsap.registerPlugin(MorphSVGPlugin, TimelineMax);

@Component({
  selector: 'app-svg-morph',
  templateUrl: './svg-morph.component.html',
  styleUrls: ['./svg-morph.component.scss']
})
export class SvgMorphComponent implements OnInit {
  @Input() svgClass: string;
  @ViewChild('morphHolder') morphHolder: ElementRef;
  timeline = new TimelineMax({repeat: -1});
  prevNodeList: unknown;
  startedSvgCreate = false;
  previewMorphImgs = false;

  constructor(private el: ElementRef, private observer: ContentObserver) {
  }

  ngAfterViewInit() {
    if (!this.prevNodeList) {
      this.prevNodeList = this.morphHolder.nativeElement.querySelector('.svg_morph_imgs').querySelector('svg');
    }

    this.observer.observe(this.morphHolder.nativeElement.querySelector('.svg_morph_imgs'))
      .subscribe((event: MutationRecord[]) => {
        if (this.prevNodeList) {
          this.startedSvgCreate = true;

          const svg_icon = document.createElement('svg-icon');
          const svg: any = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          const path = this.morphHolder.nativeElement.querySelector('.svg_morph_imgs').querySelectorAll('path');

          svg.setAttribute('class', `morhp_picture`);
          svg_icon.setAttribute('class', this.svgClass);
          svg.appendChild(this.getNode('g', {class: 'shape_img'}));

          const new_image = Array.prototype.slice.call(path);
          const second_image = Array.prototype.slice.call((this.prevNodeList as Element).querySelectorAll('path'));
          for (let i = new_image.length - 1; i > -1; i--) {

            const atrInd = (second_image.length - 1) - i;

            if (second_image[atrInd]) {
              second_image[atrInd].setAttribute('id', `_${i + 1}b`);

              svg.querySelector('.shape_img').appendChild(second_image[atrInd]);
            } else {
              svg.querySelector('.shape_img').appendChild(this.getNode('path', {
                id: `_${i + 1}b`,
                d: 'M175,100a75,75,0,1,1-75-75A75,75,0,0,1,175,100Z',
                fill: '#fff'
              }));
            }
          }

          const viewBox = this.morphHolder.nativeElement.querySelector('.svg_morph_imgs').querySelector('svg').getAttribute('viewBox');
          svg.setAttribute('viewBox', viewBox);
          svg_icon.appendChild(svg);
          this.morphHolder.nativeElement.querySelector('.new_svg_morph').innerHTML = '';
          this.morphHolder.nativeElement.querySelector('.new_svg_morph').appendChild(svg_icon);
          this.crateSvgMorph(new_image);

          this.prevNodeList = this.morphHolder.nativeElement.querySelector('.svg_morph_imgs').querySelector('svg');

          this.previewMorphImgs = true;
        }
      });
  }

  ngOnInit(): void {
  }

  getNode(n, v) {
    n = document.createElementNS('http://www.w3.org/2000/svg', n);
    for (const p in v) {
      n.setAttributeNS(null, p, v[p]);
    }
    return n;
  }

  crateSvgMorph(items) {
    let new_img = this.morphHolder.nativeElement.querySelectorAll('.shape_img > path'),
      paths = new_img.length,
      P = paths,
      end,
      pathArr = [];

    while (P--) {
      const p = paths - P;
      const transformArray = items[paths - p] && items[paths - p].getAttribute('transform') ?
        items[paths - p].getAttribute('transform').split(/[()]+/).filter(function (e) {
          return e;
        })
        : ['0', '0'];

      const transforms = items[paths - p] && items[paths - p].getAttribute('transform') ? transformArray[1].split(' ') : [null, null];
      end = {
        morphSVG: items[paths - p].getAttribute('d'),
        x: transforms[0],
        y: transforms[1] ? transforms[1] : transforms[0] && !transforms[1] ? 0 : null,
        ease: Linear.easeIn
      };

      end.fill = items[paths - p].getAttribute('fill');
      end.opacity = items[paths - p].getAttribute('opacity') ? items[paths - p].getAttribute('opacity') : 1;

      if (items[paths - p].getAttribute('class')) {
        new_img[paths - p].setAttribute('class', items[paths - p].getAttribute('class'));
      }

      const morphDur = 0.4;
      pathArr.push(
        new TimelineMax({
          delay: 0,
          repeat: 0,
          yoyo: false
        })
      );

      pathArr[p - 1].to(new_img[paths - p], morphDur, end, 0);
    }
  }

}
