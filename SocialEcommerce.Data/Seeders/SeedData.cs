using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using SocialEcommerce.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SocialEcommerce.Data.Seeders
{
    public class SeedData
    {

        public static void Seed(UserManager<ApplicationUser> userManager, RoleManager<Role> roleManager)
        {
            SeedRoles(roleManager);
            SeedUsers(userManager);
        }

        private static void SeedUsers(UserManager<ApplicationUser> userManager)
        {
            var admin = new ApplicationUser
            {
                FirstName = "Tanvi",
                LastName = "Vaidya",
                UserName = "tv@narola.email",
                NormalizedUserName = "Admin",
                Email = "tv@narola.email",
                NormalizedEmail = "tv@narola.email",
                EmailConfirmed = true,
                IsActive=true,
                IsDelete=false,
                PhoneNumber="9876787878"


            };
            if (userManager.FindByEmailAsync(admin.UserName).Result != null) return;

            var result = userManager.CreateAsync(admin, "Password123#").Result;

            if (result.Succeeded)
            {
                userManager.AddToRoleAsync(admin, "Admin").Wait();
            }

            var user = new ApplicationUser
            {
                FirstName = "RKG",
                LastName = "Narola",
                UserName = "rkg@narola.email",
                NormalizedUserName = "User",
                Email = "rkg@narola.email",
                NormalizedEmail = "rkg@narola.email",
                EmailConfirmed = true,
                IsActive = true,
                IsDelete = false,
                PhoneNumber = "9876787878"


            };
            if (userManager.FindByEmailAsync(user.UserName).Result != null) return;

            var res = userManager.CreateAsync(user, "Password123#").Result;

            if (res.Succeeded)
            {
                userManager.AddToRoleAsync(user, "User").Wait();
            }


            var distributor = new ApplicationUser
            {
                FirstName = "Swati",
                LastName = "Narola",
                UserName = "sgu@narola.email",
                NormalizedUserName = "Distributor",
                Email = "sgu@narola.email",
                NormalizedEmail = "sgu@narola.email",
                EmailConfirmed = true,
                IsActive = true,
                IsDelete = false,
                PhoneNumber = "9876787878"



            };
            if (userManager.FindByEmailAsync(distributor.UserName).Result != null) return;

            var disRes = userManager.CreateAsync(distributor, "Password123#").Result;

            if (disRes.Succeeded)
            {
                userManager.AddToRoleAsync(distributor, "Distributor").Wait();
            }

        }

        private static void SeedRoles(RoleManager<Role> roleManager)
        {
            #region User Roles
            Dictionary<string, string> normalizedName = new Dictionary<string, string>
            {
                { "Admin", "Admin"},
                { "User", "User"},
                { "Distributor", "Distributor"},
            };

            var existrolesList = roleManager.Roles.Select(x => x.Name).ToList();
            if (existrolesList.Any())
            {
                var notExirst = normalizedName.Keys.Except(existrolesList);
                foreach (var notRole in notExirst)
                {
                    string normalized = normalizedName.FirstOrDefault(x => x.Key == notRole).Value;
                    var roleResult = roleManager.CreateAsync(new Role { Name = notRole, NormalizedName = normalized, DisplayRoleName = normalized }).Result;
                }
            }
            else
            {
                foreach (var objRole in normalizedName.Keys)
                {
                    string normalized = normalizedName.FirstOrDefault(x => x.Key == objRole).Value;
                    IdentityResult roleResult = roleManager.CreateAsync(new Role { Name = objRole, NormalizedName = normalized, DisplayRoleName = normalized }).Result;
                }
            }
            #endregion
        }

        public static long GetTimeZoneId(string currentTimeZone, string connection)
        {
            using (var sqlCon = new SqlConnection(connection))
            {
                var query = $@"EXEC GetCurrentTimeZone '{currentTimeZone}';";
                sqlCon.Open();
                var sqlCmd = new SqlCommand(query, sqlCon);
                var result = sqlCmd.ExecuteScalar();
                sqlCon.Close();
                return (long?)result ?? 0;
            }
        }

    }
    //public static class SeedData
    //{
    //    public static void Seed(this ModelBuilder modelBuilder)
    //    {
    //        //For AspNetRoles data
    //        modelBuilder.Entity<IdentityRole>().HasData(
    //            new IdentityRole
    //            {   
    //                //Id= "e5e61453-c003-424f-a2ee-13bf69fdc035",
    //                Name = "Admin",
    //                NormalizedName = "ADMIN",
    //                ConcurrencyStamp=Guid.NewGuid().ToString()
    //             },
    //            new IdentityRole
    //            {
    //               // Id= "01fe5a40-149a-4a45-9dfa-162a3c20eb60",
    //                Name = "Distributor",
    //                NormalizedName = "DISTRIBUTOR",
    //                ConcurrencyStamp = Guid.NewGuid().ToString()
    //            },
    //            new IdentityRole
    //            {
    //               // Id= "e1de457e-6559-4de3-a87d-0db0a6551ad8",
    //                Name = "User",
    //                NormalizedName = "USER",
    //                ConcurrencyStamp = Guid.NewGuid().ToString()
    //            }

    //        );



    //    }
    //}
}
