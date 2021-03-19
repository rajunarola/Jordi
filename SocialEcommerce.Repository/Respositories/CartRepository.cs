using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SocialEcommerce.Data;
using SocialEcommerce.Data.Entities;
using SocialEcommerce.Data.Repository;
using SocialEcommerce.Repository.Extension;
using SocialEcommerce.Repository.Interfaces;
using SocialEcommerce.Repository.Respositories.BaseRepository;
using SocialEcommerce.Repository.ViewModels.Cart;
using SocialEcommerce.Repository.ViewModels.Product;
using SocialEcommerce.Repository.ViewModels.Common;
using SocialEcommerce.Shared.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialEcommerce.Repository.Respositories
{
    public class CartRepository : GenericRepository<Cart>, ICartService
    {
        private readonly ApplicationDbContext _context;
        private readonly IStoredProcedureRepositoryBase _storedProcedureRepository;
        private readonly IMapper _mapper;
        private readonly RoleManager<Role> _roleManager;
        public CartRepository(ApplicationDbContext context,
            IStoredProcedureRepositoryBase storedProcedureRepository,
            IMapper mapper,
            RoleManager<Role> roleManager

             ) : base(context)
        {
            _context = context;
            _storedProcedureRepository = storedProcedureRepository;
            _mapper = mapper;
            _roleManager = roleManager;
        }

        #region Methods
        public ServiceResponse SaveAsync(CartDto input)
        {
           
            try
            {
                var cartData = _mapper.Map<Cart>(input);
                var isProductExist=_context.Cart.Where(x => x.ProductId == cartData.ProductId && x.UserId == cartData.UserId).Select(x=>x.Id).FirstOrDefault();
                var qty = _context.Cart.Where(x => x.ProductId == cartData.ProductId && x.UserId == cartData.UserId).Select(x => x.Quantity).FirstOrDefault();
                if (cartData.Id == 0)
                {
                    #region cart Insert
                    cartData.UserId = input.UserId;
                    cartData.ProductId = input.ProductId;

                    if (isProductExist!=0)
                    {
                        cartData.Id = isProductExist;
                        cartData.Quantity = qty + 1;
                        var res = _context.Cart.Update(cartData);
                        var insertResult = _context.SaveChanges();
                    }
                    else
                    {
                        cartData.Quantity = input.Quantity;
                        var res =  _context.Cart.AddAsync(cartData);
                        var insertResult = _context.SaveChanges();
                    }                                  
                       
                        return new ServiceResponse { status = 1, isSuccess = true, message=CommonMessages.AddToCart };
                        #endregion                     

                }
                return new ServiceResponse { status = 1, isSuccess = true, message = CommonMessages.SomethingWrong };

            }
            catch (Exception e)
            {

                return new ServiceResponse { status = 0, isSuccess = false, message = CommonMessages.SomethingWrong };
            }
        }
        public ServiceResponse EditCartItem(long cartId, int qty)
        {
            try
            {
                var cartData = _context.Cart.FirstOrDefault(x => x.Id == cartId);
                if (cartData != null)
                {
                    cartData.Quantity = qty;
                    _context.Update(cartData);
                    _context.SaveChanges();
                    return new ServiceResponse { status = 1, isSuccess = true, message = "Cart Updated " };

                }
                return new ServiceResponse { status = 0, isSuccess = true, message = CommonMessages.SomethingWrong };

            }
            catch (Exception)
            {

                return new ServiceResponse { status = 0, isSuccess = true, message = CommonMessages.SomethingWrong };
            }
        }
        public ServiceResponse Delete(long id)
        {
            try
            {
                var cartData = _context.Cart.FirstOrDefault(x => x.Id == id);
                if (cartData != null)
                {
                    //if (cartData.Quantity > 1)
                    // {
                    //    cartData.Quantity = cartData.Quantity - 1;
                    //    _context.Update(cartData);
                    //    _context.SaveChanges();
                    //    return new ServiceResponse { status = 1, isSuccess = true, message = "Cart Updated " };

                    //}
                    //else
                    //{
                        _context.Remove(cartData);
                        _context.SaveChanges();
                        return new ServiceResponse { status = 1, isSuccess = true, message = "Item remove from cart " };

                   // }

                }
                else
                {
                    return new ServiceResponse { status = 0, isSuccess = true, message = CommonMessages.SomethingWrong };
                }

            }
            catch (Exception)
            {

                return new ServiceResponse { status = 0, isSuccess = false, message = CommonMessages.SomethingWrong };
            }

        }

        public async Task<ServiceResponse> GetCartItem(long userId)
        {
            try
            {
                List<ProductCartDto> dto = new List<ProductCartDto>();
                var cartItem =   _context.Cart.Where(x => x.UserId == userId).ToList();
                if (cartItem.Count() != 0)
                {
                    foreach (var item in cartItem)
                    {
                        var productData=await _context.ProductMaster.Where(x => x.Id == item.ProductId).FirstOrDefaultAsync();

                        var filename=await _context.ProductsImage.Where(x => x.ProductId == item.ProductId).Select(x=>x.ImageName). FirstOrDefaultAsync();
                       // item.Quantity
                        //var res=_mapper.Map<ProductDto>(productData);
                            ProductCartDto cartDto = new ProductCartDto();
                       

                            cartDto.Quantity = item.Quantity;
                            cartDto.ProductName = productData.ProductName;
                            cartDto.ProducDescription = productData.ProducDescription;
                            cartDto.Price = productData.Price;
                            cartDto.FileName =filename;
                            cartDto.TotalCount =cartDto.Price * cartDto.Quantity;
                            cartDto.ProductId = productData.Id;
                            cartDto.Id = item.Id;          
                            
                                          

                        dto.Add(cartDto);
                    }
                    
                    
                    
                    return new ServiceResponse { status = 1, isSuccess = true, message = "cart data", jsonObj = dto, totalCount = cartItem.Count() };
                }
                else
                {
                    return new ServiceResponse { status = 0, isSuccess = true, message = "Cart is empty" };
                }
            }
            catch (Exception e)
            {
                return new ServiceResponse { status = -1, isSuccess = false, message = CommonMessages.SomethingWrong };

            }
        }
        #endregion
    }
}
