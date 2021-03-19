using System;
using System.Collections.Generic;
using System.Text;

namespace SocialEcommerce.Repository.ViewModels.Cart
{
    public class ProductCartDto
    {
        public long? Id { get; set; }
        public long? ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal TotalCount { get; set; }
        public string ProductName { get; set; }

        public string ProducDescription { get; set; }
        public string FileName { get; set; }
        public decimal Price { get; set; }

    }
}
