using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SocialEcommerce.Data.Entities;
using SocialEcommerce.Repository.Interfaces;
using SocialEcommerce.Repository.ViewModels;
using SocialEcommerce.Repository.ViewModels.Common;
using SocialEcommerce.Repository.ViewModels.StoredProcedure;
using SocialEcommerce.WebAPI.Common;

namespace SocialEcommerce.WebAPI.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        public readonly IUserService _userRepository;
        public readonly IMapper _mapper;

        public UserController(IMapper mapper, IUserService userRepository)
        {
            _mapper = mapper;
            _userRepository = userRepository;
        }

        [HttpGet]
        [Route("getAllDistributor")]
        public async Task<List<UserDto>> GetDistributorList()
        {

            return await _userRepository.GetAllDistributor();
        }
        [HttpGet]
        [Route("getAllUser")]
        public async Task<List<UserDto>> GetAllUser()
        {

            return await _userRepository.GetAllUser();
        }
        [HttpPost]
        [Route("SetActivationStatus")]
        public ServiceResponse ManageUserStatus(long Id)
        {
            return _userRepository.ManageUserStatus(Id);
        }

        [HttpPost]
        [Route("DeleteUser")]
        public ServiceResponse Delete(long Id)
        {
            return _userRepository.Delete(Id);
        }
        [HttpGet]
        [Route("getDistributorList")]
        public Task<ServiceResponse> GetDistributorDropDown(long? Id)
        {
            return _userRepository.GetDistributorDropDown(Id);
        }


    }
}
