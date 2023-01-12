import { Component, ElementRef, Input, Renderer2 } from '@angular/core';

@Component({
    selector: 'app-load-modal-hazardous',
    templateUrl: './load-modal-hazardous.component.html',
    styleUrls: ['./load-modal-hazardous.component.scss'],
})
export class LoadModalHazardousComponent {
    @Input() originHeight: number;
    public hazardous_materials_section = [
        {
            type: '(a)',
            title: 'This section applies to materials which meet one or more of the hazard classes defined in this subchapter and are:',
            subType: [
                {
                    type: '(1)',
                    title: 'In packages that must be labeled or placarded in accordance with part 172 of this subchapter;',
                },
                {
                    type: '(2)',
                    title: 'In a compartment within a multi-compartmented cargo tank subject to the restrictions in § 173.33 of this subchapter; or',
                },
                {
                    type: '(3)',
                    title: 'In a portable tank loaded in a transport vehicle or freight container.',
                },
            ],
        },
        {
            type: '(b)',
            title: 'When a transport vehicle is to be transported by vessel, other than a ferry vessel, hazardous materials on or within that vehicle must be stowed and segregated in accordance with § 176.83(b) of this subchapter.',
            subType: [],
        },
        {
            type: '(c)',
            title: 'In addition to the provisions of paragraph (d) of this section and except as provided in § 173.12(e) of this subchapter, cyanides, cyanide mixtures or solutions may not be stored, loaded and transported with acids if a mixture of the materials would generate hydrogen cyanide; Division 4.2 materials may not be stored, loaded and transported with Class 8 liquids; and Division 6.1 Packing Group I, Hazard Zone A material may not be stored, loaded and transported with Class 3 material, Class 8 liquids, and Division 4.1, 4.2, 4.3, 5.1 or 5.2 materials.',
            subType: [],
        },
        {
            type: '(d)',
            title: 'Except as otherwise provided in this subchapter, hazardous materials must be stored, loaded or transported in accordance with the following table and other provisions of this section:',
            subType: [],
        },
    ];

    public segregation_section_1 = [
        {
            type: '(e)',
            title: 'Instructions for using the segregation table for hazardous materials are as follows:',
            subType: [],
        },
    ];

    public segregation_section_2 = [
        {
            type: '(1)',
            tableContext: 'ic_hazardous-green-field.svg',
            title: 'The absence of any hazard class or division or a blank space in the Table indicates that no restrictions apply.',
        },
        {
            type: '(2)',
            tableContext: 'ic_hazardous-x-field.svg',
            title: 'The letter “X” in the Table indicates that these materials may not be loaded, transported, or stored together in the same transport vehicle or storage facility during the course of transportation.',
        },
        {
            type: '(3)',
            tableContext: 'ic_hazardous-yellow-circle-field.svg',
            title: 'The letter “O” in the Table indicates that these materials may not be loaded, transported, or stored together in the same transport vehicle or storage facility during the course of transportation unless separated in a manner that, in the event of leakage from packages under conditions normally incident to transportation, commingling of hazardous materials would not occur.  Notwithstanding the methods of separation employed, Class 8 (corrosive) liquids may not be loaded above or adjacent to Class 4 (flammable) or Class 5 (oxidizing) materials; except that shippers may load truckload shipments of such materials together when it is known that the mixture of contents would not cause a fire or a dangerous evolution of heat or gas.',
        },
        {
            type: '(4)',
            tableContext: 'ic_hazardous-yellow-star-field.svg',
            title: 'The “*”in the Table indicates that segregation among different Class 1 (explosive) materials is governed by the compatibility table in paragraph (f) of this section. See right table.',
        },
        {
            type: '(5)',
            tableContext: 'ic_hazardous-a-field.svg',
            title: 'The note “A” in the third column of the Table means that, notwithstanding the requirements of the letter “X” , ammonium nitrate (UN 1942) and ammonium nitrate fertilizer may be loaded or stored with Division 1.1 (explosive) or Division 1.5 materials.',
        },
        {
            type: '(6)',
            tableContext: null,
            title: 'When the §172.101 Table or §172.402 of this subchapter requires a package to bear a subsidiary hazard label, segregation appropriate to the subsidiary hazard must be applied when that segregation is more restrictive than that required by the primary hazard. However, hazardous materials of the same class may be stowed together without regard to segregation required for any secondary hazard if the materials are not capable of reacting dangerously with each other and causing combustion or dangerous evolution of heat, evolution of flammable, poisonous, or asphyxiant gases, or formation of corrosive or unstable materials.',
        },
    ];

