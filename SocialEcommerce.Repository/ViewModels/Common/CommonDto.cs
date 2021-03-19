using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SocialEcommerce.Repository.ViewModels
{
    public class CommonDto
    {
       // [DisplayNameAttribute("Category id")]
        public long Id { get; set; }
        [Bindable(false)]
        public bool IsDelete { get; set; }
        public bool IsActive { get; set; }
        public long UserId { get; set; }

        public int TotalRecords { get; set; }
    }
}
