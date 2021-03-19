using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SocialEcommerce.Repository.Interfaces;
using SocialEcommerce.Repository.ViewModels.Cart;
using SocialEcommerce.Repository.ViewModels.Common;

namespace SocialEcommerce.WebAPI.Controllers
{
    [Route("api/cart")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartRepository;
        public readonly IMapper _mapper;
        public CartController(IMapper mapper, ICartService cart)
        {
            _cartRepository = cart;
            _mapper = mapper;

        }
        [HttpPost]
        [Route("save")]
        public ServiceResponse Save(CartDto data)
        {
          return  _cartRepository.SaveAsync(data);
           
        }

        [HttpPost]
        [Route("delete")]
        public ServiceResponse Delete(long id)
        {
            return _cartRepository.Delete(id);
        }
        [HttpGet]
        [Route("getCartItem")]
        public async Task<ServiceResponse> GetCartItem(long userId)
        {
            return await _cartRepository.GetCartItem(userId);
        }
        [HttpPost]
        [Route("editCartItem")]
        public ServiceResponse EditCartItem(long cartId, int qty) 
        {
            return _cartRepository.EditCartItem(cartId, qty);
        }
    }
}
