using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SocialEcommerce.Data.Entities;
using SocialEcommerce.Data.Seeders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace SocialEcommerce.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<long>, long>
    {
        //private IHttpContextAccessor _contextAccessor;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
             : base(options)
        {

        }
        #region Db Set
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<Status> status { get; set; }
        public DbSet<ProductMaster> ProductMaster { get; set; }
        public DbSet<ProductsImages> ProductsImage { get; set; }
        public DbSet<Cart> Cart { get; set; }
        public DbSet<Orders> Order { get; set; }
        public DbSet<OrdersDetails> OrdersDetail { get; set; }
        public DbSet<ShippingAddress> ShippingAddress { get; set; }



        #endregion
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            base.OnModelCreating(modelBuilder);

            modelBuilder.HasAnnotation("ProductVersion", "2.2.4-servicing-10062");

            // Change Default filed datatype & length
            modelBuilder.Entity<ApplicationUser>().Property(c => c.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<Role>().Property(c => c.Id).ValueGeneratedOnAdd();

            modelBuilder.Entity<UserClaim>().Property(x => x.ClaimType).HasMaxLength(50);
            modelBuilder.Entity<UserClaim>().Property(x => x.ClaimValue).HasMaxLength(200);

            modelBuilder.Entity<ApplicationUser>().Property(x => x.Email).HasMaxLength(100);
            modelBuilder.Entity<ApplicationUser>().Property(x => x.UserName).HasMaxLength(100);
            modelBuilder.Entity<ApplicationUser>().Property(x => x.PhoneNumber).HasMaxLength(12);

            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
           optionsBuilder.UseLazyLoadingProxies();
        }

       
            //public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
            //{
            //    var entries = ChangeTracker.Entries()
            //       .Where(x => x.State == EntityState.Added || x.State == EntityState.Modified);

            //    //var currentSessionUserEmail = _contextAccessor.HttpContext.User.Identity.Name;
            //    //var currentSessionUserEmail = GetUserId(User);
            //   // var user = await dbContext.Users
            //   //   .SingleAsync(u => u.Email.Equals(currentSessionUserEmail));

            //    var userId = "";

            //    foreach (var entry in entries)
            //    {
            //        var entityObj = entry.Entity;

            //        if (entityObj is CommonEntityModel auditable)
            //        {
            //            DateTime now = DateTime.Now.ToLocalTime();

            //            switch (entry.State)
            //            {
            //                case EntityState.Added:
            //                    auditable.CreatedBy = userId;
            //                    auditable.CreatedDate = now;

            //                    break;
            //                case EntityState.Modified:
            //                    auditable.ModifiedBy = userId;
            //                    auditable.ModifiedDate = now;

            //                    base.Entry(entry.Entity)
            //                       .Property("CreatedBy")
            //                       .IsModified = false;

            //                    base.Entry(entry.Entity)
            //                       .Property("CreatedDate")
            //                       .IsModified = false;

            //                    break;
            //                case EntityState.Detached:
            //                    break;
            //                case EntityState.Unchanged:
            //                    break;
            //                case EntityState.Deleted:
            //                    break;
            //                default:
            //                    throw new ArgumentOutOfRangeException();
            //            }
            //        }
            //    }

            //    try
            //    {
            //        return await base.SaveChangesAsync(cancellationToken);
            //    }
            //    catch (Exception e)
            //    {
            //        Console.WriteLine(e);

            //        throw;
            //    }
            //}
        }
}
