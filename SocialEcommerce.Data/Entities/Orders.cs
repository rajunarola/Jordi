using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SocialEcommerce.Data.Entities
{
    public class Orders:CommonEntityModel
    {
        [Required]
        public long OrderNumber { get; set; }

        
        public long? UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }
        
        public long? StatusId { get; set; }
        [ForeignKey("StatusId")]
        public virtual Status Status { get; set; }

        public virtual ICollection<OrdersDetails> OrdersDetails { get; set; }

    }
}
