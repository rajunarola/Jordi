using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SocialEcommerce.Repository.ViewModels
{
  public  class UserDto: CommonDto
    {
       public string FirstName { get; set; }
       
        public string LastName { get; set; }
        
        public string Email { get; set; }

        public string PhoneNumber { get; set; }
       
    }

}
