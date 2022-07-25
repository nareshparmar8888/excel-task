/* eslint-disable no-unused-expressions */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import xls from "../assets/xls.png";
import Table from "./Table";

function ExcelUpload() {
  const [isFileUploaded, setisFileUploaded] = useState(false);
  const [colDefs, setColDefs] = useState();
  const [data, setData] = useState();
  const [dropDataTitle, setdropDataTitle] = useState([]);
  const [dropData, setDropData] = useState();

  // const convertToJson = (headers, data) => {
  //   const rows = [];
  //   data.forEach((row, i) => {
  //     let rowData = {};
  //     row.forEach((element, index) => {
  //       rowData[headers[index]] = element;
  //     });
  //     rows.push(rowData);
  //   });
  //   setisFileUploaded(true);
  //   return rows;
  // };

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
      console.log(" File Data => ", fileData);
      setData(fileData);
      setColDefs(Object.keys(fileData[0]));
      // const headers = fileData[0];
      // const heads = headers.map((head, index) => ({
      //   field: head,
      // }));
      // setColDefs(heads);

      //removing header
      // fileData.splice(0, 1);

      // setData(convertToJson(headers, fileData));
    };

    if (file) {
      const fileNameArr = file.name.split(".");

      const extension = fileNameArr[fileNameArr.length - 1];
      if (extension == "xlsx" || extension == "xls") {
        reader.readAsArrayBuffer(file);
      } else {
        setisFileUploaded(false);
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

  const drop = (ev) => {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("colIdx");
    console.log("data => ", data);
    setdropDataTitle([
      ...dropDataTitle,
      document.getElementById(colDefs[data]).textContent,
    ]);
  };

  const chartDrop = (ev) => {
    ev.preventDefault();
    let d = ev.dataTransfer.getData("colIdx");
    let newArr = dropDataTitle || [];
    for (let i = 0; i < data.length; i++) {
      if (dropDataTitle.length === data.length) {
        newArr[i][colDefs[d]] = data[i][colDefs[d]]
      } else {
        newArr.push({
          [colDefs[d]]: data[i][colDefs[d]]
        })
      }
    }
    setdropDataTitle(newArr);
  };

  // useEffect(() => {
  //   if (dropDataTitle) {
  //     const filterDropDataTitle = data.map((row) =>
  //       Object.entries(row).filter(([k, v], index) => k === dropDataTitle)
  //     );
  //     setDropData(filterDropDataTitle);
  //   }
  // }, [data, dropDataTitle]);

  return (
    <div className="main">
      <div>
        <div>
          {isFileUploaded && (
            <img src={xls} alt="Excel File" height={50} width={50} />
          )}
        </div>
        <input type="file" onChange={(e) => importExcel(e)} />
        <div>{data && <Table colDefs={colDefs} data={data} />}</div>
      </div>

      <div className="second" onDrop={drop} onDragOver={allowDrop}>
        drop
        {dropDataTitle && data && (
          <table>
            <tr>
              {dropDataTitle.map((col) => (
                <th>{col}</th>
              ))}

              {data.map((row) => (
                <>
                  {Object.entries(row).map(([k, v], idx) => {
                    return <td key={v}>{row[dropDataTitle[idx]]}</td>;
                  })}
                </>
              ))}
            </tr>
          </table>
        )}
      </div>
      <div className="third" onDrop={chartDrop} onDragOver={allowDrop}>
        <h1>chart</h1>
      </div>
    </div>
  );
}

export default ExcelUpload;
