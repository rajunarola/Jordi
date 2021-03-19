using SocialEcommerce.Data.Entities;
using SocialEcommerce.Repository.Interfaces.BaseInterface;
using SocialEcommerce.Repository.ViewModels;
using SocialEcommerce.Repository.ViewModels.StoredProcedure;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SocialEcommerce.Repository.ViewModels.Common;

namespace SocialEcommerce.Repository.Interfaces
{
   public interface IUserService:IGenericService<ApplicationUser>
    {
        Task<List<UserDto>> GetAllDistributor();
        Task<List<UserDto>> GetAllUser();
        ServiceResponse ManageUserStatus(long Id);
        ServiceResponse Delete(long Id);
        Task<ServiceResponse> GetDistributorDropDown(long? Id);
    }
}
