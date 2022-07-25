import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";

import ExcelUpload from "./components/ExcelUpload";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <ExcelUpload />
      </div>
    </DndProvider>
  );
}

export default App;
