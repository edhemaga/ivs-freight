import { TestBed } from '@angular/core/testing';

import { TemplateManagerService } from './template-manager.service';

describe('TemplateManagerService', () => {
  let service: TemplateManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
