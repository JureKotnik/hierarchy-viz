import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TreeNode } from '../../models/tree-node.model';
import { TreeDataService } from '../../services/tree-data.service';

@Component({
  selector: 'app-node',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit, OnDestroy {
  @Input() node!: TreeNode;

  isHighlighted: boolean = false;
  private searchSub: Subscription = new Subscription();

  constructor(private treeService: TreeDataService) {}

  ngOnInit(): void {
    this.searchSub = this.treeService.searchIds$.subscribe((foundIds) => {
      this.isHighlighted = foundIds.includes(this.node.id);
      
      if (this.isHighlighted) {
        this.expandParents();
      }
    });
  }

  toggle(): void {
    if (this.node.children && this.node.children.length) {
      this.node.isExpanded = !this.node.isExpanded;
    }
  }

  addChild(event: Event): void {
    event.stopPropagation(); 
    
    const name = prompt('Enter name for the new child node:');
    if (name) {
      this.treeService.addNode(this.node.id, name);
      this.node.isExpanded = true;
    }
  }

  removeSelf(event: Event): void {
    event.stopPropagation(); 
    
    const confirmDelete = confirm(`Are you sure you want to delete "${this.node.name}" and all its children?`);
    if (confirmDelete) {
      this.treeService.deleteNode(this.node.id);
    }
  }

  private expandParents(): void {
    this.node.isExpanded = true;
  }

  ngOnDestroy(): void {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
    }
  }
}