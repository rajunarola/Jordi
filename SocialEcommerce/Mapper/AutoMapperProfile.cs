using AutoMapper;
using Microsoft.VisualStudio.Web.CodeGeneration.Contracts.Messaging;
using SocialEcommerce.Data.Entities;
using SocialEcommerce.Repository.ViewModels;
using SocialEcommerce.Repository.ViewModels.Common;

namespace SocialEcommerce.WebAPI.Mapper
{
    public class AutoMapperProfile :Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<ApplicationUser, ApplicationUserDto>().ReverseMap();
            CreateMap<Message, ServiceResponse>().ReverseMap();
        }
    }
}
