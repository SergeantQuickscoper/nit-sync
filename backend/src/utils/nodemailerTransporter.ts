import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
      user: "dr24csb0b20@student.nitw.ac.in",
      pass: process.env.GMAIL_DR_APPPASS,
    },
  });

  export default transporter;