import { ThousandPipe } from './thousand-formater.pipe';

describe('ThousandPipePipe', () => {
    it('create an instance', () => {
        const pipe = new ThousandPipe();
        expect(pipe).toBeTruthy();
    });
});
