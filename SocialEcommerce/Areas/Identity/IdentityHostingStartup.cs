using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SocialEcommerce.Data;
using SocialEcommerce.Data.Entities;

[assembly: HostingStartup(typeof(SocialEcommerce.WebAPI.Areas.Identity.IdentityHostingStartup))]
namespace SocialEcommerce.WebAPI.Areas.Identity
{
    public class IdentityHostingStartup : IHostingStartup
    {
        public void Configure(IWebHostBuilder builder)
        {
            builder.ConfigureServices((context, services) => {
            });
        }
    }
}