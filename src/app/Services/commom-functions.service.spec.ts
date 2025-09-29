import { TestBed } from '@angular/core/testing';

import { CommomFunctionsService } from './commom-functions.service';

describe('CommomFunctionsService', () => {
  let service: CommomFunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommomFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
