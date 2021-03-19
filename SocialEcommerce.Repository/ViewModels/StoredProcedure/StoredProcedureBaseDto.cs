using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SocialEcommerce.Repository.ViewModels
{
    public class StoredProcedureBaseDto : CommonDto
    {
        [NotMapped]
        [Bindable(false)]
        public long ROWNUM { get; set; }
        [NotMapped]
        [Bindable(false)]
        public int TotalCount { get; set; }
    }
}
