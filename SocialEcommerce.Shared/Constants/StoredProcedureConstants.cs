using System;
using System.Collections.Generic;
using System.Text;

namespace SocialEcommerce.Shared.Constants
{
    public class StoredProcedureConstants
    {
        #region Category
        public const string SP_GetAllCategoriesForList = "SP_GetAllCategoriesForList";

        public const string Sp_GetAllCategoryForDropdown = "Sp_GetAllCategoryForDropdown";

        public const string Sp_ActiveDeactiveCategory = "Sp_ActiveDeactiveCategory";
        public const string Sp_GetAllCategoryForSidebarMenu = "Sp_GetAllCategoryForSidebarMenu";
        #endregion


        #region Product
        //admin & distributor side 
        public const string SP_GetAllProductList = "SP_GetAllProductList";
        public const string SP_GetAdminProductList = "SP_GetAdminProductList";

        //for user product
        public const string SP_GetAllUserProductList = "SP_GetAllUserProductList";
        //for all product
        public const string SP_GetProductList = "SP_GetProductList";


        #endregion

        #region Distributor
        public const string SP_GetDistributorList = "GetDistributorList";

        #endregion
    }
}
