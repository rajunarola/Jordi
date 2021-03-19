using System;
using System.Collections.Generic;
using System.Text;

namespace SocialEcommerce.Repository.ViewModels.StoredProcedure
{
   public class SPInput
    {
        public int PageNo { get; set; }
        public int MaxResultCount { get; set; }
        public string Sorting { get; set; }
        public string Filter { get; set; }
        public string SortColumn { get; set; }
    }
}
