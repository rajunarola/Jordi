using AutoMapper;
using SocialEcommerce.Data;
using SocialEcommerce.Data.Entities;
using SocialEcommerce.Data.Repository;
using SocialEcommerce.Repository.Interfaces;
using SocialEcommerce.Repository.Respositories.BaseRepository;
using SocialEcommerce.Repository.ViewModels.Category;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SocialEcommerce.Repository.ViewModels.Common;
using Microsoft.Data.SqlClient;
using SocialEcommerce.Repository.ViewModels;
using SocialEcommerce.Shared.Constants;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using SocialEcommerce.Repository.Extension;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using System.Transactions;

namespace SocialEcommerce.Repository.Respositories
{
    public class CategoryRepository : GenericRepository<Category>, ICategory
    {
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _dbContext;
        private readonly IStoredProcedureRepositoryBase _storedProcedureRepository;


        public CategoryRepository(ApplicationDbContext dbContext,
            IMapper mapper,
            IStoredProcedureRepositoryBase storedProcedureRepositoryBase
          )
            : base(dbContext)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            _storedProcedureRepository = storedProcedureRepositoryBase;
        }
        public async Task SaveAsync(CategoryDto input)
        {
            var CategoryData = _mapper.Map<Category>(input);
            try
            {


                if (await _dbContext.Categories.AsNoTracking().SingleOrDefaultAsync(x => x.Id == input.Id)
                    == null!)
                {
                    // var Id= _user.GetUserId(_accessor.HttpContext.User);
                    var result = SaveAsyncUtility<Category>.UpdateDefaultFieldsForAddAndUpdate(CategoryData, input.UserId, false);
                    await _dbContext.AddAsync(result);
                    await _dbContext.SaveChangesAsync();

                }
                else
                {
                    var result = SaveAsyncUtility<Category>.UpdateDefaultFieldsForAddAndUpdate(CategoryData, input.UserId, true);
                    _dbContext.Categories.Update(result);
                    await _dbContext.SaveChangesAsync();
                }


            }
            catch (Exception e)
            {

                throw e;
            }
        }

        public async Task<CategoryDto> GetById(long id)
        {
            var entity = await _dbContext.Categories.FirstAsync(x => x.Id == id);

            return _mapper.Map<CategoryDto>(entity);
        }

        public async Task<ServiceResponse> GetAll(CommonSpParameterInputDto input)
        {

            var dataCount = 0;
            var sqlParams = new List<SqlParameter>
               {
                  new SqlParameter("@PageNo",(input.PageNo + 1)),
                   new SqlParameter("@PageSize",input.MaxResultCount),
                   new SqlParameter("@SortColumn",input.Sorting),
                   new SqlParameter("@Filter", input.Filter),
                   new SqlParameter("@CategoryNameFilter", input.CategoryNameFilter),
                   //new SqlParameter("@StatusFilter", input.IsActiveFilter)
               };
            var spList = new List<CategoryDto>();
            var dataset = await _storedProcedureRepository.GetQueryDatatableAsync(StoredProcedureConstants.SP_GetAllCategoriesForList, sqlParams.ToArray());

            spList = _storedProcedureRepository.CreateListFromTable<CategoryDto>(dataset.Tables[0]);
            if (spList.Count != 0)
            {
                dataCount = spList.FirstOrDefault().TotalCount;
            }

            return new ServiceResponse { status = 1, isSuccess = true, message = "Category data",
                jsonObj = new { data = spList, dataCount = dataCount } };

        }

