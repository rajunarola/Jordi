using System;
using System.Collections.Generic;
using System.Text;

namespace SocialEcommerce.Repository.ViewModels
{
    public class CommonSpParameterInputDto
    {
        public int PageNo { get; set; }
        public int MaxResultCount { get; set; }
        public string Sorting { get; set; }
        public string Filter { get; set; }
        public string CategoryNameFilter { get; set; }
        public int IsActiveFilter { get; set; }


    }
}
