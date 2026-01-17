import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import { Response } from 'express';

/**
 * Generate QR Code as Data URL
 */
export const generateQRCode = async (data: string): Promise<string> => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(data, {
      width: 200,
      margin: 2,
      color: {
        dark: '#1e1b4b',
        light: '#ffffff',
      },
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Generate Member ID Card PDF
 */
export const generateMemberIdCard = async (
  res: Response,
  memberData: {
    name: string;
    uniqueId: string;
    department: string;
    batch: string;
    profileImage?: string;
    qrCode: string;
  }
) => {
  const doc = new PDFDocument({
    size: [350, 200],
    margin: 0,
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=member-card-${memberData.uniqueId}.pdf`);

  doc.pipe(res);

  // Background gradient (simulated with rectangles)
  doc.rect(0, 0, 350, 200).fill('#1e1b4b');
  doc.rect(0, 0, 350, 60).fill('#312e81');

  // Header
  doc.fontSize(16).fillColor('#ffffff').text('DAFFODIL AI CLUB', 20, 20, { align: 'center' });
  doc.fontSize(8).text('Daffodil International University', 20, 40, { align: 'center' });

  // Member Info
  doc.fontSize(14).fillColor('#ffffff').text(memberData.name, 20, 80);
  doc.fontSize(10).fillColor('#a5b4fc').text(memberData.department || 'Department', 20, 100);
  doc.fontSize(10).text(`Batch: ${memberData.batch || 'N/A'}`, 20, 115);

  // Member ID
  doc.fontSize(8).fillColor('#818cf8').text('MEMBER ID', 20, 140);
  doc.fontSize(12).fillColor('#ffffff').text(memberData.uniqueId, 20, 155);

  // QR Code placeholder (would need actual image embedding)
  doc.rect(260, 70, 70, 70).fill('#ffffff');
  doc.fontSize(6).fillColor('#1e1b4b').text('QR CODE', 275, 100);

  doc.end();
};

/**
 * Generate Certificate PDF
 */
export const generateCertificatePdf = async (
  res: Response,
  certData: {
    recipientName: string;
    title: string;
    description: string;
    date: string;
    certificateId: string;
  }
) => {
  const doc = new PDFDocument({
    size: 'A4',
    layout: 'landscape',
    margin: 50,
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=certificate-${certData.certificateId}.pdf`);

  doc.pipe(res);

  // Border
  doc.rect(30, 30, 782, 535).stroke('#6366f1');
  doc.rect(40, 40, 762, 515).stroke('#8b5cf6');

  // Header
  doc.fontSize(24).fillColor('#1e1b4b').text('DAFFODIL AI CLUB', 0, 80, { align: 'center' });
  doc.fontSize(12).fillColor('#666').text('Daffodil International University', 0, 110, { align: 'center' });

  // Certificate Title
  doc.fontSize(36).fillColor('#6366f1').text('CERTIFICATE', 0, 160, { align: 'center' });
  doc.fontSize(14).fillColor('#666').text('OF ' + certData.title.toUpperCase(), 0, 200, { align: 'center' });

  // Recipient
  doc.fontSize(14).fillColor('#333').text('This is to certify that', 0, 260, { align: 'center' });
  doc.fontSize(28).fillColor('#1e1b4b').text(certData.recipientName, 0, 290, { align: 'center' });

  // Description
  doc.fontSize(14).fillColor('#333').text(certData.description, 100, 340, { 
    align: 'center',
    width: 642,
  });

  // Date
  doc.fontSize(12).fillColor('#666').text(`Issued on: ${certData.date}`, 0, 420, { align: 'center' });

  // Certificate ID
  doc.fontSize(10).fillColor('#999').text(`Certificate ID: ${certData.certificateId}`, 0, 500, { align: 'center' });

  // Signatures
  doc.fontSize(12).fillColor('#333');
  doc.text('_____________________', 150, 460);
  doc.text('Club President', 180, 480);
  
  doc.text('_____________________', 550, 460);
  doc.text('Faculty Advisor', 580, 480);

  doc.end();
};
