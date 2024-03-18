import * as XLSX from "xlsx";
import { Button } from "./ui/button";
import { DownloadIcon } from "lucide-react";

export const ExportToExcel = ({ dataSet, fileName }: any) => {
  const fileExtension = ".xlsx";
  const exportToCSV = (dataSet: any, fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(dataSet);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${fileName}${fileExtension}`);
  };

  return (
    <Button onClick={() => exportToCSV(dataSet, fileName)} size={"icon"}>
      <DownloadIcon />
    </Button>
  );
};
