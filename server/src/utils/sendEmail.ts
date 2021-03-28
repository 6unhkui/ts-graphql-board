import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    const testAccount = await nodemailer.createTestAccount();
    console.log(testAccount);

    // create reusable transporter object using the default SMTP transport
    const transporter = await nodemailer.createTransport({
        host: "smtp.daum.net",
        port: 465,
        // secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.NODEMAILER_USER, // generated ethereal user
            pass: process.env.NODEMAILER_PASS // generated ethereal password
        }
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: `✨ Board App Team <${process.env.NODEMAILER_FROM_EMAIL}>`,
        to,
        subject,
        html
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
