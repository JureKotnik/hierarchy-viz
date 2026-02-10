# HierarchyViz: Recursive Data Visualizer

An enterprise-grade **Angular 19** application designed to visualize, manipulate, and serialize complex hierarchical data structures. This project demonstrates strict TypeScript typing, recursive algorithms, and reactive state management.

## 🎯 Technical Showcase
This project was built to demonstrate proficiency in:
- **Angular 2+ (v19):** Standalone components, Signals, and Directives.
- **Algorithms & Data Structures:**
  - **Recursive Traversal:** Custom recursive components for infinite nesting.
  - **Depth-First Search (DFS):** Implemented for the node search/filtering system.
  - **Tree Manipulation:** Recursive deletion algorithms ensuring memory safety.
- **Data Serialization:** - Manual **XML Parsing** using DOM traversal (no external libraries).
  - JSON Import/Export.
- **RxJS & State Management:** `BehaviorSubject` for reactive data flow (Singleton Service pattern).
- **Quality Assurance:** Unit testing with Jasmine/Karma.

## 🚀 Features
1.  **Dynamic Tree Management:** Add, edit, and recursively delete nodes.
2.  **Search System:** Real-time filtering with visual highlighting.
3.  **Interoperability:** seamless conversion between JSON and XML formats.
4.  **Responsive UI:** Mobile-friendly toolbar and layout.

## 🛠️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/jurekotnik/hierarchy-viz.git](https://github.com/jurekotnik/hierarchy-viz.git)
    cd hierarchy-viz
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    ng serve
    ```
    Navigate to `http://localhost:4200/`.

4.  **Run Unit Tests**
    ```bash
    ng test
    ```

## 📂 Project Structure
- `src/app/models/tree-node.model.ts`: Recursive interface definition.
- `src/app/services/tree-data.service.ts`: Core logic (DFS, XML parsing, State).
- `src/app/components/node`: The recursive UI component.

---
*Created by Jure Kotnik*