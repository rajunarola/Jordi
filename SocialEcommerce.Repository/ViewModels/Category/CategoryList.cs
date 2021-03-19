using System;
using System.Collections.Generic;
using System.Text;

namespace SocialEcommerce.Repository.ViewModels.Category
{
    public class CategoryList
    {
        public List<CategoryList> SubCategory { get; set; }

        public long Id { get; set; }

        public string CategoryName { get; set; }

        public long ParentCategoryId { get; set; }

        //public int CategoryTypeStatusId { get; set; }

        //public string CategoryType { get; set; }
    }
}
