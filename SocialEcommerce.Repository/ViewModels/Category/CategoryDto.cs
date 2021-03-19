using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace SocialEcommerce.Repository.ViewModels.Category
{
    public class CategoryDto : StoredProcedureBaseDto
    {
        [Required]
        [MaxLength(150)]
        public string CategoryName { get; set; }
        [Bindable(false)]
        public long? ParentCategoryId { get; set; }
        [Required]
        public int DisplayOrder { get; set; }
        public bool IsSpecial { get; set; }

    }
}
