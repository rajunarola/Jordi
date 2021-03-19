using System;
using System.Collections.Generic;
using System.Text;

namespace SocialEcommerce.Shared.Constants
{
    public static class EmailConstant
    { 

        public const string  MailFrom = "narolamma@gmail.com";
        public const string SmtpHost = "smtp.gmail.com";
        public const int SmtpPort = 587;
        public const bool UseDefaultCredentials = true;
        public const string EmailPassword = "Password123#";
        public const bool EnableSsl = true;

        public static class TemplateName
        {
            public const string ConfirmEmail = @"ConfirmEmailTemplate.html";
            public const string ForgotPassword = @"ForgetPasswordTemplate.html";


        }
    }

   
}
