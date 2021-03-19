using System;
using System.Collections.Generic;
using System.Text;

namespace SocialEcommerce.Repository.ViewModels.Common
{
   public class ServiceResponse
    {
        public int status { get; set; }
        public bool isSuccess { get; set; }
        public string message { get; set; }
        public object jsonObj { get; set; }
        public int totalCount { get; set; }
    }
}
