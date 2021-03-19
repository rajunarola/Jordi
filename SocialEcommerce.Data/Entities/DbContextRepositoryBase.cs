using Microsoft.EntityFrameworkCore;

namespace SocialEcommerce.Data.Entities
{
    public abstract class
        DbContextRepositoryBase<TContext> : IRepository where TContext : DbContext
    {
        /// <summary>
        /// Gets the unit of work. This class actually saves the data into underlying storage.
        /// </summary>
        /// <value>
        /// The unit of work.
        /// </value>
        private IUnitOfWork unitOfWork { get; set; }

        protected TContext DbContext { get; private set; }

        protected DbContextRepositoryBase(TContext dbContext, IUnitOfWork? unitOfWork = null)
        {
            DbContext = dbContext;

            this.unitOfWork = unitOfWork ?? new DbContextUnitOfWork(dbContext);

            //var connectionTimeout = dbContext.Database.GetDbConnection().ConnectionTimeout;
            //dbContext.Database.SetCommandTimeout();
        }
    }
}