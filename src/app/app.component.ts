import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { NodeComponent } from './components/node/node.component';
import { TreeDataService } from './services/tree-data.service';
import { TreeNode } from './models/tree-node.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NodeComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  treeData$!: Observable<TreeNode[]>;

  constructor(private treeService: TreeDataService) {}

  ngOnInit(): void {
    this.treeData$ = this.treeService.tree$;
  }
  onSearch(term: string): void {
    this.treeService.search(term);
  }
  downloadJson() {
  this.treeService.downloadJSON();
}

downloadXml() {
  this.treeService.downloadXML();
}

onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const xmlContent = e.target.result;
      this.treeService.importXML(xmlContent);
    };
    reader.readAsText(file);
  }
 }
}