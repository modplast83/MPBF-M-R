import { MailService } from "@sendgrid/mail";

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

interface CustomerFormData {
  commercialNameAr: string;
  commercialNameEn: string;
  commercialRegistrationNo: string;
  unifiedNo: string;
  vatNo?: string;
  province: string;
  city?: string;
  neighborName?: string;
  buildingNo: string;
  additionalNo: string;
  postalCode: string;
  responseName: string;
  responseNo: string;
}

export async function sendCustomerFormNotification(
  customerData: CustomerFormData,
): Promise<boolean> {
  try {
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9f9f9; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { width: 80px; height: 80px; background-color: #16a34a; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; }
        .logo-text { color: white; font-size: 12px; font-weight: bold; text-align: center; line-height: 1.2; }
        .title { color: #16a34a; font-size: 24px; font-weight: bold; margin: 0; }
        .subtitle { color: #666; font-size: 16px; margin: 10px 0 0 0; }
        .section { margin: 25px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #16a34a; }
        .section-title { color: #16a34a; font-size: 18px; font-weight: bold; margin: 0 0 15px 0; }
        .field { margin: 10px 0; }
        .field-label { font-weight: bold; color: #333; display: inline-block; min-width: 180px; }
        .field-value { color: #666; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 14px; }
        .timestamp { background-color: #e3f2fd; padding: 10px; border-radius: 5px; margin: 20px 0; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">
            <div class="logo-text">
              MODERN<br>PLASTIC BAG<br>FACTORY
            </div>
          </div>
          <h1 class="title">New Customer Registration</h1>
          <p class="subtitle">A new customer has submitted their business information</p>
        </div>

        <div class="timestamp">
          <strong>Submitted on:</strong> ${new Date().toLocaleString("en-US", {
            timeZone: "Asia/Riyadh",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })} (Saudi Arabia Time)
        </div>

        <div class="section">
          <h2 class="section-title">Company Information</h2>
          <div class="field">
            <span class="field-label">Arabic Name:</span>
            <span class="field-value">${customerData.commercialNameAr}</span>
          </div>
          <div class="field">
            <span class="field-label">English Name:</span>
            <span class="field-value">${customerData.commercialNameEn}</span>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Registration Details</h2>
          <div class="field">
            <span class="field-label">Commercial Registration:</span>
            <span class="field-value">${customerData.commercialRegistrationNo}</span>
          </div>
          <div class="field">
            <span class="field-label">Unified Number:</span>
            <span class="field-value">${customerData.unifiedNo}</span>
          </div>
          ${
            customerData.vatNo
              ? `
          <div class="field">
            <span class="field-label">VAT Number:</span>
            <span class="field-value">${customerData.vatNo}</span>
          </div>
          `
              : ""
          }
        </div>

        <div class="section">
          <h2 class="section-title">Address Information</h2>
          <div class="field">
            <span class="field-label">Province:</span>
            <span class="field-value">${customerData.province}</span>
          </div>
          ${
            customerData.city
              ? `<div class="field">
            <span class="field-label">City:</span>
            <span class="field-value">${customerData.city}</span>
          </div>`
              : ""
          }
          ${
            customerData.neighborName
              ? `<div class="field">
            <span class="field-label">Neighborhood:</span>
            <span class="field-value">${customerData.neighborName}</span>
          </div>`
              : ""
          }
          <div class="field">
            <span class="field-label">Building Number:</span>
            <span class="field-value">${customerData.buildingNo}</span>
          </div>
          <div class="field">
            <span class="field-label">Additional Number:</span>
            <span class="field-value">${customerData.additionalNo}</span>
          </div>
          <div class="field">
            <span class="field-label">Postal Code:</span>
            <span class="field-value">${customerData.postalCode}</span>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Contact Information</h2>
          <div class="field">
            <span class="field-label">Responsible Person:</span>
            <span class="field-value">${customerData.responseName}</span>
          </div>
          <div class="field">
            <span class="field-label">Phone Number:</span>
            <span class="field-value">${customerData.responseNo}</span>
          </div>
        </div>

        <div class="footer">
          <p><strong>Modern Plastic Bag Factory</strong></p>
          <p>Customer Registration System</p>
          <p>This is an automated notification. Please review the customer information and take appropriate action.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Send notification email
    await mailService.send({
      to: "info@modernplasticbag.com", // Replace with your actual admin email
      from: "noreply@modernplasticbag.com", // Replace with your verified SendGrid sender email
      subject: `🆕 New Customer Registration: ${customerData.commercialNameEn || customerData.commercialNameAr}`,
      html: emailHtml,
      text: `
New Customer Registration Submitted

Company Information:
- Arabic Name: ${customerData.commercialNameAr}
- English Name: ${customerData.commercialNameEn}

Registration Details:
- Commercial Registration: ${customerData.commercialRegistrationNo}
- Unified Number: ${customerData.unifiedNo}
${customerData.vatNo ? `- VAT Number: ${customerData.vatNo}` : ""}

Address:
- Province: ${customerData.province}
- City: ${customerData.city}
- Neighborhood: ${customerData.neighborName}
- Building: ${customerData.buildingNo}
- Additional: ${customerData.additionalNo}
- Postal Code: ${customerData.postalCode}

Contact:
- Person: ${customerData.responseName}
- Phone: ${customerData.responseNo}

Submitted: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Riyadh" })} (Saudi Arabia Time)
      `,
    });

    console.log("Customer form notification email sent successfully");
    return true;
  } catch (error) {
    console.error("Failed to send customer form notification email:", error);
    return false;
  }
}
