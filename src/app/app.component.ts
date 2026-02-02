import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NodeComponent } from "./components/node/node.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NodeComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class App {
  protected readonly title = signal('hierarchy-viz');
}
