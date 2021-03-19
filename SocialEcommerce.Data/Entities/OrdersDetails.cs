using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SocialEcommerce.Data.Entities
{
    public class OrdersDetails:CommonEntityModel
    {
        
        public long? OrderId { get; set; }
        [ForeignKey("OrderId")]
        public virtual Orders Order { get; set; }
        

        public long? ShippingAddressId { get; set; }
        [ForeignKey("ShippingAddressId")]
        public virtual ShippingAddress ShippingAddress { get; set; }
        
        [Required]
        public int Quantity { get; set; }
        [Required]
        public decimal Price { get; set; }
        public long? DistributorId { get; set; }
        [ForeignKey("DistributorId")]
        public virtual ApplicationUser Distributor { get; set; }



    }
}
