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

  /**
 * Recursively searches for a parent node by ID and appends a new child.
 * @param parentId - The UUID of the parent node
 * @param name - The display name for the new node
 */

  addNode(parentId: string, name: string): void {
    const currentTree = this.treeSubject.value;
    
    const added = this.findAndAdd(currentTree, parentId, name);
    
    if (added) {
      this.treeSubject.next([...currentTree]);
    }
  }

  /**
 * Performs a recursive filter operation to remove a node and its descendants from the tree.
 * Implements an immutable update pattern for OnPush performance.
 * @param nodeId - The UUID of the node to remove
 */

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

  downloadJSON(): void {
    const data = this.treeSubject.value;
    const jsonString = JSON.stringify(data, null, 2);
    this.triggerDownload(jsonString, 'hierarchy-data.json', 'application/json');
  }

  /**
 * Serializes the current tree state into an XML string.
 * Uses recursive traversal to build the XML DOM structure.
 */

  downloadXML(): void {
    const data = this.treeSubject.value;
    let xmlString = '<?xml version="1.0" encoding="UTF-8"?>\n<hierarchy>\n';
    xmlString += this.nodesToXml(data); 
    xmlString += '</hierarchy>';
    this.triggerDownload(xmlString, 'hierarchy-data.xml', 'application/xml');
  }

  importXML(xmlContent: string): void {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
      const hierarchyNode = xmlDoc.getElementsByTagName('hierarchy')[0];
      if (!hierarchyNode) throw new Error('Invalid XML: Missing <hierarchy> tag');
      const newTree: TreeNode[] = this.xmlToNodes(Array.from(hierarchyNode.children));    
      this.treeSubject.next(newTree);
      alert('XML Imported Successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to parse XML. Please check the format.');
    }
  }

  private nodesToXml(nodes: TreeNode[]): string {
    let xml = '';
    for (const node of nodes) {
      xml += `  <node id="${node.id}" name="${node.name}">\n`;  
      if (node.children && node.children.length > 0) {
        xml += this.nodesToXml(node.children);
      }
      xml += `  </node>\n`;
    }
    return xml;
  }

  private xmlToNodes(xmlElements: Element[]): TreeNode[] {
    const nodes: TreeNode[] = [];
    
    for (const el of xmlElements) {
      if (el.tagName === 'node') {
        const newNode: TreeNode = {
          id: el.getAttribute('id') || Date.now().toString(),
          name: el.getAttribute('name') || 'Unknown',
          children: [],
          isExpanded: true
        };

        if (el.children.length > 0) {
          newNode.children = this.xmlToNodes(Array.from(el.children));
        }

        nodes.push(newNode);
      }
    }
    return nodes;
  }

  private triggerDownload(content: string, fileName: string, contentType: string): void {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

}