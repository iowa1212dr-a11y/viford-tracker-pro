import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useToast } from './use-toast';

// Detectar si es dispositivo móvil
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform));
};

// Función para descargar en móviles
const downloadForMobile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  
  // Intentar usar Web Share API si está disponible
  if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], filename)] })) {
    const file = new File([blob], filename, { type: blob.type });
    navigator.share({
      files: [file],
      title: 'Documento generado',
      text: `Compartir ${filename}`
    }).catch(() => {
      // Si falla el share, abrir en nueva pestaña
      window.open(url, '_blank');
    });
  } else {
    // Abrir en nueva pestaña para descarga manual
    window.open(url, '_blank');
  }
  
  // Limpiar el URL después de un tiempo
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const usePDFExport = () => {
  const { toast } = useToast();

  const exportToPDF = async (elementId: string, filename: string) => {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Elemento no encontrado');
      }

      // Configuración para alta calidad
      const canvas = await html2canvas(element, {
        scale: 3, // Escala alta para mejor calidad
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      // Calcular dimensiones optimizadas
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Crear PDF con alta resolución
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/jpeg', 1.0);

      // Agregar primera página
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, '', 'FAST');
      heightLeft -= pageHeight;

      // Agregar páginas adicionales si es necesario
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, '', 'FAST');
        heightLeft -= pageHeight;
      }

      // Descargar según el dispositivo
      if (isMobile()) {
        const pdfBlob = pdf.output('blob');
        downloadForMobile(pdfBlob, `${filename}.pdf`);
      } else {
        pdf.save(`${filename}.pdf`);
      }

      toast({
        title: "PDF generado",
        description: isMobile() ? "El archivo PDF se abrirá en una nueva pestaña" : "El archivo PDF se ha descargado exitosamente",
        variant: "default"
      });
    } catch (error) {
      console.error('Error generando PDF:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el archivo PDF",
        variant: "destructive"
      });
    }
  };

  const captureAsImage = async (elementId: string, filename: string) => {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Elemento no encontrado');
      }

      const canvas = await html2canvas(element, {
        scale: 4, // Escala muy alta para captura de imagen
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight
      });

      // Descargar según el dispositivo
      if (isMobile()) {
        canvas.toBlob((blob) => {
          if (blob) {
            downloadForMobile(blob, `${filename}.png`);
          }
        }, 'image/png', 1.0);
      } else {
        // Descarga tradicional para desktop
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      }

      toast({
        title: "Imagen generada",
        description: isMobile() ? "La imagen se abrirá en una nueva pestaña" : "La imagen se ha descargado exitosamente",
        variant: "default"
      });
    } catch (error) {
      console.error('Error generando imagen:', error);
      toast({
        title: "Error",
        description: "No se pudo generar la imagen",
        variant: "destructive"
      });
    }
  };

  return { exportToPDF, captureAsImage };
};