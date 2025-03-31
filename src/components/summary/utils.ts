
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const usePdfExport = () => {
  const { toast } = useToast();

  const generatePdf = async (element: HTMLDivElement, filename: string) => {
    toast({
      title: "Generating PDF",
      description: "Please wait while we generate your PDF...",
    });
    
    try {
      // Create instance of jsPDF
      const pdf = new jsPDF("p", "mm", "a4");
      
      // Get the content of the div
      const canvas = await html2canvas(element, {
        scale: 2,  // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      // Convert the canvas to an image
      const imgData = canvas.toDataURL("image/png");
      
      // Calculate the width and height of the PDF
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add image to PDF
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add new pages if the content doesn't fit on one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save the PDF with a meaningful filename
      pdf.save(filename);
      
      toast({
        title: "PDF Generated",
        description: "Your PDF has been successfully generated and downloaded.",
      });
      
      return true;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
      
      return false;
    }
  };

  return { generatePdf };
};
