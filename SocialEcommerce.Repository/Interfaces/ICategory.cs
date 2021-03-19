using Microsoft.AspNetCore.Mvc;
using SocialEcommerce.Repository.ViewModels;
using SocialEcommerce.Repository.ViewModels.Category;
using SocialEcommerce.Repository.ViewModels.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SocialEcommerce.Repository.Interfaces
{
    public interface ICategory
    {
        Task SaveAsync(CategoryDto input);
        Task<CategoryDto> GetById(long id);
        Task<ServiceResponse> GetAll(CommonSpParameterInputDto input);
        ServiceResponse Delete(CommonDto input);
        Task<List<DropDownDto>> GetCategoryForDropDown(long? Id);
        Task<bool> ActiveDeactiveCategory(CommonDto input);
        ServiceResponse IsExistCategoryName(string input);
        Task<List<CategoryList>> GetChildCategoryForProductListMenu(long parentCategoryId);
        Task<List<CategoryList>> GetCategoryForSideBarAsync();
        List<CategoryList> GetChildCategory(List<CategoryList> data, long CategoryID);
        ServiceResponse GetParentCategoryDropDown();

    }
}
