/* eslint-disable no-unused-expressions */
import React, { useState } from "react";
import * as XLSX from "xlsx";
import xls from "../assets/xls.png";
import Sidemenu from "./Sidemenu";

function ExcelUpload() {
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [colDefs, setColDefs] = useState();
  const [data, setData] = useState();
  const [horizontalDropTitle, sethorizontalDropTitle] = useState([]);
  const [verticalDropTitle, setverticalDropTitle] = useState([]);

  const importExcel = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = (event) => {
      //parse data
      const bufferArray = event.target.result;
      const workBook = XLSX.read(bufferArray, { type: "buffer" });

      //get first sheet
      const workSheetName = workBook.SheetNames[0];
      const workSheet = workBook.Sheets[workSheetName];
      //convert to array
      const fileData = XLSX.utils.sheet_to_json(workSheet);
      setData(fileData);
      setColDefs(Object.keys(fileData[0]));
    };

    if (file) {
      const fileNameArr = file.name.split(".");

      const extension = fileNameArr[fileNameArr.length - 1];
      if (extension === "xlsx" || extension === "xls") {
        setIsFileUploaded(true);
        reader.readAsArrayBuffer(file);
      } else {
        setIsFileUploaded(false);
        alert("Invalid file input, Select Excel, CSV file");
      }
    } else {
      setData([]);
      setColDefs([]);
    }
  };

  const allowDrop = (ev) => {
    ev.preventDefault();
  };

  const horizontalDrop = (ev) => {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("colIdx");
    let heading = document.getElementById(colDefs[data]).textContent;

    if (!horizontalDropTitle.includes(heading)) {
      sethorizontalDropTitle([...horizontalDropTitle, heading]);
    }
  };
  const VeticalDrop = (ev) => {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("colIdx");
    let heading = document.getElementById(colDefs[data]).textContent;

    if (!verticalDropTitle.includes(heading)) {
      setverticalDropTitle([...verticalDropTitle, heading]);
    }
  };

  return (
    <>
      <div className="menu">{data && <Sidemenu colDefs={colDefs} />}</div>
      <div className="section">
        <div className="upload ">
          <div className="drop_box">
            {isFileUploaded && (
              <img src={xls} alt="Excel File" height={50} width={50} />
            )}
            <input type="file" onChange={(e) => importExcel(e)} />
          </div>
        </div>

        {data && (
          <div className="main">
            <div
              className="second"
              onDrop={horizontalDrop}
              onDragOver={allowDrop}
            >
              Horizontal Table
              <table>
                <tr>
                  {horizontalDropTitle &&
                    horizontalDropTitle.length > 0 &&
                    horizontalDropTitle.map((col) => <th>{col}</th>)}
                </tr>

                {data &&
                  data.length > 0 &&
                  data.map((row) => (
                    <tr>
                      {Object.entries(row).map(([k, v], idx) => {
                        return row[horizontalDropTitle[idx]] ? (
                          <td key={v}>{row[horizontalDropTitle[idx]]}</td>
                        ) : null;
                      })}
                    </tr>
                  ))}
              </table>
            </div>
            <div onDrop={VeticalDrop} onDragOver={allowDrop}>
              vertical Table
              <div className="third">
                <table>
                  {verticalDropTitle &&
                    verticalDropTitle.length > 0 &&
                    verticalDropTitle.map((col) => (
                      <tr>
                        <th>{col}</th>
                        {data &&
                          data.length > 0 &&
                          data.map((row) => {
                            return Object.entries(row).map(([k, v], idx) => {
                              debugger;
                              return row[verticalDropTitle[idx]] &&
                                col === k ? (
                                <td key={v}>{row[verticalDropTitle[idx]]}</td>
                              ) : null;
                            });
                          })}
                      </tr>
                    ))}
                </table>
              </div>
              <div>
                <h1>chart</h1>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ExcelUpload;
