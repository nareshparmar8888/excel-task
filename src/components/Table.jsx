import React, { useState } from "react";
import "./table.css";

function Table({ colDefs, data }) {
  const [cols, setCols] = useState(colDefs);
  const [rows, setRows] = useState(data);
  const [dragOver, setDragOver] = useState("");

  const handleDragStart = (e) => {
    const { id } = e.target;

    const idx = cols.indexOf(id);
    e.dataTransfer.setData("colIdx", idx);
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDragEnter = (e) => {
    const { id } = e.target;
    setDragOver(id);
  };

  const handleOnDrop = (e) => {
    const { id } = e.target;
    const droppedColIdx = cols.indexOf(id);
    const draggedColIdx = e.dataTransfer.getData("colIdx");
    const tempCols = [...cols];

    tempCols[draggedColIdx] = cols[droppedColIdx];
    tempCols[droppedColIdx] = cols[draggedColIdx];
    setCols(tempCols);
    console.log("tempCols: ", tempCols);
    setDragOver("");
  };

  return (
    <div className="tableMain">
      <div>
        <ul>
          {cols.map((col) => (
            <li
              id={col}
              key={col}
              draggable
              onDragStart={handleDragStart}
              // dragOver={col === dragOver}
            >
              {col}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              {cols.map((col) => (
                <th>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {Object.entries(row).map(([k, v], idx) => {
                  return (
                    <td key={v} dragOver={cols[idx] === dragOver}>
                      {row[cols[idx]]}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
