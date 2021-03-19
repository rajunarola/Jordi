using AutoMapper;
using IdentityServer4.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using SocialEcommerce.Data;
using SocialEcommerce.Data.Entities;
using SocialEcommerce.Data.Repository;
using SocialEcommerce.Repository.Interfaces;
using SocialEcommerce.Repository.Respositories.BaseRepository;
using SocialEcommerce.Repository.ViewModels;
using SocialEcommerce.Repository.ViewModels.Common;
using SocialEcommerce.Repository.ViewModels.StoredProcedure;
using SocialEcommerce.Shared.Constants;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialEcommerce.Repository.Respositories
{
   public class UserRepository : GenericRepository<ApplicationUser>, IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly IStoredProcedureRepositoryBase _storedProcedureRepository;
        private readonly UserManager<ApplicationUser> _user;
        private readonly RoleManager<Role> _roleManager;
        private readonly IMapper _mapper;
        public UserRepository(ApplicationDbContext context,
            IStoredProcedureRepositoryBase storedProcedureRepository,
            UserManager<ApplicationUser> user, IMapper mapper,
              RoleManager<Role> roleManager
            ) : base(context)
        {
            _mapper = mapper;
            _user =user;
           _context = context;
            _storedProcedureRepository = storedProcedureRepository;
            _roleManager = roleManager;
        }
        //for datatable
        public  async Task<List<UserDto>> GetAllDistributor()
        {
            try
            {
                var distributorList = await _user.GetUsersInRoleAsync(AuthorizeRoles.DistributorRole);
                if (distributorList.Count == 0) return null;
                
                    var res = distributorList.Where(x => x.IsDelete == false);
                    return _mapper.Map<List<UserDto>>(res);
                
            }
            catch (Exception e)
            {
                return null;
            }
        }
        public async Task<List<UserDto>> GetAllUser()
        {
            try
            {
                var UserList = await _user.GetUsersInRoleAsync(AuthorizeRoles.UserRole);
                if (UserList.Count == 0) return null;

                var res = UserList.Where(x => x.IsDelete == false);
                return _mapper.Map<List<UserDto>>(res);

            }
            catch (Exception e)
            {
                return null;
            }
        }
        public ServiceResponse ManageUserStatus(long Id) {
            try
            {
                var userRes =  _context.Users.FirstOrDefault(x=>x.Id==Id);
                if (userRes != null)
                {
                    userRes.IsActive = !userRes.IsActive;
                    _context.Users.Update(userRes);
                    _context.SaveChanges();
                    var message=$@"User {(userRes.IsActive ? "activated" : "deactivated")} successfully.";
                    return new ServiceResponse { status = 1, isSuccess =true,message=message }; 
                }
                else {
                    return new ServiceResponse { status = 0, isSuccess = false, message = CommonMessages.SomethingWrong };
                }
            }
            catch(Exception e)
            {
                return  new ServiceResponse { status = 0, isSuccess = false, message = e.Message };
            }
        }
        public ServiceResponse Delete(long Id)
        {
            try
            {
                var userRes = _context.Users.FirstOrDefault(x => x.Id == Id);
                if (userRes != null)
                {
                    userRes.IsDelete = true;
                    _context.Users.Update(userRes);
                    _context.SaveChanges();
                       return  new ServiceResponse { status = 1, isSuccess = true, message = "User " + CommonMessages.DeleteStatus };
                }
                else
                {
                    return new ServiceResponse { status = 0, isSuccess = false, message =CommonMessages.SomethingWrong };
                }
            }
            catch (Exception e)
            {
                return new ServiceResponse { status = 0, isSuccess = false, message = e.Message };
            }
        }

        public async Task<ServiceResponse> GetDistributorDropDown(long? Id)
        {
            try
            {
                var DesList =  await _user.GetUsersInRoleAsync(AuthorizeRoles.DistributorRole);
                if (DesList.Count == 0) return null;

                List<CommonDropDownDto> distributorList = new List<CommonDropDownDto>();

                foreach (var item in DesList)
                {
                    distributorList.Add(new CommonDropDownDto
                    {
                        Label = item.FullName,
                        Value = item.Id,
                    });
                }
                return new ServiceResponse { status = 1, isSuccess = true, message = "Distributor data", jsonObj = distributorList };
            }
            catch (Exception)
            {

                return new ServiceResponse { status = 0, isSuccess = false, message = CommonMessages.SomethingWrong };
            }


        }

    }
}
