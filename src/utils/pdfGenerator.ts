import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Transaction } from "../hooks/walletStore";

export const generateTransactionPDF = (
  transactions: Transaction[],
  startDate: string,
  endDate: string,
  currentBalance: number
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(22);
  doc.setTextColor(59, 130, 246); 
  doc.text("MarketPulse", 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); 
  doc.text("INSTITUTIONAL LEDGER STATEMENT", 14, 28);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text("Statement Details", 14, 40);
  
  doc.setFontSize(10);
  doc.text(`Period: ${startDate} to ${endDate}`, 14, 48);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 54);
  doc.text(`Closing Balance: INR ${currentBalance.toLocaleString("en-IN")}`, 14, 60);

  const tableData = transactions.map((tx) => [
    new Date(tx.date).toLocaleDateString("en-IN"),
    tx.title,
    tx.type.replace("_", " "),
    {
      content: `${tx.type === "ADD" || tx.type === "STOCK_SELL" ? "+" : "-"}${tx.amount.toLocaleString("en-IN")}`,
      styles: { textColor: tx.type === "ADD" || tx.type === "STOCK_SELL" ? [16, 185, 129] : [239, 68, 68] }
    },
    tx.balanceAfter.toLocaleString("en-IN")
  ]);

  autoTable(doc, {
    startY: 70,
    head: [["Date", "Description", "Type", "Amount (INR)", "Balance (INR)"]],
    body: tableData as any,
    theme: "striped",
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontSize: 10,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    columnStyles: {
      3: { halign: "right" },
      4: { halign: "right" },
    },
  });

  const pageCount = doc.internal.pages.length - 1;
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `MarketPulse - Privileged Financial Document | Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  doc.save(`MarketPulse_Statement_${startDate}_${endDate}.pdf`);
};
