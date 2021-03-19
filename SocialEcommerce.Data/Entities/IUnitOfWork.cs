using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SocialEcommerce.Data.Entities
{
     public interface IUnitOfWork
    {
        int Commit();
        Task<int> CommitAsync();
    }
}
