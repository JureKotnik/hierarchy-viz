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

  private searchIdsSubject = new BehaviorSubject<string[]>([]);
  searchIds$ = this.searchIdsSubject.asObservable();

  search(term: string) {
    if (!term.trim()) {
      this.searchIdsSubject.next([]);
      return;
    }
    
    const matches: string[] = [];
    this.performSearch(this.treeSubject.value, term.toLowerCase(), matches);
    this.searchIdsSubject.next(matches);
  }

  private performSearch(nodes: TreeNode[], term: string, matches: string[]) {
    for (const node of nodes) {
      if (node.name.toLowerCase().includes(term)) {
        matches.push(node.id);
      }
      if (node.children) {
        this.performSearch(node.children, term, matches);
      }
    }
  }
}