import { Prescription, PrintOptions } from "../types";

export const generateCosmeticPrescriptionHTML = (
  prescription: Prescription
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Soundarya Cosmetic & Laser Surgery Clinic - Prescription</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 14px;
                line-height: 1.6;
                color: #2c3e50;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                min-height: 100vh;
                position: relative;
            }

            body::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background:
                    radial-gradient(circle at 25% 25%, rgba(168, 55, 94, 0.05) 0%, transparent 50%),
                    radial-gradient(circle at 75% 75%, rgba(53, 39, 77, 0.05) 0%, transparent 50%);
                z-index: -1;
            }

            .prescription-container {
                max-width: 850px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 20px;
                box-shadow:
                    0 20px 60px rgba(168, 55, 94, 0.1),
                    0 10px 30px rgba(53, 39, 77, 0.1),
                    0 0 0 1px rgba(255, 255, 255, 0.8);
                overflow: hidden;
                position: relative;
                padding: 40px;
            }

            .prescription-container::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 8px;
                background: linear-gradient(90deg, #a8375e 0%, #d63384 50%, #35274d 100%);
            }

            /* Header Section */
            .header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 35px;
                padding-bottom: 25px;
                border-bottom: 2px solid #e8f4f8;
                position: relative;
            }

            .doctor-section {
                flex: 1;
                margin-right: 30px;
            }

            .doctor-name {
                font-size: 28px;
                font-weight: 700;
                color: #a8375e;
                margin-bottom: 8px;
                text-shadow: 0 2px 4px rgba(168, 55, 94, 0.1);
            }

            .doctor-qualifications {
                font-size: 13px;
                color: #666;
                margin-bottom: 12px;
                font-weight: 500;
            }

            .doctor-title {
                font-size: 14px;
                color: #35274d;
                margin-bottom: 12px;
                font-weight: 600;
            }

            .doctor-contact {
                display: flex;
                flex-direction: column;
                gap: 6px;
                font-size: 13px;
                color: #555;
            }

            .contact-item {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .clinic-logo {
                text-align: right;
                background: linear-gradient(135deg, #a8375e, #d63384);
                color: white;
                padding: 20px;
                border-radius: 15px;
                min-width: 200px;
                box-shadow: 0 8px 25px rgba(168, 55, 94, 0.3);
            }

            .clinic-name {
                font-size: 20px;
                font-weight: 700;
                margin-bottom: 4px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .clinic-subtitle {
                font-size: 11px;
                opacity: 0.9;
                font-weight: 500;
            }

            /* Patient Information */
            .patient-section {
                background: linear-gradient(135deg, #f8f9ff 0%, #e8f4f8 100%);
                border: 1px solid #e1e8ed;
                border-radius: 15px;
                padding: 25px;
                margin-bottom: 30px;
                position: relative;
                overflow: hidden;
            }

            .patient-section::before {
                content: '👤';
                position: absolute;
                top: 15px;
                right: 20px;
                font-size: 24px;
                opacity: 0.1;
            }

            .section-title {
                font-size: 16px;
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .patient-grid {
                display: grid;
                grid-template-columns: 2fr 1fr 1fr;
                gap: 20px;
                align-items: center;
            }

            .patient-field {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .field-label {
                font-size: 12px;
                font-weight: 600;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .field-value {
                font-size: 15px;
                font-weight: 500;
                color: #2c3e50;
                background: white;
                border: 2px solid #e1e8ed;
                border-radius: 8px;
                padding: 12px 15px;
                min-height: 20px;
            }

            .diagnosis-section {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #e1e8ed;
            }

            /* Services Section */
            .services-section {
                background: linear-gradient(135deg, #fff8fa 0%, #f0f8ff 100%);
                border: 1px solid #ffe1e8;
                border-radius: 15px;
                padding: 25px;
                margin-bottom: 30px;
                position: relative;
            }

            .services-section::before {
                content: '✨';
                position: absolute;
                top: 15px;
                right: 20px;
                font-size: 24px;
                opacity: 0.1;
            }

            .services-title {
                font-size: 16px;
                font-weight: 600;
                color: #a8375e;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .services-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 15px;
            }

            .service-item {
                background: white;
                border: 1px solid #f0d1d9;
                border-radius: 10px;
                padding: 12px 15px;
                font-size: 13px;
                color: #666;
                transition: all 0.3s ease;
            }

            .service-item:hover {
                background: #fff5f7;
                border-color: #a8375e;
                color: #a8375e;
            }

            /* Prescription Section */
            .prescription-section {
                background: #f8f9ff;
                border: 1px solid #e1e8ed;
                border-radius: 15px;
                padding: 25px;
                margin-bottom: 30px;
            }

            .prescription-content {
                background: white;
                border: 2px solid #e1e8ed;
                border-radius: 12px;
                padding: 20px;
                min-height: 80px;
                font-size: 14px;
                color: #2c3e50;
                line-height: 1.7;
            }

            /* Footer Section */
            .footer-section {
                background: linear-gradient(135deg, #a8375e 0%, #d63384 100%);
                color: white;
                border-radius: 15px;
                padding: 25px;
                text-align: center;
                margin-bottom: 20px;
                position: relative;
                overflow: hidden;
            }

            .footer-section::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><circle cx="30" cy="30" r="4"/><circle cx="7" cy="7" r="2"/><circle cx="53" cy="7" r="2"/><circle cx="7" cy="53" r="2"/><circle cx="53" cy="53" r="2"/></g></g></svg>');
                opacity: 0.3;
            }

            .clinic-footer-name {
                font-size: 20px;
                font-weight: 700;
                margin-bottom: 8px;
                position: relative;
                z-index: 1;
            }

            .clinic-hours {
                font-size: 13px;
                opacity: 0.9;
                margin-bottom: 8px;
                position: relative;
                z-index: 1;
            }

            .clinic-address {
                font-size: 12px;
                opacity: 0.8;
                position: relative;
                z-index: 1;
            }

            /* Signature Section */
            .signature-section {
                text-align: right;
                margin-top: 30px;
                padding-top: 25px;
                border-top: 2px solid #e1e8ed;
            }

            .signature-label {
                font-size: 14px;
                color: #666;
                margin-bottom: 15px;
            }

            .signature-line {
                width: 250px;
                height: 2px;
                background: linear-gradient(90deg, #a8375e, #d63384);
                margin-left: auto;
                margin-top: 10px;
            }

            .doctor-signature {
                font-size: 18px;
                font-weight: 600;
                color: #a8375e;
                margin-top: 8px;
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .header {
                    flex-direction: column;
                    gap: 20px;
                    text-align: center;
                }

                .doctor-section {
                    margin-right: 0;
                }

                .clinic-logo {
                    min-width: 100%;
                }

                .patient-grid {
                    grid-template-columns: 1fr;
                    gap: 15px;
                }

                .services-grid {
                    grid-template-columns: 1fr;
                }
            }

            @media print {
                body {
                    background: white;
                    font-size: 12px;
                }

                .prescription-container {
                    box-shadow: none;
                    border: 1px solid #ccc;
                    max-width: 100%;
                    margin: 0;
                }

                .prescription-container::before {
                    display: none;
                }

                .service-item:hover {
                    background: white;
                    border-color: #f0d1d9;
                    color: #666;
                }
            }
        </style>
    </head>
    <body>
        <div class="prescription-container">
            <!-- Header Section -->
            <div class="header">
                <div class="doctor-section">
                    <div class="doctor-name">Dr. Laxmi Kanta Mishra</div>
                    <div class="doctor-qualifications">M.B.B.S., M.S.(Gen. Surgery), M.Ch. (Plastic Surgery) (Delhi University)</div>
                    <div class="doctor-title">Senior Consultant - Cosmetic & Plastic Surgery, Apollo Hospital, BBSR</div>
                    <div class="doctor-contact">
                        <div class="contact-item">
                            <span>📱</span>
                            <strong>9437920023, 8093060023</strong>
                        </div>
                        <div class="contact-item">
                            <span>✉️</span>
                            drlkmishra@gmail.com
                        </div>
                        <div class="contact-item">
                            <span>🌐</span>
                            www.cosmeticsurgeonbbsr.com
                        </div>
                    </div>
                </div>
                <div class="clinic-logo">
                    <div class="clinic-name">SOUNDARYA</div>
                    <div class="clinic-subtitle">COSMETIC & LASER SURGERY CLINIC</div>
                </div>
            </div>

            <!-- Patient Information -->
            <div class="patient-section">
                <div class="section-title">👤 Patient Information</div>
                <div class="patient-grid">
                    <div class="patient-field">
                        <div class="field-label">Patient Name</div>
                        <div class="field-value">${prescription.patient.name}</div>
                    </div>
                    <div class="patient-field">
                        <div class="field-label">Age</div>
                        <div class="field-value">${prescription.patient.age} years</div>
                    </div>
                    <div class="patient-field">
                        <div class="field-label">Date</div>
                        <div class="field-value">${prescription.date}</div>
                    </div>
                </div>

                ${
                  prescription.diagnosis
                    ? `
                    <div class="diagnosis-section">
                        <div class="patient-field">
                            <div class="field-label">Diagnosis/Concern</div>
                            <div class="field-value">${prescription.diagnosis}</div>
                        </div>
                    </div>
                `
                    : ""
                }
            </div>

            <!-- Services Available -->
            <div class="services-section">
                <div class="services-title">✨ Services Available</div>
                <div class="services-grid">
                    <div class="service-item">• Gynaecomastia Surgery</div>
                    <div class="service-item">• Hair Transplantation</div>
                    <div class="service-item">• Rhinoplasty</div>
                    <div class="service-item">• Facial Rejuvenation & Fillers</div>
                    <div class="service-item">• Chemical Peel & Microdermabrasion</div>
                    <div class="service-item">• Botox & Dermal Fillers</div>
                    <div class="service-item">• Face Lift Surgery</div>
                    <div class="service-item">• Laser Hair Removal</div>
                    <div class="service-item">• Breast Augmentation</div>
                    <div class="service-item">• Liposuction & Body Contouring</div>
                    <div class="service-item">• Tummy Tuck Surgery</div>
                    <div class="service-item">• Dimple Creation Surgery</div>
                </div>
            </div>

            <!-- Prescription/Advice Section -->
            ${
              prescription.notes
                ? `
                <div class="prescription-section">
                    <div class="section-title">💊 Doctor's Advice & Recommendations</div>
                    <div class="prescription-content">
                        ${prescription.notes}
                    </div>
                </div>
            `
                : ""
            }

            <!-- Footer Section -->
            <div class="footer-section">
                <div class="clinic-footer-name">SOUNDARYA COSMETIC AND LASER SURGERY CLINIC</div>
                <div class="clinic-hours">Consultation Time: 5pm to 9pm | All Sundays: 9am to 1pm</div>
                <div class="clinic-address">A-15, Ruchika Market, Near Durga Mandap, Baramunda, Bhubaneswar - 751003</div>
            </div>

            <!-- Signature Section -->
            <div class="signature-section">
                <div class="signature-label">Doctor's Signature</div>
                <div class="signature-line"></div>
                <div class="doctor-signature">DR. L.K MISHRA</div>
            </div>
        </div>
    </body>
    </html>
  `;
};

export const generatePrescriptionHTML = (
  prescription: Prescription,
  options: PrintOptions = {}
) => {
  const {
    showWatermark = true,
    showPreviewBanner = false,
    clinicName = "🏥 Soundarya Cosmetic & Laser Surgery Clinic",
    clinicAddress = "A-15, Ruchika Market, Near Durga Mandap, Baramunda, Bhubaneswar - 751003",
    clinicContact = "Phone: 9437920023, 8093060023 | Email: drlkmishra@gmail.com | www.cosmeticsurgeonbbsr.com",
    template = "medical",
  } = options;

  // Use cosmetic template if selected
  if (template === "cosmetic") {
    return generateCosmeticPrescriptionHTML(prescription);
  }

  const watermarkText = showPreviewBanner ? "PREVIEW" : "PRESCRIPTION";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Medical Prescription - ${prescription.patient.name}</title>
        <style>
          @page {
            size: A4;
            margin: 1cm;
          }
          * {
            box-sizing: border-box;
          }
          body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 0;
            background: white;
          }
          .prescription-container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 15mm;
            border: 2px solid #2c5530;
            border-radius: 8px;
            background: white;
            position: relative;
          }
          ${
            showWatermark
              ? `
            .prescription-container::before {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><text x="50" y="50" font-family="Arial" font-size="8" fill="%23e5e7eb" text-anchor="middle" transform="rotate(-45 50 50)">${watermarkText}</text></svg>') repeat;
              opacity: 0.1;
              z-index: -1;
            }
          `
              : ""
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #2c5530;
            padding-bottom: 15px;
            margin-bottom: 20px;
            position: relative;
          }
          .clinic-info {
            font-size: 14pt;
            font-weight: bold;
            color: #2c5530;
            margin-bottom: 5px;
          }
          .clinic-address {
            font-size: 10pt;
            color: #666;
            margin-bottom: 5px;
          }
          .clinic-contact {
            font-size: 9pt;
            color: #888;
          }
          .prescription-title {
            font-size: 18pt;
            font-weight: bold;
            color: #2c5530;
            margin: 15px 0 10px 0;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          ${
            showPreviewBanner
              ? `
            .preview-banner {
              position: absolute;
              top: 10px;
              right: 10px;
              background: #ff6b35;
              color: white;
              padding: 5px 10px;
              border-radius: 4px;
              font-size: 9pt;
              font-weight: bold;
              transform: rotate(15deg);
              box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
          `
              : `
            .prescription-number {
              position: absolute;
              top: 10px;
              right: 10px;
              background: #2c5530;
              color: white;
              padding: 5px 10px;
              border-radius: 4px;
              font-size: 9pt;
              font-weight: bold;
            }
          `
          }
          .doctor-info {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 15px;
            border-left: 4px solid #2c5530;
          }
          .doctor-name {
            font-size: 12pt;
            font-weight: bold;
            color: #2c5530;
            margin-bottom: 5px;
          }
          .prescription-date {
            font-size: 10pt;
            color: #666;
            text-align: right;
            margin-bottom: 15px;
            padding-right: 10px;
          }
          .patient-section {
            background: #f0f8f0;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
            border: 1px solid #d4edda;
          }
          .section-title {
            font-size: 11pt;
            font-weight: bold;
            color: #2c5530;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .patient-info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            font-size: 10pt;
          }
          .info-label {
            font-weight: bold;
            color: #555;
            min-width: 80px;
          }
          .diagnosis-box {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 10px;
            border-radius: 4px;
            margin-top: 10px;
          }
          .medications-section {
            margin-bottom: 20px;
          }
          .medication-item {
            border: 2px solid #e9ecef;
            border-left: 4px solid #2c5530;
            padding: 12px;
            margin-bottom: 10px;
            background: white;
            border-radius: 4px;
            position: relative;
          }
          .medication-number {
            position: absolute;
            top: -8px;
            left: 10px;
            background: #2c5530;
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 9pt;
            font-weight: bold;
          }
          .medication-name {
            font-size: 11pt;
            font-weight: bold;
            color: #2c5530;
            margin-bottom: 5px;
            margin-left: 30px;
          }
          .medication-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            font-size: 9pt;
            margin-left: 30px;
          }
          .medication-instructions {
            background: #f8f9fa;
            padding: 8px;
            border-radius: 3px;
            margin-top: 5px;
            font-style: italic;
            border-left: 3px solid #17a2b8;
          }
          .notes-section {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 20px;
          }
          .notes-content {
            font-size: 10pt;
            line-height: 1.5;
            color: #856404;
          }
          .signature-section {
            border-top: 2px solid #2c5530;
            padding-top: 20px;
            margin-top: 30px;
          }
          .signature-line {
            width: 200px;
            border-bottom: 1px solid #333;
            margin-top: 30px;
            margin-bottom: 5px;
          }
          .signature-text {
            font-size: 9pt;
            color: #666;
          }
          .disclaimer-section {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            padding: 10px;
            border-radius: 4px;
            margin-top: 20px;
            font-size: 8pt;
            color: #6c757d;
            text-align: center;
          }
          .disclaimer-icon {
            color: #dc3545;
            font-weight: bold;
            margin-right: 5px;
          }
          .footer-watermark {
            position: fixed;
            bottom: 10mm;
            left: 50%;
            transform: translateX(-50%);
            font-size: 6pt;
            color: #ccc;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          @media print {
            body { background: white; }
            .prescription-container {
              border: none;
              box-shadow: none;
            }
            .prescription-container::before {
              opacity: 0.05;
            }
          }
        </style>
      </head>
      <body>
        <div class="prescription-container">
          <!-- Header -->
          <div class="header">
            <div class="clinic-info">${clinicName}</div>
            <div style="font-size: 12pt; font-weight: bold; color: #a8375e; margin: 8px 0;">COSMETIC & LASER SURGERY CLINIC</div>
            <div class="clinic-address">${clinicAddress}</div>
            <div class="clinic-contact">${clinicContact}</div>
            <div class="prescription-title">Medical Prescription</div>
            ${
              showPreviewBanner
                ? '<div class="preview-banner">PREVIEW</div>'
                : `<div class="prescription-number">RX-${prescription.id}</div>`
            }
          </div>

          <!-- Preview Notice (if in preview mode) -->
          ${
            showPreviewBanner
              ? `
            <div class="preview-notice" style="background: #fff3cd; border: 2px solid #ff6b35; padding: 15px; border-radius: 6px; margin-bottom: 20px; text-align: center;">
              <strong style="color: #ff6b35; font-size: 11pt;">⚠️ PREVIEW MODE</strong><br>
              This is a preview of your prescription. The actual prescription will be generated after saving.
              Please review all information carefully before finalizing.
            </div>
          `
              : ""
          }

          <!-- Doctor Info -->
          <div class="doctor-info">
            <div class="doctor-name">Dr. ${prescription.doctorName}</div>
            <div style="font-size: 9pt; color: #666;">M.B.B.S., M.S.(Gen. Surgery), M.Ch. (Plastic Surgery) (Delhi University)</div>
            <div style="font-size: 10pt; color: #555; margin-top: 5px;">Senior Consultant - Cosmetic & Plastic Surgery, Apollo Hospital, BBSR</div>
          </div>

          <!-- Date -->
          <div class="prescription-date">
            Date: ${new Date(prescription.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          <!-- Patient Information -->
          <div class="patient-section">
            <div class="section-title">Patient Information</div>
            <div class="patient-info-grid">
              <div><span class="info-label">Name:</span> ${prescription.patient.name}</div>
              <div><span class="info-label">Age:</span> ${prescription.patient.age} years</div>
              <div><span class="info-label">Phone:</span> ${prescription.patient.phone || "Not provided"}</div>
              <div><span class="info-label">Address:</span> ${prescription.patient.address || "Not provided"}</div>
            </div>
            ${
              prescription.diagnosis
                ? `
              <div class="diagnosis-box">
                <span class="info-label">Diagnosis:</span> ${prescription.diagnosis}
              </div>
            `
                : ""
            }
          </div>

          <!-- Medications -->
          <div class="medications-section">
            <div class="section-title">💊 Prescribed Medications</div>
            ${prescription.medications
              .map(
                (med, index) => `
              <div class="medication-item">
                <div class="medication-number">${index + 1}</div>
                <div class="medication-name">${med.name}</div>
                <div class="medication-details">
                  <div><span class="info-label">Dosage:</span> ${med.dosage}</div>
                  <div><span class="info-label">Frequency:</span> ${med.frequency}</div>
                  <div><span class="info-label">Duration:</span> ${med.duration}</div>
                </div>
                ${
                  med.instructions
                    ? `
                  <div class="medication-instructions">
                    <span class="info-label">Instructions:</span> ${med.instructions}
                  </div>
                `
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>

          <!-- Doctor's Notes -->
          ${
            prescription.notes
              ? `
            <div class="notes-section">
              <div class="section-title">📋 Doctor's Instructions</div>
              <div class="notes-content">${prescription.notes}</div>
            </div>
          `
              : ""
          }

          <!-- Signature Section -->
          <div class="signature-section">
            <div style="display: flex; justify-content: space-between; align-items: flex-end;">
              <div style="flex: 1;">
                <div class="signature-line"></div>
                <div class="signature-text">Doctor's Signature</div>
              </div>
              <div style="text-align: right; font-size: 9pt; color: #666;">
                <div>Registration: ${showPreviewBanner ? "#PREVIEW" : `#${Math.random().toString(36).substr(2, 6).toUpperCase()}`}</div>
                <div>License Valid Until: ${showPreviewBanner ? "Preview Mode" : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          <!-- Disclaimer -->
          <div class="disclaimer-section">
            <div class="disclaimer-icon">⚠️</div>
            <strong>IMPORTANT:</strong> This prescription is valid only when signed by a registered medical practitioner.
            Please take medications exactly as prescribed. Consult your doctor if you experience any adverse effects.
            Keep this prescription for your records.
          </div>

          <!-- Footer Watermark -->
          <div class="footer-watermark">${clinicName} - Electronic Health Record System${showPreviewBanner ? " - PREVIEW MODE" : ""}</div>
        </div>
      </body>
    </html>
  `;
};

export const printPrescription = (
  prescription: Prescription,
  options?: PrintOptions
) => {
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(generatePrescriptionHTML(prescription, options));
    printWindow.document.close();
    printWindow.print();
  }
};

export const previewPrescription = (
  prescription: Prescription,
  options?: PrintOptions
) => {
  const previewWindow = window.open("", "_blank");
  if (previewWindow) {
    previewWindow.document.write(
      generatePrescriptionHTML(prescription, {
        ...options,
        showPreviewBanner: true,
      })
    );
    previewWindow.document.close();
  }
};

export const printCosmeticPrescription = (prescription: Prescription) => {
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(generateCosmeticPrescriptionHTML(prescription));
    printWindow.document.close();
    printWindow.print();
  }
};

export const previewCosmeticPrescription = (prescription: Prescription) => {
  const previewWindow = window.open("", "_blank");
  if (previewWindow) {
    previewWindow.document.write(
      generateCosmeticPrescriptionHTML(prescription)
    );
    previewWindow.document.close();
  }
};
