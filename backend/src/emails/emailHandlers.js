import { resendClient,sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "./emailTemplates.js";

export const sendWelcomeEmail =async(email , name , clientURL)=>{

    const { data, error } = await resendClient.emails.send({
    from:`${sender.name} <${sender.email}>`,
    to: email,
    subject: 'Welcome to ChatHub',
    html: createWelcomeEmailTemplate(name , clientURL),
  });

      if (error) {
    return console.error("Error at sending welcome email",error );
  }

  console.log("welcome email sent success",data);

}