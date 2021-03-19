using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SocialEcommerce.Data.Entities
{
    public class ProductsImages:CommonEntityModel
    {
        
        public long? ProductId { get; set; }
        [ForeignKey("ProductId")]
        public virtual ProductMaster Product { get; set; }

        [Required]
        public string ImageName { get; set; }

    }
}
