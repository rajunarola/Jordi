using SocialEcommerce.Data.Entities;
using SocialEcommerce.Repository.Interfaces.BaseInterface;
using SocialEcommerce.Repository.ViewModels.Cart;
using SocialEcommerce.Repository.ViewModels.Common;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SocialEcommerce.Repository.Interfaces
{
    public interface ICartService : IGenericService<Cart>
    {
        ServiceResponse SaveAsync(CartDto input);
        ServiceResponse Delete(long id);
        Task<ServiceResponse> GetCartItem(long userId);
        ServiceResponse EditCartItem(long cartId, int qty);
    }
}
