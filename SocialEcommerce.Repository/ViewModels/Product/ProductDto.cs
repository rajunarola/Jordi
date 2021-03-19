using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SocialEcommerce.Repository.ViewModels.Product
{
    public class ProductDto : StoredProcedureBaseDto
    {

        public string ProductName { get; set; }

        public string ProducDescription { get; set; }

        public decimal Price { get; set; }

        public long? CategoryId { get; set; }

        public long? DistributorId { get; set; }
        public long? ProductUserId { get; set; }
        //public List<IFormFile> files { get; set; }

       public string[] FileName { get; set; }

            
    }
 
}
