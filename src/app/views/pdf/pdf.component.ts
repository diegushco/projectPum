import { Component, ViewChild, ElementRef, Input } from "@angular/core";
import jsPDF from "jspdf";
import "jspdf-autotable";

@Component({
  selector: "pdf-flexi",
  templateUrl: "pdf.component.html",
  styleUrls: ["pdf.component.css"],
})
export class PDFComponent {
  @ViewChild("pdfTable", { static: false }) pdfTable: ElementRef;
  @Input() rows: any;
  @Input() columns: any;
  @Input() columnsText: any;
  @Input() name: any;
  flexiBase64: any;

  constructor() {}

  getBase64Image(img) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  downloadAsPDF() {
    const today = new Date();
    this.flexiBase64 = this.getBase64Image(document.getElementById("logo"));

    const doc = new jsPDF();

    doc.autoTable({
      html: "#table-info",
      startY: 25,
      didDrawPage: (data) => {
        doc.setFontSize(16);
        const fileTitle = this.name;
        const img = "data:image/jpg;base64," + this.flexiBase64;
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height
          ? pageSize.height
          : pageSize.getHeight();
        const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        doc.setFont("Roboto-Regular");
        doc.setFontType("bold");
        doc.setFontSize(18);
        doc.setTextColor(73, 126, 186);
        doc.text(fileTitle, 14, 20);
        doc.addImage(img, "JPEG", pageWidth - 70, 8, 50, 15);

        doc.setTextColor(0, 0, 0);
        doc.autoTable({
          html: "#footer_text_pdf",
          startY: pageHeight - 50,
          styles: {
            halign: "center",
            cellPadding: 0.2,
          },
        });
        const str = "Pagina " + doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(str, data.settings.margin.left, pageHeight - 10);

        const date =
          today.getDate() +
          "/" +
          (today.getMonth() + 1) +
          "/" +
          today.getFullYear();
        doc.text(date, pageWidth - 25, pageHeight - 10);
        console.log(data);
      },
      margin: {
        bottom: 10,
        top: 25,
      },
    });

    doc.save(
      this.name +
        today.getDate() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getFullYear() +
        ".pdf"
    );
  }
}
