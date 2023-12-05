'use client'

import React, { useEffect, useState } from "react";
import axios from "axios";
import FileSaver from "file-saver";
import { read, utils, writeFile } from 'xlsx';

const ExportCSV = ({ csvData, fileName, wscols }: any) => {
  // ******** XLSX with object key as header *************
  // const fileType =
  //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  // const fileExtension = ".xlsx";

  // const exportToCSV = (csvData, fileName) => {
  //   const ws = XLSX.utils.json_to_sheet(csvData);
  //   const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  //   const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  //   const data = new Blob([excelBuffer], { type: fileType });
  //   FileSaver.saveAs(data, fileName + fileExtension);
  // };

  // ******** XLSX with new header *************
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const Heading = [
    {
      createdAt: "Thời gian",
      newsCategory: "Mục tin",
      title: "Tên bài",
      hightlight: "Điểm nổi bật",
      content: "Nội dung"
    }
  ];

  const exportToCSV = (csvData: any, fileName: any, wscols: any) => {
    
  };

  return (
    <button onClick={(e) => exportToCSV(csvData, fileName, wscols)}>
      Export XLSX
    </button>
  );
};

function formatDateTime(inputDate: any) {
  const date = new Date(inputDate);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0
  const year = date.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
}


// This component is a presentational component which takes the data to download and file name as props. The exportToCSV method is invoked when the export button is clicked on line 20.

export default function Home() {
  const [customers, setCustomers] = useState<any[]>([]);

  const headers = [
    { label: "Tiêu đề", key: "title" },
    { label: "Chủ đề", key: "topic" },
    { label: "Ngày đăng", key: "createdAt" },
    { label: "Đường dẫn", key: "url" },
    { label: "Số từ", key: "numberWord" },
  ];

  const readContent = (content: any) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const paragraphs = doc.querySelectorAll("p");
    let totalCharacters = "";
    paragraphs.forEach((paragraph) => {
      totalCharacters += paragraph.textContent;
    });

    return totalCharacters;
  };

  useEffect(() => {
    void (async () => {
      try {
        const response = await axios.get(
          "https://thuanloithuongmai.vcci.com.vn/api/news-categories"
        );
        const data = response.data;
        const test: any = [];

        for (const element of data.data) {
          if (
            element &&
            element.news &&
            element.news.length > 0
          ) {
            element.news.forEach((item: any) => {
              if (
                new Date(item.created_at).getTime() >= new Date("2023/04/01").getTime() &&
  new Date(item.created_at).getTime() <= new Date("2023/09/30").getTime()
              ) {
                console.log(123123123123123)
                test.push({
                  createdAt: formatDateTime(
                    new Date(item.created_at).toString()
                  ),
                  newsCategory: element.name,
                  title: item.title,
                  highlight: item.highlight,
                  content: readContent(item.content),
                });
              }
            });
          }
        }
        console.log(test, "---> result");
        setCustomers(test);
        // Sửa "results" thành "result"
      } catch (error) {
        console.error("Lỗi khi gọi API: ", error);
      }
    })();
  }, []);

  const handleExport = () => {
    const headings = [[
        'Tiêu đề',
        'Chủ đề',
        'Ngày đăng',
        'Đường dẫn',
        'Số từ'
    ]];
    const wb = utils.book_new();
    const ws = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, headings);
    utils.sheet_add_json(ws, customers, { origin: 'A2', skipHeader: true });
    utils.book_append_sheet(wb, ws, 'Report');
    writeFile(wb, 'Movie Report.xlsx');
}

  const wscols = [
    {
      wch: Math.max(...customers.map((customer) => customer.createdAt.length)),
    },
    { wch: Math.max(...customers.map((customer) => customer.newsCategory.length)) },
    {
      wch: Math.max(...customers.map((customer) => customer.title.length)),
    },
    { wch: Math.max(...customers.map((customer) => customer.highlight.length)) },
    {
      wch: Math.max(...customers.map((customer) => customer.content)),
    },
  ];

  return (
    <div className="App">
        <div className="col-md-4 center">
        <button onClick={handleExport} className="btn btn-primary float-right">
          Export <i className="fa fa-download"></i>
        </button>
        </div>
    </div>
  );
}
