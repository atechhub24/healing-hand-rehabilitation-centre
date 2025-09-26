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
        <title>Healing Hand Rehabilitation Centre - Prescription</title>
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
                font-size: 20pt;
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
                background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
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
                    <div class="doctor-title">Senior Consultant - Rehabilitation Medicine, Apollo Hospital, BBSR</div>
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
                            www.healinghandrehab.com
                        </div>
                    </div>
                </div>
                <div class="clinic-logo">
                    <div class="clinic-name">HEALING HAND</div>
                    <div class="clinic-subtitle">REHABILITATION CENTRE</div>
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
                    <div class="service-item">• Physical Therapy & Rehabilitation</div>
                    <div class="service-item">• Occupational Therapy</div>
                    <div class="service-item">• Speech & Language Therapy</div>
                    <div class="service-item">• Neurological Rehabilitation</div>
                    <div class="service-item">• Orthopedic Rehabilitation</div>
                    <div class="service-item">• Cardiac Rehabilitation</div>
                    <div class="service-item">• Pediatric Rehabilitation</div>
                    <div class="service-item">• Pain Management</div>
                    <div class="service-item">• Post-Surgical Rehabilitation</div>
                    <div class="service-item">• Sports Injury Rehabilitation</div>
                    <div class="service-item">• Stroke Recovery Programs</div>
                    <div class="service-item">• Mobility & Gait Training</div>
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

            <!-- Procedure Section -->
            ${
              prescription.procedure
                ? `
                <div class="prescription-section">
                    <div class="section-title">🔬 Diagnostic Procedure</div>
                    <div class="prescription-content">
                        ${prescription.procedure}
                    </div>
                </div>
            `
                : ""
            }

            <!-- Footer Section -->
            <div class="footer-section">
                <div class="clinic-footer-name">HEALING HAND REHABILITATION CENTRE</div>
                <div class="clinic-hours">Consultation Time: 9am to 7pm | Sundays: 10am to 2pm</div>
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
    clinicName = "🏥 Healing Hand Rehabilitation Centre",
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
            margin: 0.5cm;
          }
          * {
            box-sizing: border-box;
          }
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap');
          
          body {
            font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
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
            padding: 10mm 5mm 3mm 5mm;
            border: 2px solid #2c5530;
            border-radius: 8px;
            background: white;
            position: relative;
          }
          .prescription-content {
            display: flex;
            gap: 5mm;
            margin-bottom: 0;
          }
          .prescription-main {
            flex: 1;
            max-width: 70%;
          }
          .prescription-sidebar {
            flex-shrink: 0;
            width: 30%;
            min-height: 200mm;
            background: #ffffff;
            border-left: 2px dashed #ddd;
            padding: 8mm;
            position: relative;
            box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
          }
          .sidebar-placeholder {
            font-size: 9pt;
            color: #999;
            text-align: center;
            line-height: 1.4;
            margin-top: 15mm;
            padding: 5mm;
            border: 1px dashed #ccc;
            border-radius: 4px;
            background: #f9f9f9;
            font-family: 'Inter', sans-serif;
          }
          .sidebar-title {
            font-size: 10pt;
            font-weight: 600;
            color: #2c5530;
            text-align: center;
            margin-bottom: 8mm;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 3mm;
            font-family: 'Inter', sans-serif;
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
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 1px solid #2c5530;
            padding-bottom: 5px;
            margin-bottom: 8px;
            position: relative;
          }
          .header-left {
            flex: 1;
            text-align: left;
          }
          .header-divider {
            width: 1px;
            height: 80px;
            background: #8B4513;
            margin: 0 20px;
            flex-shrink: 0;
          }
          .header-right {
            flex-shrink: 0;
            width: 195px;
            text-align: center;
            margin-left: 10px;
          }
          .clinic-logo-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 3px;
          }
          .clinic-logo {
            width: 120px;
            height: 120px;
            object-fit: contain;
          }

          .clinic-info {
            font-size: 10pt;
            font-weight: 600;
            color: #2c5530;
            margin-bottom: 1px;
            font-family: 'Inter', sans-serif;
          }
          .clinic-address {
            font-size: 7pt;
            color: #666;
            margin-bottom: 1px;
            font-family: 'Inter', sans-serif;
          }
          .clinic-contact {
            font-size: 6pt;
            color: #888;
            margin-bottom: 1px;
            font-family: 'Inter', sans-serif;
          }
          .prescription-title {
            font-size: 10pt;
            font-weight: 600;
            color: #2c5530;
            margin: 3px 0 2px 0;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            font-family: 'Inter', sans-serif;
          }
          .prescription-title-main {
            font-size: 12pt;
            font-weight: 700;
            color: #2c5530;
            margin: 15px 0 10px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-family: 'Inter', sans-serif;
            text-align: center;
            border-bottom: 2px solid #2c5530;
            padding-bottom: 8px;
          }
          ${
            showPreviewBanner
              ? `
                      .preview-banner {
            position: absolute;
            top: 5px;
            right: 5px;
            background: #ff6b35;
            color: white;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 8pt;
            font-weight: bold;
            transform: rotate(15deg);
            box-shadow: 1px 1px 3px rgba(0,0,0,0.3);
          }
          `
              : `
                      .prescription-number {
            position: absolute;
            top: 5px;
            right: 5px;
            background: #2c5530;
            color: white;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 8pt;
            font-weight: bold;
          }
          `
          }
          .doctor-info {
            background: #f8f9fa;
            padding: 5px;
            border-radius: 3px;
            margin-bottom: 5px;
            border-left: 2px solid #2c5530;
          }
          .doctor-name {
            font-size: 10pt;
            font-weight: 600;
            color: #2c5530;
            margin-bottom: 2px;
            font-family: 'Inter', sans-serif;
          }
          .prescription-date {
            font-size: 8pt;
            color: #666;
            text-align: right;
            margin-bottom: 5px;
            padding-right: 3px;
          }
          .doctor-header-section {
            margin-bottom: 10px;
          }
          .doctor-name-main {
            font-size: 14pt;
            font-weight: 700;
            color: #8B4513;
            margin-bottom: 4px;
            font-family: 'Inter', sans-serif;
          }
          .doctor-qualifications {
            font-size: 8pt;
            color: #666;
            margin-bottom: 3px;
            font-family: 'Inter', sans-serif;
            line-height: 1.3;
          }
          .doctor-designation {
            font-size: 9pt;
            color: #555;
            margin-bottom: 4px;
            font-family: 'Inter', sans-serif;
            line-height: 1.3;
          }
          .doctor-designation strong {
            color: #8B4513;
            font-weight: 700;
          }
          .doctor-contact {
            margin-bottom: 2px;
            font-family: 'Inter', sans-serif;
          }
          .contact-label {
            font-size: 8pt;
            color: #666;
            font-weight: 500;
          }
          .contact-numbers {
            font-size: 8pt;
            color: #8B4513;
            font-weight: 600;
          }
          .doctor-email-web {
            font-size: 7pt;
            color: #666;
            font-family: 'Inter', sans-serif;
            line-height: 1.3;
          }
          .patient-section {
            background: #e8f4fd;
            padding: 6px 8px;
            border-radius: 3px;
            margin-bottom: 6px;
            border-left: 3px solid #2c5530;
          }
          .section-title {
            font-size: 20pt;
            font-weight: 600;
            color: #2c5530;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.2px;
            font-family: 'Inter', sans-serif;
          }
          .patient-info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4px;
            font-size: 8pt;
            font-family: 'Inter', sans-serif;
          }
          .info-label {
            font-weight: 600;
            color: #555;
            min-width: 60px;
            font-family: 'Inter', sans-serif;
          }
          .diagnosis-box {
            background: #e8f4fd;
            border: 1px solid #bee5eb;
            padding: 4px;
            border-radius: 2px;
            margin-top: 4px;
          }
          .medications-section {
            margin-bottom: 6px;
          }
          .medications-table {
            border: 1px solid #e0e0e0;
            border-radius: 3px;
            overflow: hidden;
            background: white;
          }
          .table-header {
            display: flex;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
            font-weight: 600;
            font-size: 8pt;
            color: #2c5530;
            font-family: 'Inter', sans-serif;
          }
          .medication-row {
            display: flex;
            border-bottom: 1px solid #f0f0f0;
            min-height: 20px;
            font-family: 'Inter', sans-serif;
          }
          .medication-row:last-child {
            border-bottom: none;
          }
          .medication-row:nth-child(even) {
            background: #fafafa;
          }
          .col-med {
            flex: 2;
            padding: 3px 4px;
            border-right: 1px solid #e0e0e0;
            display: flex;
            align-items: center;
            font-size: 8pt;
            font-family: 'Inter', sans-serif;
          }
          .col-dose, .col-freq, .col-dur, .col-inst {
            flex: 1;
            padding: 3px 4px;
            border-right: 1px solid #e0e0e0;
            display: flex;
            align-items: center;
            font-size: 7pt;
            text-align: center;
            font-family: 'Inter', sans-serif;
          }
          .col-inst {
            border-right: none;
          }
          .med-number {
            background: #2c5530;
            color: white;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 6pt;
            font-weight: 600;
            margin-right: 6px;
            flex-shrink: 0;
            font-family: 'Inter', sans-serif;
          }
          .med-name {
            font-weight: 600;
            color: #2c5530;
            font-family: 'Inter', sans-serif;
          }
          .notes-section {
            background: #e8f4fd;
            border: 1px solid #bee5eb;
            padding: 4px;
            border-radius: 2px;
            margin-bottom: 5px;
          }
          .notes-content {
            font-size: 12pt;
            line-height: 1.2;
            color: #856404;
          }
          .procedure-section {
            background: #e8f4fd;
            border: 1px solid #bee5eb;
            padding: 8px;
            border-radius: 3px;
            margin-bottom: 8px;
            min-height: 60px;
          }
          .procedure-content {
            font-size: 12pt;
            line-height: 1.3;
            color: #0c5460;
          }
          .procedure-placeholder {
            font-style: italic;
            color: #6c757d;
            text-align: center;
            padding: 8px;
            background: #f8f9fa;
            border-radius: 2px;
            border: 1px dashed #dee2e6;
          }
          .signature-section {
            // border-top: 1px solid #2c5530;
            padding-top: 6px;
            margin-top: 8px;
          }
          .signature-line {
            width: 150px;
            border-bottom: 1px solid #333;
            margin-top: 8px;
            margin-bottom: 2px;
          }
          .signature-text {
            font-size: 8pt;
            color: #666;
          }
          .disclaimer-section {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            padding: 3px;
            border-radius: 2px;
            margin-top: 5px;
            font-size: 6pt;
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
          .clinic-footer {
            background: #1e3a8a;
            color: white;
            padding: 8px 10px;
            text-align: center;
            margin-top: 10px;
            border-radius: 0;
            box-shadow: none;
            width: 100%;
            margin-left: 0;
            margin-right: 0;
            border: 1px solid #1e40af;
          }
          .clinic-footer-name {
            font-size: 12pt;
            font-weight: 700;
            margin-bottom: 8px;
            color: white;
            text-shadow: none;
            letter-spacing: 0.5px;
            font-family: 'Inter', sans-serif;
          }
          .clinic-footer-address {
            font-size: 9pt;
            color: #e0e7ff;
            margin-bottom: 6px;
            font-family: 'Inter', sans-serif;
            line-height: 1.3;
          }
          .clinic-footer-timing {
            font-size: 9pt;
            color: #e0e7ff;
            font-weight: 500;
            font-family: 'Inter', sans-serif;
            line-height: 1.3;
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
          .section-header {
            font-size: 16pt;
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 8px;
          }
        </style>
      </head>
      <body>
                <div class="prescription-container">
          <!-- Header -->
          <div class="header">
            <div class="header-left">
              <!-- Doctor Info Section -->
              <div class="doctor-header-section">
                <div class="doctor-name-main">${prescription.doctorName}</div>
                <div class="doctor-qualifications">M.B.B.S., M.S.(Gen. Surgery), M.Ch. (Plastic Surgery) (Delhi University)</div>
                <div class="doctor-designation">Senior Consultant - <strong>Rehabilitation Medicine</strong>, Apollo Hospital, BBSR</div>
                <div class="doctor-contact">
                  <span class="contact-label">Mob.:</span> 
                  <span class="contact-numbers">9437920023, 8093060023</span>
                </div>
                <div class="doctor-email-web">
                  Email: drlkmishra@gmail.com | www.healinghandrehab.com
                </div>
              </div>
            </div>
            
            <!-- Vertical Divider Line -->
            <div class="header-divider"></div>
            
            <div class="header-right">
              <div class="clinic-logo-section">
                <img src="/clinic-logo.png" alt="Healing Hand Rehabilitation Centre Logo" class="clinic-logo" />
              </div>
            </div>
            ${
              showPreviewBanner
                ? '<div class="preview-banner">PREVIEW</div>'
                : ""
            }
          </div>

          <div class="prescription-content">
            <div class="prescription-main">

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

          <!-- Prescription Title -->
          <div class="prescription-title-main">MEDICAL PRESCRIPTION</div>

          <!-- Patient Information -->
          <div class="patient-section">
            <div class="section-header">Patient Information</div>
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

          <!-- Date -->
          <div class="prescription-date">
            Date: ${new Date(prescription.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>

          <!-- Medications -->
          <div class="medications-section">
            <div class="section-header">💊 Prescribed Medications</div>
            <div class="medications-table">
              <div class="table-header">
                <div class="col-med">Medication</div>
                <div class="col-dose">Dosage</div>
                <div class="col-freq">Frequency</div>
                <div class="col-dur">Duration</div>
                <div class="col-inst">Instructions</div>
              </div>
              ${prescription.medications
                .map(
                  (med, index) => `
                <div class="medication-row">
                  <div class="col-med">
                    <span class="med-number">${index + 1}.</span>
                    <span class="med-name">${med.name}</span>
                  </div>
                  <div class="col-dose">${med.dosage}</div>
                  <div class="col-freq">${med.frequency}</div>
                  <div class="col-dur">${med.duration}</div>
                  <div class="col-inst">${med.instructions || "-"}</div>
                </div>
              `
                )
                .join("")}
            </div>
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

          <!-- Procedure Section -->
          ${
            prescription.procedure
              ? `
            <div class="procedure-section">
              <div class="section-title">🔬 Diagnostic Procedure</div>
              <div class="procedure-content">
                ${prescription.procedure}
              </div>
            </div>
          `
              : ""
          }

         

          <!-- Footer Watermark -->
          <div class="footer-watermark">${clinicName} - Electronic Health Record System${showPreviewBanner ? " - PREVIEW MODE" : ""}</div>
            </div>

            <!-- Right Sidebar for Doctor's Notes -->
            <div class="prescription-sidebar">
              <div class="sidebar-title">Doctor's Notes</div>
              <div class="sidebar-placeholder">
                Space reserved for<br>
                handwritten notes<br>
                and additional<br>
                instructions
              </div>
            </div>
          </div>                   
          <!-- Signature Section -->
          <div class="signature-section">
            <div style="display: flex; justify-content: flex-start; align-items: flex-end;">
              <div style="flex: 1;">
                <div class="signature-line"></div>
                <div class="signature-text">Doctor's Signature</div>
              </div>
            </div>
          </div>
          <!-- Clinic Footer Section -->
          <div class="clinic-footer">
            <div class="clinic-footer-name">HEALING HAND REHABILITATION CENTRE</div>
            <div class="clinic-footer-address">Address: A-15, Ruchika Market, Near Durga Mandap, Baramunda, Bhubaneswar - 751003</div>
            <div class="clinic-footer-timing">Consultation Time: 9am to 7pm | Sundays: 10am to 2pm</div>
          </div>
        </div>
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
