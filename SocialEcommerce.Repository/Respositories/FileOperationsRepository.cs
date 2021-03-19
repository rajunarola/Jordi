using Microsoft.AspNetCore.Http;
using SocialEcommerce.Repository.ViewModels.Common;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;

namespace SocialEcommerce.Repository.Respositories
{
    public class  FileOperationsRepository
    {
        public  List<FileUploadDto> FileUpload(string folderName, List<IFormFile> files)
        {
            try
            {
                List<FileUploadDto> dataObj = new List<FileUploadDto>();

                var file = files;                
                string webRootPath = @"wwwroot";
                string newPath = Path.Combine(webRootPath, folderName);
                if (!Directory.Exists(newPath))
                {
                    Directory.CreateDirectory(newPath);
                }

                if (file.Count() > 0)
                {
                    foreach (var fileItem in file)
                    {
                        FileUploadDto fileUploadDto = new FileUploadDto();
                        string fileName = ContentDispositionHeaderValue.Parse(fileItem.ContentDisposition).FileName.Trim('"');
                        string newFileName = DateTime.Now.ToString("HHmmss");
                        fileName = newFileName + fileName;
                        string fullPath = Path.Combine(newPath, fileName);
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            fileUploadDto.ImageName = fileName;
                            fileItem.CopyTo(stream);
                        }
                        dataObj.Add(fileUploadDto);
                    }

                }
                return dataObj;
            }

            catch (Exception e)
            {

                throw; 

            }
        }

        public List<string> ImageToBase64(List<string> path)
        {
            List<string>  base64String=new List<string>();
            foreach (var item in path)
            {
                using (Image image = Image.FromFile(item))
                {
                    using (MemoryStream m = new MemoryStream())
                    {
                        image.Save(m, image.RawFormat);
                        byte[] imageBytes = m.ToArray();

                        // Convert byte[] to Base64 String
                        base64String.Add("data:image/png;base64," + Convert.ToBase64String(imageBytes));
                        
                    }
                }
            }
            return base64String;
            
        }
    }
}
