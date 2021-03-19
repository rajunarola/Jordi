using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SocialEcommerce.Data.Entities
{
    public class ShippingAddress:CommonEntityModel
    {
        [DefaultValue(true)]
        public bool IsBillingAddress { get; set; }

        [Required]
        public string AddressLine1 { get; set; }
        
        public string AddressLine2 { get; set; }

        [Required]
        public string City { get; set; }

        public long? UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }
        [Required, StringLength(10)]
        public string Postcode { get; set; }

        public virtual ICollection<OrdersDetails> OrdersDetails { get; set; }

    }
}
