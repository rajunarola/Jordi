using System;
using System.Collections.Generic;
using System.Text;

namespace SocialEcommerce.Repository.ViewModels.Product
{
    public class ProductImageDto
    {
        public string ImageName { get; set; }
        public long ProductId { get; set; }
        public long UserId { get; set; }

    }
}
