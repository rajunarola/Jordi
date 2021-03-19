using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;


namespace SocialEcommerce.Data.Entities
{
    public class Category : CommonEntityModel
    {
        public string CategoryName { get; set; }

        public int DisplayOrder { get; set; }

        public long? ParentCategoryId { get; set; }

        [ForeignKey("ParentCategoryId")]
        public virtual Category ParentCategoryFk { get; set; }

        public bool IsSpecial { get; set; }
       public virtual ICollection<ProductMaster> ProductMaster { get; set; }



    }
}
