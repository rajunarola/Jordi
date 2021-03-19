using SocialEcommerce.Data.Entities;
using SocialEcommerce.Repository.Interfaces.BaseInterface;
using SocialEcommerce.Repository.ViewModels.Product;
using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using System.Text;
using System.Threading.Tasks;
using SocialEcommerce.Repository.ViewModels;
using SocialEcommerce.Repository.ViewModels.Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using SocialEcommerce.Repository.ViewModels.StoredProcedure;

namespace SocialEcommerce.Repository.Interfaces
{
   public interface IProductService : IGenericService<ProductMaster>
    {
        Task<ServiceResponse> GetAll(SPInput input, long UserId, bool isAdmin);
        Task<ServiceResponse> GetAllAdminProduct(SPInput input, long UserId);
        Task SaveAsync(ProductDto input);
        ServiceResponse Delete(long id, long userId);
        ServiceResponse GetById(long id);
        ServiceResponse ManageUserStatus(long Id);
        Task<ServiceResponse> GetAllUserProduct(SPInput input, long UserId);
        Task<ServiceResponse> GetAllProduct(SPInput input, long UserId);
        ServiceResponse GetLastNProduct(int numberOfProduct);
    }
}
