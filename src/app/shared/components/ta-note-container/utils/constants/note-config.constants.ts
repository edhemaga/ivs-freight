import { NoteActiveOptions } from '../../models/note-active-options.model';
import { NoteColors } from '../../models/note-colors.model';

export class NoteConfigConstants {
    static NoteDarkColors: NoteColors[] = [
        {
            color: 'rgb(218, 218, 218)',
            name: 'Gray',
        },
        {
            color: 'rgb(102, 146, 241)',
            name: 'Blue',
        },
        {
            color: 'rgb(86, 180, 172)',
            name: 'Green',
        },
        {
            color: 'rgb(230, 103, 103)',
            name: 'Red',
        },
        {
            color: 'rgb(250, 177, 92)',
            name: 'Yellow',
        },
        {
            color: 'rgb(179, 112, 240)',
            name: 'Purple',
        },
    ];

    static NoteLightColors: NoteColors[] = [
        {
            color: 'rgb(66, 66, 66)',
            name: 'Black',
        },
        {
            color: 'rgb(59, 115, 237)',
            name: 'Blue',
        },
        {
            color: 'rgb(37, 159, 148)',
            name: 'Green',
        },
        {
            color: 'rgb(223, 60, 60)',
            name: 'Red',
        },
        {
            color: 'rgb(248, 155, 46)',
            name: 'Yellow',
        },
        {
            color: 'rgb(158, 71, 236)',
            name: 'Purple',
        },
    ];

    static NoteActiveOptions: NoteActiveOptions = {
        bold: false,
        italic: false,
        foreColor: false,
        underline: false,
    };
}
