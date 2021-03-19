using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocialEcommerce.Data.Entities;
using SocialEcommerce.Repository.Interfaces;
using SocialEcommerce.Repository.Interfaces.BaseInterface;
using SocialEcommerce.Repository.ViewModels;
using SocialEcommerce.Repository.ViewModels.Common;
using SocialEcommerce.Repository.ViewModels.Product;
using SocialEcommerce.Repository.ViewModels.StoredProcedure;
using SocialEcommerce.WebAPI.Utility;

namespace SocialEcommerce.WebAPI.Controllers
{
   //[Authorize]
    [Route("api/product")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productSrvice;

        public ProductController(IProductService product)
        {
            _productSrvice = product;
        }

        [HttpPost]
        [Route("getAll")]
        public async Task<ServiceResponse> GetProductList(SPInput input, long UserId, bool isAdmin)
        {
            return await _productSrvice.GetAll(input, UserId, isAdmin);
        }
        [HttpPost]
        [Route("getAllAdminProduct")]
        public async Task<ServiceResponse> GetAdminProductList(SPInput input, long UserId)
        {
            return await _productSrvice.GetAllAdminProduct(input, UserId);
        }
        [HttpPost]
        [Route("getAllUserProduct")]
        public async Task<ServiceResponse> GetUserProductList(SPInput input, long UserId)
        {
            return await _productSrvice.GetAllUserProduct(input, UserId);
        }
        [HttpPost]
        [Route("getAllProductList")]
        public async Task<ServiceResponse> GetProductList(SPInput input, long UserId)
        {
            return await _productSrvice.GetAllProduct(input, UserId);
        }
        [HttpPost]
        [Route("save")]
        public async Task Save(ProductDto product)
        {          
          await _productSrvice.SaveAsync(product);         
        }

        [HttpPost]
        [Route("delete")]
        public ServiceResponse Delete(long id,long userId)
        {
            return _productSrvice.Delete(id,userId);
        }
        [HttpGet]
        [Route("getById/{id}")]
        public ServiceResponse GetProductById(long id)
        {
            return  _productSrvice.GetById(id);
        }
        [HttpPost]
        [Route("ManageActivateStatus")]
        public ServiceResponse ManageUserStatus(long Id)
        {
            return _productSrvice.ManageUserStatus(Id);
        }
        [HttpPost]
        [Route("getLastNProduct")]
        public ServiceResponse GetLastNProduct(int numberOfProduct)
        {
            return _productSrvice.GetLastNProduct(numberOfProduct);

        }
    }
}
