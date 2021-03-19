using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using SocialEcommerce.Repository.Interfaces;
using SocialEcommerce.Repository.ViewModels;
using SocialEcommerce.Repository.ViewModels.Category;
using SocialEcommerce.Repository.ViewModels.Common;
using SocialEcommerce.Shared.Constants;

namespace SocialEcommerce.WebAPI.Controllers
{
    //[Authorize(Roles = AuthorizeRoles.AdminRole)]
    //[Authorize]
    [Route("api/category")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategory _categoryRepository;
        public readonly IMapper _mapper;

        public CategoryController(IMapper mapper, ICategory category)
        {
            _categoryRepository = category;
            _mapper = mapper;

        }
       
        [HttpPost]
        [Route("save")]
        public async Task Save(CategoryDto category)
        {
           
                await _categoryRepository.SaveAsync(category);
          
           
        }

        [HttpPost]
        [Route("getAll")]
        public async Task<ServiceResponse> GetCategoryList(CommonSpParameterInputDto input)
        {
            return await _categoryRepository.GetAll(input);
            
        }

        [HttpGet]
        [Route("getById/{id}")]
        public async Task<CategoryDto> GetCategoryById(long id)
        {
            return await _categoryRepository.GetById(id);
        }

        [HttpPost]
        [Route("delete")]
        public ServiceResponse Delete(CommonDto input)
        {
            return _categoryRepository.Delete(input);
        }
        [HttpPost]
        [Route("checkCategory")]
        public ServiceResponse IsExistCategoryName(string input)
        {
            return _categoryRepository.IsExistCategoryName(input);
        }
        [HttpGet]
        [Route("categoryDropDown")]
        public async Task<IList<DropDownDto>> GetCategoryDropDown(long? Id)
        {
            return await _categoryRepository.GetCategoryForDropDown(Id);
        }

        [HttpPost]
        [Route("activeDeactiveCategory")]
        public async Task<bool> ActiveDeactiveCategory(CommonDto input)
        {
            return await _categoryRepository.ActiveDeactiveCategory(input);
        }
        [HttpGet]
        [Route("getCategoryForSideBar")]
        public ServiceResponse GetCategoryForSideBar()
        {
            var data = _categoryRepository.GetCategoryForSideBarAsync();
            if (data.Result.Count != 0)
            {

                return new ServiceResponse { status = 1, isSuccess = true, message = "Category side bar data", jsonObj = data.Result };
            }
            else
            {
                return new ServiceResponse { status = 0, isSuccess = true, message = "Someting went wrong" };
            }

        }
        [HttpPost]
        [Route("getChildCategory")]
        public  ServiceResponse ChildCategory(List<CategoryList> data, long CategoryID)
        {

            var res = _categoryRepository.GetChildCategory(data, CategoryID);
            if (res.Count != 0)
            {

                return new ServiceResponse { status = 1, isSuccess = true, message = "Category side bar data", jsonObj = res };
            }
            else
            {
                return new ServiceResponse { status = 0, isSuccess = true, message = "Someting went wrong" };
            }

        }
        [HttpGet]
        [Route("getParentCategory")]
        public ServiceResponse GetParentCategoryDropDown()
        {
            return  _categoryRepository.GetParentCategoryDropDown();
        }
    }
}