using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using SocialEcommerce.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SocialEcommerce.WebAPI
{
    public class ClaimsPrincipalFactory : UserClaimsPrincipalFactory<ApplicationUser, Role>
    {
        public ClaimsPrincipalFactory(UserManager<ApplicationUser> userManager, RoleManager<Role> roleManager, IOptions<IdentityOptions> options)
            : base(userManager, roleManager, options)
        {
        }

        protected override async Task<ClaimsIdentity> GenerateClaimsAsync(ApplicationUser user)
        {
            var identity = await base.GenerateClaimsAsync(user);
            var role = identity.Claims.Where(c => c.Type == ClaimTypes.Role).ToList().FirstOrDefault()?.Value ?? "";
            //string AdminId = (role == UserRoles.SystemAdmin) ? user.Id.ToString(): "";
            //string CompanyId = (role == UserRoles.Company) ? user.Id.ToString(): "";
            //string EmployeeId = (role == UserRoles.Employee) ? user.Id.ToString(): "";
            
            var claims = new List<Claim>()
            {
                new Claim("UserRole", role),
                new Claim("UserId", user.Id.ToString() ?? ""),
                new Claim("FullName", user.FullName ??"" ),
                
            };
            identity.AddClaims(claims);


            return identity;
        }


        //public async Task<ClaimsIdentity> createClaimAsync(ApplicationUser user) {
        //    return await GenerateClaimsAsync();
        //}

       
    }

    public class customclaims
    {
        public string UserRole { get; set; }
        public string UserId { get; set; }

        public string FullName { get; set; }
    }
}
