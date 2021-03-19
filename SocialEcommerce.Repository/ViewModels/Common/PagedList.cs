using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SocialEcommerce.Repository.ViewModels
{
    public class PagedList
    {
        public PagedList(IQueryable<dynamic> source,int totalCount)
        {
            try
            {
                TotalItems = totalCount;
                List = source.ToList();
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        public int TotalItems { get; }
        public List<dynamic> List { get; }
    }
}
