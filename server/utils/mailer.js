const nodemailer = require("nodemailer");

const mailer = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      // EN DEV
        // host: process.env.SMTP_HOST,
        // service: process.env.SMTP_SERVICE,
        // port: Number(process.env.EMAIL_PORT),
        // secure: Boolean(process.env.EMAIL_SECURE),
        // auth: {
        //     user: process.env.SMTP_USER,
        //     pass: process.env.SMTP_PASS,
        // },
        // EN PROD :
        host: process.env.SMTP_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false,
        tls: { ciphers: 'SSLv3' } 
    });
//FBBtn
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: subject,
      html: message,
      attachments: [
        { filename: '909_logo_header.png',
          path: `${__dirname}/images/909_logo_header.png`,
          // path: '../public/mail/images/909_logo_header.png',
          cid: '909header' },
        { filename: '909_logo_footer.png',
          path: `${__dirname}/images/909_logo_footer.png`,
          // path: '../public/mail/images/909_logo_footer.png',
          cid: '909footer' },
        { filename: 'logo_FB_white.png',
          path: `${__dirname}/images/logo_FB_white.png`,
          // path: '../public/mail/images/logo_FB_white.png',
          cid: 'FBBtn' },
        { filename: 'logo_IG_white.png',
          path: `${__dirname}/images/logo_IG_white.png`,
          // path: '../public/mail/images/logo_IG_white.png',
          cid: 'IGBtn' },
        { filename: 'logo_LI_white.png',
          path: `${__dirname}/images/logo_LI_white.png`,
          // path: '../public/mail/images/logo_LI_white.png',
          cid: 'LIBtn' },
        { filename: 'logo_YT_white.png',
          path: `${__dirname}/images/logo_YT_white.png`,
          // path: '../public/mail/images/logo_YT_white.png',
          cid: 'YTBtn' }
      ]
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

module.exports = mailer;