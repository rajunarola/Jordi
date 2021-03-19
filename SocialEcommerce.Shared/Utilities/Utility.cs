using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace SocialEcommerce.Shared.Utilities
{
    public static class Utility
    {  
        public static string GetEmailTemplate(string directory, string fileName)
        {
           // string path = "~/";
            string header = "", footer = "", body = "";

            using (StreamReader reader = new StreamReader("~/EmailTemplates/_layoutTemplate/EmailHeader.html"))
            {
                header = reader.ReadToEnd();
            }
            using (StreamReader reader = new StreamReader("~/EmailTemplates/" + directory   + "/" + fileName))
            {
                body = reader.ReadToEnd();
            }
            using (StreamReader reader = new StreamReader("~/EmailTemplates/_layoutTemplate/EmailFooter.html" ))
            {
                footer = reader.ReadToEnd();
            }
            return header + body + footer;
        }

        public static string ReadEmailTemplate(string currentPath, string templateName, string physicalUrl)
        {
            try
            {
                string fullPath = CheckServerPath(currentPath, @"EmailTemplates\", templateName);
                string body;
                using (var sr = new StreamReader(fullPath))
                {
                    body = sr.ReadToEnd();
                }

                body = body.Replace("{url}", physicalUrl);
                return body;
            }
            catch (Exception ex)
            {
               
                return ex.Message;
            }
        }

        public static string CheckServerPath(string currentPath, string folderPath, string fileName)
        {
            var fullPath = Path.Combine(currentPath, folderPath);
            if (!Directory.Exists(fullPath))
                Directory.CreateDirectory(fullPath);
            return Path.Combine(fullPath, fileName);
        }

    }
}
