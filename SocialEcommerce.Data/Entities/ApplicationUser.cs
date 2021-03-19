using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace SocialEcommerce.Data.Entities
{
    public class UserRole : IdentityUserRole<long> { }

    public class UserClaim : IdentityUserClaim<long> { }

    public class UserLogin : IdentityUserLogin<long> { }

    public class Role : IdentityRole<long>
    {
        public Role()
        {
            DisplayRoleName = "";
        }
       
        public string DisplayRoleName { get; set; }

        

    }

    public class ApplicationUser : IdentityUser<long>
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }


   
        [DefaultValue(true)]
        public bool IsActive { get; set; }
        [DefaultValue(false)]
        public bool IsDelete { get; set; }

        [NotMapped] public string FullName => $@"{FirstName} {LastName}";
        public virtual ICollection<Cart> Carts { get; set; }
        public virtual ICollection<ShippingAddress> ShippingAddress { get; set; }
        public virtual ICollection<OrdersDetails> OrdersDetails { get; set; }
        public virtual ICollection<Orders> Orders { get; set; }
        public virtual ICollection<ProductMaster> ProductMasters { get; set; }
    

    }
}
