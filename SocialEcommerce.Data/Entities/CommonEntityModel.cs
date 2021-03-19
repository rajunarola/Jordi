using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SocialEcommerce.Data.Entities
{
   public class CommonEntityModel
    {
        [Key]
        public long Id { get; set; }
        public DateTime CreatedDate { get; set; }
        [MaxLength(450)]
        public string CreatedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        [MaxLength(450)]
        public string ModifiedBy { get; set; }
        [DefaultValue(false)]
        public bool IsDelete { get; set; }
        [DefaultValue(true)]
        public bool IsActive { get; set; }
        
    }
}
