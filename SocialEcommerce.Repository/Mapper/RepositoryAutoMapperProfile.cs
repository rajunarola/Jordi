using AutoMapper;
using SocialEcommerce.Data.Entities;
using SocialEcommerce.Repository.ViewModels;
using SocialEcommerce.Repository.ViewModels.Category;
using SocialEcommerce.Repository.ViewModels.Product;
using SocialEcommerce.Repository.ViewModels.Cart;


namespace SocialEcommerce.Repository.Mapper
{
    public class RepositoryAutoMapperProfile : Profile
    {
        public RepositoryAutoMapperProfile()
         {
            CreateMap<CategoryDto, Category>().ReverseMap();
            CreateMap<UserDto, ApplicationUser>().ReverseMap();
            CreateMap<ProductMaster,ProductDto>()
                .ForMember(des => des.ProductUserId, opt => opt.MapFrom(src => src.UserId))
                //.ForMember(des => des.files, opt => opt.Ignore())
                .ReverseMap();
            CreateMap<Cart,CartDto>().ReverseMap();
            CreateMap<ProductImageDto, ProductsImages>().ReverseMap();
            CreateMap<CategoryDropdownDto, Category>().ReverseMap();





            // .ForMember(des => des.Id, opt => opt.MapFrom(src => src.Id))

        }

    }
}