        public ServiceResponse Delete(CommonDto input)
        {
            using (var txscope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    var parentCategory = _dbContext.Categories.FirstOrDefault(x => x.Id == input.Id);
                    parentCategory.IsDelete = true;
                    var parentResult = SaveAsyncUtility<Category>.UpdateDefaultFieldsForAddAndUpdate(parentCategory, input.UserId, true);

                    _dbContext.Update(parentResult);
                    _dbContext.SaveChanges();
                    var res = _dbContext.Categories.Where(x => x.ParentCategoryId == parentCategory.Id);
                    if (res.Count() != 0)
                    {
                        foreach (var item in res)
                        {
                            item.IsDelete = true;

                            var result = SaveAsyncUtility<Category>.UpdateDefaultFieldsForAddAndUpdate(item, input.UserId, true);

                            _dbContext.Update(result);
                            _dbContext.SaveChanges();
                        }

                    }
                    txscope.Complete();
                    return new ServiceResponse { status = 1, isSuccess = true, message = "Category " + CommonMessages.DeleteStatus };




                }
                catch (Exception e)
                {
                    txscope.Dispose();
                    return new ServiceResponse { status = 0, isSuccess = false, message = e.Message };
                }
            }
        }

        public async Task<List<DropDownDto>> GetCategoryForDropDown(long? Id)
        {
            var dataset = await _storedProcedureRepository.GetQueryDatatableAsync(StoredProcedureConstants.Sp_GetAllCategoryForDropdown);


            var result = _storedProcedureRepository.CreateListFromTable<CategoryWithSubCategoryDto>(dataset.Tables[0]);
            var temp = new List<CategoryWithSubCategoryDto>();
            if (Id != null)
            {
                temp.Add(result.FirstOrDefault(x => x.ID == Id));
            }
            result = Id == null ? result : temp;
            List<DropDownDto> categoryList = new List<DropDownDto>();
            foreach (var item in result)
            {
                categoryList.Add(new DropDownDto
                {
                    Label = item.CategoryWithSubcategory,
                    Value = item.ID,
                    Level = item.Level
                });
            }


            return categoryList;
        }

        public async Task<bool> ActiveDeactiveCategory(CommonDto input)
        {
            var category = await _dbContext.Categories.FirstOrDefaultAsync(x => x.Id == input.Id);
            var checkCategoryParent = await _dbContext.Categories.FirstOrDefaultAsync(x => x.Id == category.ParentCategoryId && x.IsActive == false);
            if (checkCategoryParent == null)
            {
                var sqlParams = new List<SqlParameter>
                {
                    new SqlParameter("@CategoryId",category.Id),
                    new SqlParameter("@IsActive",!category.IsActive),

                };
                var dataset = await _storedProcedureRepository.GetQueryDatatableAsync(StoredProcedureConstants.Sp_ActiveDeactiveCategory, sqlParams.ToArray());
                return true;
            }
            return false;
        }

        public ServiceResponse IsExistCategoryName(string input)
        {
            try
            {
                if (input != null) {
                    var IsExist = _dbContext.Categories.Where(x => x.CategoryName.ToLower().Equals(input.ToLower()));
                    if (IsExist.Count() != 0)
                    {
                        return new ServiceResponse { status = 0, isSuccess = true, message = "Category Name already Exist" };
                    }
                    else
                    {
                        return new ServiceResponse { status = 1, isSuccess = true, message = "New Category" };

                    }
                }
                else
                {
                    return new ServiceResponse { status = 1, isSuccess = true, message = "Invalid input" };

                }


            }
            catch (Exception e)
            {

                return new ServiceResponse { status = -1, isSuccess = false, message = e.Message };

            }
        }

        #region category side nav (client side)  
        public async Task<List<CategoryList>> GetCategoryForSideBarAsync()
        {
            var categories = _dbContext.Categories.OrderBy(x => x.CategoryName).Where(x => !x.IsDelete && x.IsActive).ToList();

            List<CategoryList> categoryList = new List<CategoryList>();
            foreach (var item in categories)
            {

                var allCategoryList = await GetCategoryIdForProduct(item.Id);

                categoryList.Add(new CategoryList()
                {
                    Id = item.Id,
                    CategoryName = item.CategoryName,
                    ParentCategoryId = item.ParentCategoryId ?? -1
                });
            }
            return categoryList;
        } 
    
        public async Task<List<CategoryList>> GetChildCategoryForProductListMenu(long parentCategoryId)
        {
            
                var categories = await _dbContext.Categories.OrderBy(x => x.CategoryName).Where(x => !x.IsDelete && x.IsActive).ToListAsync();

                var categoryIdList = await GetCategoryIdForProduct(parentCategoryId);
                List<CategoryList> categoryList = new List<CategoryList>();
                foreach (var item in categories)
                {
                    foreach (var a in categoryIdList)
                    {
                        if (a == item.ParentCategoryId)
                        {
                            categoryList.Add(new CategoryList()
                            {
                                Id = item.Id,
                                CategoryName = item.CategoryName,
                                ParentCategoryId = item.ParentCategoryId ?? -1
                            });
                        }
                    }
                }
                return categoryList;
            
        }
        public async Task<List<CategoryList>> GetCategory()
        {
            var dataset = await _storedProcedureRepository.GetQueryDatatableAsync(StoredProcedureConstants.Sp_GetAllCategoryForSidebarMenu);
            var spList = _storedProcedureRepository.CreateListFromTable<CategoryList>(dataset.Tables[0]);

            var CatData = spList.Select(y => new CategoryList()
            {
                CategoryName = y.CategoryName,
                Id = y.Id,
                ParentCategoryId = y.ParentCategoryId,
                
                SubCategory = GetChildCategory(spList, y.Id)
            }).ToList();

            CatData = CatData.Where(x => x.ParentCategoryId == 0).ToList();
            return CatData;
        }
        public async Task<List<long>> GetCategoryIdForProduct(long categoryid)
        {
            var dataset = await _storedProcedureRepository.GetQueryDatatableAsync(StoredProcedureConstants.Sp_GetAllCategoryForSidebarMenu);
            var spList = _storedProcedureRepository.CreateListFromTable<CategoryList>(dataset.Tables[0]);
            List<long> catIds = new List<long>();
            if (categoryid > 0)
            {
                List<CategoryList> lst = new List<CategoryList>();
                lst = spList.Where(x => x.Id == categoryid).Select(y => new CategoryList()
                {
                    CategoryName = y.CategoryName,
                    Id = y.Id,
                    ParentCategoryId = y.ParentCategoryId,
                    SubCategory = GetChildCategory(spList, y.Id)
                }).ToList();


                if (lst.Count() > 0)
                {
                    // Get categoryId of parent record;
                    catIds.Add(lst[0].Id);
                    if (lst[0].SubCategory.Count() > 0)
                    {
                        var res = GetCategoryId(lst[0].SubCategory, null);
                        foreach (var item in res)
                        {
                            catIds.Add(item);
                        }

                    }
                }
            }
            return catIds.Distinct().ToList();
        }

        public List<CategoryList> GetChildCategory(List<CategoryList> data, long CategoryID)
        {
            var model = new List<CategoryList>();
            model = data.Where(x => x.ParentCategoryId == CategoryID).Select(y => new CategoryList()
            {
                CategoryName = y.CategoryName,
                Id = y.Id,
                ParentCategoryId = y.ParentCategoryId,               
                SubCategory = GetChildCategory(data, y.Id)
            }).ToList();
            return model;
        }
        public List<long> GetCategoryId(List<CategoryList> SubCategory, List<long> list)
        {
            List<long> catIds = new List<long>();
            if (list != null && list.Count() > 0)
            {
                catIds = list;
            }
            if (SubCategory.Count() > 0)
            {
                foreach (var item in SubCategory)
                {
                    if (item.SubCategory.Count() > 0)
                    {
                        var res = GetCategoryId(item.SubCategory, catIds);
                        res.Add(item.ParentCategoryId);
                        res.Add(item.Id);
                        catIds = res;
                    }
                    else
                    {
                        catIds.Add(item.Id);

                    }
                }

            }
            return catIds;
        }
        #endregion

        public ServiceResponse GetParentCategoryDropDown()
        {
            try
            {
                var res=_dbContext.Categories.Where(x => x.ParentCategoryId == null && x.IsActive == true && x.IsDelete == false).ToList();
                if (res.Count!=0)
                {
                    var data=_mapper.Map<List<CategoryDropdownDto>>(res);
                   
                return new ServiceResponse { status = 1, isSuccess = true, message = "dropdown category",jsonObj= data };
                }else
                {
                    return new ServiceResponse { status = 0, isSuccess = true, message = "data not found"};
                }


            }
            catch (Exception e)
            {

                return new ServiceResponse { status = 0, isSuccess = false, message = CommonMessages.SomethingWrong };
            }
        }
    }
}
