using SocialEcommerce.Shared.Constants;
using System;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading;

namespace SocialEcommerce.Shared.Utilities
{
    public static class EmailService
    {   
        public static void Send(string subject, string body, string email, string attachment = null)
        {
            
            Thread emailThread = new Thread(delegate ()
            {
                SendEmail(subject, body, email, attachment);
            });
            emailThread.IsBackground = true;
            emailThread.Start();
        }
        private static bool SendEmail(string subject, string body, string email , string attachment)
        {
            try
            {
                var mail = new MailMessage();
                mail.To.Add(new MailAddress(email));
                mail.From = new MailAddress(EmailConstant.MailFrom, "Social Ecommerce");
                mail.Subject = subject;
                mail.Body = body;
                mail.IsBodyHtml = true;
                var smtp = new SmtpClient
                {
                    Host = EmailConstant.SmtpHost,
                    Port = EmailConstant.SmtpPort,
                    UseDefaultCredentials = EmailConstant.UseDefaultCredentials,
                    Credentials = new NetworkCredential(EmailConstant.MailFrom,
                        EmailConstant.EmailPassword),
                    EnableSsl = EmailConstant.EnableSsl
                };
                if (attachment != null)
                    mail.Attachments.Add(new Attachment(attachment));
                smtp.Send(mail);
                return true;
            }
            catch (Exception ex)
            {
                var exception = ex;
                return false;
            }
        }

        
    }
}
