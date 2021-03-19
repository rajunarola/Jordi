using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SocialEcommerce.Data.Entities
{
    public class ProductMaster:CommonEntityModel
    {
        [Required, StringLength(50)]
        public string ProductName { get; set; }

        [Required]
        public string ProducDescription { get; set; }
        [Required]
        public decimal Price { get; set; }

        public long? CategoryId { get; set; }
        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; }
        public long? DistributorId { get; set; }
        [ForeignKey("DistributorId")]
        public virtual ApplicationUser Distributor { get; set; }

        public long? UserId { get; set; }
        //[ForeignKey("UserId")]
        //public virtual ApplicationUser User { get; set; }

        public virtual ICollection<Cart> Carts { get; set; }
        public virtual ICollection<ProductsImages> ProductsImages { get; set; }


    }
}
