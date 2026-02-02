import { Component, Input } from '@angular/core';
import { TreeNode } from '../../models/tree-node.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-node',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent {
  @Input() node!: TreeNode;

  toggle() {
    this.node.isExpanded = !this.node.isExpanded;
  }
}