import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
<<<<<<< HEAD
<<<<<<< HEAD
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
=======
=======
>>>>>>> 7e9cd6f3ec72f4c6c9b10c96344e870c467e8483
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
<<<<<<< HEAD
>>>>>>> 9afab3bdb0bf6ed2ac14a234379da010344bc7f2
=======
>>>>>>> 7e9cd6f3ec72f4c6c9b10c96344e870c467e8483
    expect(service).toBeTruthy();
  });
});