    public segregation_section_3 = [
        {
            type: '(d)',
            title: 'Class 1 (explosive) materials shall not be loaded, transported, or stored together, except as provided in this section, and in accordance with the following table:',
            subType: [],
        },
    ];

    public additional_note_section = [
        {
            type: 'ic_hazardous-p-field.svg',
            title: 'P Packages with POISON or POISON INHALATION HAZARD labels, or a POISON label displaying “PG III,” or “PG III” marked next to a POISON label may not be transported with foodstuffs, feed or any other edible material, intended for humans or animals. For exceptions see 49 CFR §177.841(e).',
            subType: [],
        },
    ];

    public compatibility_section_1 = [
        {
            type: '(e)',
            title: 'Instructions for using the compatibility table for Class 1 (explosive) materials are as follows:',
            subType: [],
        },
    ];

    public compatibility_section_2 = [
        {
            type: '(1)',
            tableContextSvg: 'ic_hazardous-green-field.svg',
            tableContextText: '',
            title: 'A blank space in the table indicates that no restrictions apply.',
        },
        {
            type: '(2)',
            tableContextSvg: 'ic_hazardous-x-field.svg',
            tableContextText: '',
            title: 'The letter “X” in the table indicates that explosives of different compatibility groups may not be carried on the same transport vehicle.',
        },
        {
            type: '(3)',
            tableContextSvg: '',
            tableContextText: '',
            title: 'The numbers in the table mean the following:',
        },
        {
            type: '(I)',
            tableContextSvg: '',
            tableContextText: '1',
            title: '"1" means an explosive from compatibility group L shall only be carried on the same transport vehicle with an identical explosive.',
        },
        {
            type: '(II)',
            tableContextSvg: '',
            tableContextText: '2',
            title: '"2" means any combination of explosives from compatibility groups C, D, or E is assigned to compatibility group E.',
        },
        {
            type: '(III)',
            tableContextSvg: '',
            tableContextText: '3',
            title: '"3" means any combination of explosives from compatibility groups C, D, or E with those in compatibility group N is assigned to compatibility group D.',
        },
        {
            type: '(IV)',
            tableContextSvg: '',
            tableContextText: '4',
            title: '"4" means see §177.835(g) when transporting detonators.',
        },
        {
            type: '(V)',
            tableContextSvg: '',
            tableContextText: '5',
            title: '"5" means Division 1.4S fireworks may not be loaded on the same transport vehicle with Division 1.1 or 1.2 (explosive) materials.',
        },
        {
            type: '(VI)',
            tableContextSvg: '',
            tableContextText: '6',
            title: '"6" means explosive articles in compatibility group G, other than fireworks and those requiring special handling, may be loaded, transported and stored with other explosive articles of compatibility groups C, D and E, provided that explosive substances (such as those not contained in articles) are not carried in the same transport vehicle.',
        },
        {
            type: '(h)',
            tableContextSvg: '',
            tableContextText: '',
            title: 'Except as provided in paragraph (i) of this section, explosives of the same compatibility group but of different divisions may be transported together provided that the whole shipment is transported as though its entire contents were of the lower numerical division (i.e., Division 1.1 being lower than Division 1.2). For example, a mixed shipment of Division 1.2 (explosive) materials and Division 1.4 (explosive) materials, both of compatibility group D, must be transported as Division 1.2 (explosive) materials.',
        },
        {
            type: '(i)',
            tableContextSvg: '',
            tableContextText: '',
            title: 'When Division 1.5 materials, compatibility group D, are transported in the same freight container as Division 1.2 (explosive)  materials, compatibility group D, the shipment must be transported as Division 1.1 (explosive) materials, compatibility group D.',
        },
    ];

    constructor(private renderer: Renderer2, private element: ElementRef) {}

    ngOnChanges() {
        if (this.originHeight) {
            this.renderer.setStyle(
                this.element.nativeElement,
                'height',
                `${this.originHeight}px`
            );

            console.log('child height: ', this.element.nativeElement.height);
        }
    }

    public trackByIdentity = (index: number, item: any): number => item?.id;
}
