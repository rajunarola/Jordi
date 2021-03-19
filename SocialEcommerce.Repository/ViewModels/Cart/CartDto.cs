using System;
using System.Collections.Generic;
using System.Text;

namespace SocialEcommerce.Repository.ViewModels.Cart
{
    public class CartDto
    {
        public long? Id { get; set; }
        public long? ProductId { get; set; }
        public int Quantity { get; set; }
        public int TotalCount { get; set; }
        public long UserId { get; set; }
    }
}
