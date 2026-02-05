import { TestBed } from '@angular/core/testing';
import { TreeDataService } from './tree-data.service';

describe('TreeDataService', () => {
  let service: TreeDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreeDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a child node correctly', () => {
    const initialTree = service['treeSubject'].value;
    const rootId = initialTree[0].id;
    
    service.addNode(rootId, 'Test Child');

    const updatedTree = service['treeSubject'].value;
    const addedChild = updatedTree[0].children?.find(c => c.name === 'Test Child');
    
    expect(addedChild).toBeDefined();
    expect(addedChild?.name).toBe('Test Child');
  });

  it('should delete a node recursively', () => {
    const rootId = service['treeSubject'].value[0].id;
    service.addNode(rootId, 'Node To Delete');
    
    const treeWithNode = service['treeSubject'].value;
    const nodeToDelete = treeWithNode[0].children?.find(c => c.name === 'Node To Delete');
    const deleteId = nodeToDelete!.id;

    service.deleteNode(deleteId);

    const finalTree = service['treeSubject'].value;
    const missingNode = finalTree[0].children?.find(c => c.id === deleteId);
    
    expect(missingNode).toBeUndefined();
  });
});