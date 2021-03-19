using SocialEcommerce.Data;
using SocialEcommerce.Data.Entities;
using SocialEcommerce.Repository.Interfaces;
using SocialEcommerce.Repository.Respositories.BaseRepository;
using SocialEcommerce.Repository.ViewModels.Product;
using SocialEcommerce.Shared.Constants;
using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using System.Threading.Tasks;
using SocialEcommerce.Data.Repository;
using System.Linq;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SocialEcommerce.Repository.Extension;
using Microsoft.AspNetCore.Identity;
using SocialEcommerce.Repository.ViewModels.Common;
using System.IO;
using SocialEcommerce.Repository.ViewModels.StoredProcedure;

namespace SocialEcommerce.Repository.Respositories
{
    public class ProductRepository : GenericRepository<ProductMaster>, IProductService
    {
        private readonly ApplicationDbContext _context;
        private readonly IStoredProcedureRepositoryBase _storedProcedureRepository;
        private readonly IMapper _mapper;
        private readonly RoleManager<Role> _roleManager;
        private readonly FileOperationsRepository _fileOperations;
        public ProductRepository(ApplicationDbContext context,
            IStoredProcedureRepositoryBase storedProcedureRepository,
            IMapper mapper,
            RoleManager<Role> roleManager
            
             ) : base(context)
        {
            _context = context;
            _storedProcedureRepository = storedProcedureRepository;
            _mapper = mapper;
            _roleManager = roleManager;
            _fileOperations = new FileOperationsRepository();


        }
        public async Task<ServiceResponse> GetAll(SPInput input,long UserId,bool isAdmin)
        {
            var spList = new List<ProductList>();
            int dataCount = 0;
            var sqlParams = new List<SqlParameter>
               {
                   new SqlParameter("@PageNo",(input.PageNo + 1)),
                   new SqlParameter("@PageSize",input.MaxResultCount),
                   new SqlParameter("@SortColumn",input.SortColumn),
                   new SqlParameter("@SortDirection",input.Sorting),
                   new SqlParameter("@Filter", input.Filter),
                   new SqlParameter("@CurrentUserId", UserId),
                   new SqlParameter("@IsAdmin",isAdmin)

               };

            var dataset = await _storedProcedureRepository.GetQueryDatatableAsync(StoredProcedureConstants.SP_GetAllProductList, sqlParams.ToArray());

            spList = _storedProcedureRepository.CreateListFromTable<ProductList>(dataset.Tables[0]);

            if (spList.Count != 0)
            {
                dataCount = spList.FirstOrDefault().TotalRecords;
            }

            return new ServiceResponse
            {
                status = 1,
                isSuccess = true,
                message = "Product data",
                jsonObj = new { data = spList },
                totalCount=dataCount
            };
        }
        public async Task<ServiceResponse> GetAllAdminProduct(SPInput input, long UserId)
        {
            var spList = new List<ProductList>();
            int dataCount = 0;
            var sqlParams = new List<SqlParameter>
               {
                   new SqlParameter("@PageNo",(input.PageNo + 1)),
                   new SqlParameter("@PageSize",input.MaxResultCount),
                   new SqlParameter("@SortColumn",input.SortColumn),
                   new SqlParameter("@SortDirection",input.Sorting),
                   new SqlParameter("@Filter", input.Filter),
                   new SqlParameter("@CurrentUserId", UserId),

               };

            var dataset = await _storedProcedureRepository.GetQueryDatatableAsync(StoredProcedureConstants.SP_GetAdminProductList, sqlParams.ToArray());

            spList = _storedProcedureRepository.CreateListFromTable<ProductList>(dataset.Tables[0]);

            if (spList.Count != 0)
            {
                dataCount = spList.FirstOrDefault().TotalRecords;
            }

            return new ServiceResponse
            {
                status = 1,
                isSuccess = true,
                message = "Product data",
                jsonObj = new { data = spList },
                totalCount = dataCount
            };
        }
        public async Task SaveAsync(ProductDto input)
        {
            List<FileUploadDto> fileUploadDtos = new List<FileUploadDto>();
            var ProductData = _mapper.Map<ProductMaster>(input);
            try
            {
                if (input.Id == 0)
                {
                    if (await _context.ProductMaster.AsNoTracking().SingleOrDefaultAsync(x => x.Id == input.Id)
                        == null!)
                    {

                        #region product Insert
                        var result = SaveAsyncUtility<ProductMaster>.UpdateDefaultFieldsForAddAndUpdate(ProductData, input.UserId, false);
                        var res = await _context.AddAsync(result);
                        var insertResult = await _context.SaveChangesAsync();
                        #endregion

                        #region Product Image Insert
                        await updateImage(input.FileName, input.UserId, ProductData.Id);

                        #endregion

                    }
                }
                else
                {
                    var result = SaveAsyncUtility<ProductMaster>.UpdateDefaultFieldsForAddAndUpdate(ProductData, input.UserId, true);
                    _context.ProductMaster.Update(result);
                    await _context.SaveChangesAsync();

                    #region Product Image Update
                    var proImgData= _context.ProductsImage.Where(x => x.ProductId == ProductData.Id);
                    _context.ProductsImage.RemoveRange(proImgData);
                     _context.SaveChanges();

                    await updateImage(input.FileName, input.UserId, ProductData.Id);
                    #endregion
                }


            }
            catch (Exception e)
            {

                throw;
            }
        }
        public ServiceResponse Delete(long id,long userId)
        {
            try
            {
                var productData = _context.ProductMaster.FirstOrDefault(x => x.Id == id);
                if (productData != null)
                {
                    productData.IsDelete = true;
                    var parentResult = SaveAsyncUtility<ProductMaster>.UpdateDefaultFieldsForAddAndUpdate(productData, userId, true);

                    _context.Update(productData);
                    _context.SaveChanges();
                    return new ServiceResponse { status = 1, isSuccess = true, message = "Product " + CommonMessages.DeleteStatus };
                }
                else
                {
                    return new ServiceResponse { status = 1, isSuccess = true, message = CommonMessages.SomethingWrong };
                }
                
            }
            catch (Exception)
            {

                return new ServiceResponse { status = 0, isSuccess = false, message = CommonMessages. SomethingWrong };
            }
          
        }
        public ServiceResponse GetById(long id)
        {
            try
            {
                List<string> list = new List<string>();
                string path = Path.Combine(FolderPath.webRootPath, FolderPath.ProductImage);

                var entity =  _context.ProductMaster.FirstOrDefault(x => x.Id == id);
                if(entity!=null)
                {
                    var productData = _mapper.Map<ProductDto>(entity);

                    var imageData = _context.ProductsImage.Where(x => x.ProductId == entity.Id).Select(x=>x.ImageName);
                    foreach (var item in imageData)
                    {
                        list.Add(path + "\\" + item);
                    }
                    //productData.FileName = list.ToArray();
                    productData.FileName=_fileOperations.ImageToBase64(list).ToArray();
                    return new ServiceResponse { status = 1, isSuccess = true, message = "Product data", jsonObj = productData };
                }
                else
                {
                    return new ServiceResponse { status = 0, isSuccess = false, message = CommonMessages.SomethingWrong };
                }
                
                
            }
            catch (Exception e)
            {

                return new ServiceResponse { status = 0, isSuccess = false, message = CommonMessages.SomethingWrong };
            }
            

           
        }
        public string RendomFileName(string Name)
        {
            string newName = DateTime.Now.Ticks.ToString();
            newName = newName.Substring(newName.Length - 5) + ".png";

            if (Name.Equals(newName))
                return RendomFileName(Name);
            else 
                return newName;
        }
        public async Task<bool> updateImage(string[] FileName,long UserId,long ProductId)
        {
           try { 
          
            ProductImageDto imageDto = new ProductImageDto();

            string path = Path.Combine(FolderPath.webRootPath, FolderPath.ProductImage);
            foreach (var item in FileName)
            {
                
                Byte[] bytes = Convert.FromBase64String(item.Split(',')[1]);
                string newFileName = DateTime.Now.Ticks.ToString("HHmmss");
                string ogirinalFileName = RendomFileName(newFileName);
                FileStream file = File.Create(path + "\\" + ogirinalFileName);
                await file.WriteAsync(bytes, 0, bytes.Length);
                file.Close();
                var ProductImageData = _mapper.Map<ProductsImages>(imageDto);

                var imgRes = SaveAsyncUtility<ProductsImages>.UpdateDefaultFieldsForAddAndUpdate(ProductImageData, UserId, false);
               
                    imgRes.ImageName = ogirinalFileName;
                    imgRes.ProductId = ProductId;
                    await _context.AddAsync(imgRes);
                    await _context.SaveChangesAsync();                
                  
                }
               return true;
            } 
            catch (Exception e) 
            { 
               return false; 
            
            }
        }
        public ServiceResponse ManageUserStatus(long Id)
        {
            try
            {
                var productRes = _context.ProductMaster.FirstOrDefault(x => x.Id == Id);
                if (productRes != null)
                {
                    productRes.IsActive = !productRes.IsActive;
                    _context.ProductMaster.Update(productRes);
                    _context.SaveChanges();
                    var message = $@"Product {(productRes.IsActive ? "activated" : "deactivated")} successfully.";
                    return new ServiceResponse { status = 1, isSuccess = true, message = message };
                }
                else
                {
                    return new ServiceResponse { status = 0, isSuccess = false, message = CommonMessages.SomethingWrong };
                }
            }
            catch (Exception e)
            {
                return new ServiceResponse { status = 0, isSuccess = false, message = e.Message };
            }
        }



