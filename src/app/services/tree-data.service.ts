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
        { 
          id: '2', 
          name: 'CTO', 
          isExpanded: true,
          children: [
            { id: '4', name: 'Frontend Lead', children: [] },
            { id: '5', name: 'Backend Lead', children: [] }
          ] 
        },
        { 
          id: '3', 
          name: 'CFO', 
          children: [
            { id: '6', name: 'Accountant', children: [] }
          ] 
        }
      ]
    }
  ];

  private treeSubject = new BehaviorSubject<TreeNode[]>(this.initialData);
  tree$ = this.treeSubject.asObservable();

  private searchIdsSubject = new BehaviorSubject<string[]>([]);
  searchIds$ = this.searchIdsSubject.asObservable();

  constructor() { }

  addNode(parentId: string, name: string): void {
    const currentTree = this.treeSubject.value;
    
    const added = this.findAndAdd(currentTree, parentId, name);
    
    if (added) {
      this.treeSubject.next([...currentTree]);
    }
  }

  deleteNode(nodeId: string): void {
    const currentTree = this.treeSubject.value;
    const updatedTree = this.recursiveDelete(currentTree, nodeId);
    this.treeSubject.next(updatedTree);
  }

  search(term: string): void {
    if (!term || term.trim() === '') {
      this.searchIdsSubject.next([]); 
      return;
    }

    const matches: string[] = [];
    this.performSearch(this.treeSubject.value, term.toLowerCase(), matches);
    this.searchIdsSubject.next(matches);
  }

  private findAndAdd(nodes: TreeNode[], parentId: string, name: string): boolean {
    for (const node of nodes) {
      if (node.id === parentId) {
        if (!node.children) node.children = [];
        
        const newNode: TreeNode = {
          id: Date.now().toString(),
          name: name,
          children: [],
          isExpanded: false
        };
        
        node.children.push(newNode);
        return true;
      }

      if (node.children && node.children.length > 0) {
        const found = this.findAndAdd(node.children, parentId, name);
        if (found) return true;
      }
    }
    return false;
  }

  private recursiveDelete(nodes: TreeNode[], idToDelete: string): TreeNode[] {
    return nodes
      .filter(node => node.id !== idToDelete)
      .map(node => { 
        if (node.children) {
          return { ...node, children: this.recursiveDelete(node.children, idToDelete) };
        }
        return node;
      });
  }

  private performSearch(nodes: TreeNode[], term: string, matches: string[]): void {
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