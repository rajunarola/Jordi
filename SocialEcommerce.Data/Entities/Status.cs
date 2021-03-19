using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SocialEcommerce.Data.Entities
{
   public class Status: CommonEntityModel
    {
        [Required, StringLength(20)]
        public string StatusType { get; set; }

        public virtual ICollection<Orders> Orders { get; set; }

    }
}
