using Microsoft.AspNetCore.Identity;
using SocialEcommerce.Data.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SocialEcommerce.Repository.ViewModels
{
    public class ApplicationUserDto 
    {
        public long Id { get; set; }

        public string Email { get; set; }

        public string UserName { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string PhoneNumber { get; set; }

        public string Password { get; set; }

        public bool EmailConfirmed { get; set; }

        public IList<string> Role { get; set; }
    }
}
