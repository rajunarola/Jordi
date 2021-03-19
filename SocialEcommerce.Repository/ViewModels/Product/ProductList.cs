using System;
using System.Collections.Generic;
using System.Text;

namespace SocialEcommerce.Repository.ViewModels.Product
{
   public class ProductList: CommonDto
    {
        public string ProductName { get; set; }

        public string ProducDescription { get; set; }

        public decimal Price { get; set; }

        public string CategoryName { get; set; }
        public long? DistributorId { get; set; }
        public long? ProductUserId { get; set; }
        //public long? CategoryId { get; set; }

        public string ImageName { get; set; }
    }
}
