import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TreeNode } from '../models/tree-node.model';

@Injectable({
  providedIn: 'root'
})
export class TreeDataService {
  private initialData: TreeNode[] = [
    {
      id: '1',
      name: 'CEO',
      isExpanded: true,
      children: [
        { id: '2', name: 'CTO', children: [{ id: '4', name: 'Dev Team Lead' }] },
        { id: '3', name: 'CFO', children: [{ id: '5', name: 'Accounting' }] }
      ]
    }
  ];

  private treeSubject = new BehaviorSubject<TreeNode[]>(this.initialData);
  tree$ = this.treeSubject.asObservable();

  getTree() {
    return this.treeSubject.value;
  }
}