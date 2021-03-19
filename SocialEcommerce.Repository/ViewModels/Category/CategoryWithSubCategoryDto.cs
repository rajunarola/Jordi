using System;
using System.Collections.Generic;
using System.Text;

namespace SocialEcommerce.Repository.ViewModels
{
    public class CategoryWithSubCategoryDto
    {
        public long ID { get; set; }
        public string CategoryWithSubcategory { get; set; }
        public int Level { get; set; }
        public long? ParentCategoryID { get; set; }
    }
}