        #region Client module's method
        public async Task<ServiceResponse> GetAllUserProduct(SPInput input, long UserId)
        {
            var spList = new List<ProductList>();
            int dataCount = 0;
            var sqlParams = new List<SqlParameter>
               {
                   new SqlParameter("@PageNo",(input.PageNo + 1)),
                   new SqlParameter("@PageSize",input.MaxResultCount),
                   new SqlParameter("@SortColumn",input.SortColumn),
                   new SqlParameter("@SortDirection",input.Sorting),
                   new SqlParameter("@Filter", input.Filter),
                   new SqlParameter("@CurrentUserId", UserId)

               };

            var dataset = await _storedProcedureRepository.GetQueryDatatableAsync(StoredProcedureConstants.SP_GetAllUserProductList, sqlParams.ToArray());

            spList = _storedProcedureRepository.CreateListFromTable<ProductList>(dataset.Tables[0]);

            if (spList.Count != 0)
            {
                dataCount = spList.FirstOrDefault().TotalRecords;
            }

            return new ServiceResponse
            {
                status = 1,
                isSuccess = true,
                message = "User Product data",
                jsonObj = new { data = spList },
                totalCount = dataCount
            };
        }
        public async Task<ServiceResponse> GetAllProduct(SPInput input, long UserId)
        {
            var spList = new List<ProductList>();
            int dataCount = 0;
            var sqlParams = new List<SqlParameter>
               {
                   new SqlParameter("@PageNo",(input.PageNo + 1)),
                   new SqlParameter("@PageSize",input.MaxResultCount),
                   new SqlParameter("@SortColumn",input.SortColumn),
                   new SqlParameter("@SortDirection",input.Sorting),
                   new SqlParameter("@Filter", input.Filter),

               };

            var dataset = await _storedProcedureRepository.GetQueryDatatableAsync(StoredProcedureConstants.SP_GetProductList, sqlParams.ToArray());

            spList = _storedProcedureRepository.CreateListFromTable<ProductList>(dataset.Tables[0]);

            if (spList.Count != 0)
            {
                dataCount = spList.FirstOrDefault().TotalRecords;
            }

            return new ServiceResponse
            {
                status = 1,
                isSuccess = true,
                message = "User Product data",
                jsonObj = new { data = spList },
                totalCount = dataCount
            };
        }
        public ServiceResponse GetLastNProduct(int numberOfProduct)
        {
            try
            {

                List<ProductDto> productList = new List<ProductDto>();

                var productData= _context.ProductMaster.Where(x=>x.IsActive==true && x.IsDelete==false).ToList().OrderByDescending(x=>x.Id).Take(numberOfProduct);
                if (productData.Count() != 0) {
                    foreach (var item in productData) {
                        var productImageName = _context.ProductsImage.Where(x => x.ProductId == item.Id).Select(x => x.ImageName).ToList();
                        var tempList = new ProductDto();
                        tempList.FileName = new string[1];
                        if (productImageName != null)
                        {
                            tempList.FileName[0] = productImageName.ToArray().FirstOrDefault();
                        }

                        tempList.ProductName = item.ProductName;
                        tempList.ProducDescription = item.ProducDescription;
                        tempList.Price = item.Price;
                        tempList.CategoryId = item.CategoryId;
                        tempList.Id = item.Id;
                        productList.Add(tempList);

                    }
                    return new ServiceResponse { status = 1, isSuccess = true, message = "Product slider data", jsonObj = productList }; 
                }
                
                return new ServiceResponse { status = 0, isSuccess = true, message =CommonMessages.SomethingWrong };
            }
            catch (Exception e)
            {

                return new ServiceResponse { status = 0, isSuccess = false, message =e.Message};
            }
        }

        #endregion
    }
}
