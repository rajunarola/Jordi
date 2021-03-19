using SocialEcommerce.Repository.Interfaces.BaseInterface;
using System;
using System.Collections.Generic;
using System.Text;

namespace SocialEcommerce.Repository.Extension
{
  public static  class SaveAsyncUtility<T> where T : class
    {
        public static T UpdateDefaultFieldsForAddAndUpdate(T entity, long? userId, bool isEdit = false)
        {
            //Add createdBy and CreadetDate
            if (!isEdit)
            {
                if (entity.GetType().GetProperty("CreatedBy") != null)
                {
                    entity.GetType().GetProperty("CreatedBy")?.SetValue(entity, userId.ToString());
                }
                if (entity.GetType().GetProperty("CreatedDate") != null)
                {
                    entity.GetType().GetProperty("CreatedDate")?.SetValue(entity, DateTime.UtcNow);
                    

                }
            }
            //Add updatedby and updatedDate
            else
            {
                if (entity.GetType().GetProperty("ModifiedBy") != null)
                {
                    entity.GetType().GetProperty("ModifiedBy")?.SetValue(entity, userId.ToString());
                }
                if (entity.GetType().GetProperty("ModifiedDate") != null)
                {
                    entity.GetType().GetProperty("ModifiedDate")?.SetValue(entity, DateTime.UtcNow);
                }
            }

            return entity;
        }
    }
}
