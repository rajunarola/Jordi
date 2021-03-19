using System;
using System.Collections.Generic;
using System.Text;

namespace SocialEcommerce.Shared.Constants
{
    public class AppConstant
    {
        //Constants for AppId
        public const string User = "24ebd59f56024ae6a386c329a2074448";
        public const string Admin = "a8a2888138f5472f97463112dbf9cdba";
        public const string Distributor = "b7b527e9b54a40a08e1161193221fd3d";
        public const string CategoryExcelPath = "Category.xlsx";        
    }
   
    public class MailLogoURL
    {
        //Constants for logo in mail
        //public const string PathURL = "http://clientapp.narola.online:1109";
        public const string PathURL = "http://clientapp.narola.online:1109/images/logo.png";
        public const string LogoURL = "images/logo.png";

    }
    public static class AuthorizeRoles
    {
        public const string AdminRole = "Admin";
        public const string DistributorRole = "Distributor";
        public const string UserRole = "User";
    }

    public static class CommonMessages
    {
       
        public const string ActiveStatus = "Actived Succesfully";
        public const string DeactiveStatus = "Deactived Succesfully";
        public const string DeleteStatus = "Deleted Succesfully";
        public const string SomethingWrong = "Something Went Wrong";
        public const string FileUploadSucess = "File Upload Succesfully";
        public const string AddToCart = "Item added to cart";

    }
    public static class FolderPath
    {
        public const string ProductImage = @"ProductImages";
        public const string webRootPath = @"wwwroot";

    }
}
