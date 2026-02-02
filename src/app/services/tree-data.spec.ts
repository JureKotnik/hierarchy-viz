import { TestBed } from '@angular/core/testing';

import { TreeData } from './tree-data';

describe('TreeData', () => {
  let service: TreeData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreeData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
