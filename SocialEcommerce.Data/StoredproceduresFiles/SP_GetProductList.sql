USE [SocialEcommerceDb]
GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllUserProductList]    Script Date: 14-12-2020 18:22:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


Create PROCEDURE [dbo].[SP_GetProductList]
			@PageNo INT = 0,
			@PageSize INT = 5,
			@SortColumn NVARCHAR(200) = NULL,
			@Filter Nvarchar(100) = null,
	        @SortDirection NVARCHAR(200) = NULL,
			@CurrentUserId bigint
			
		AS
		BEGIN
			 --SET NOCOUNT ON;
			 DECLARE
			 @lPage INT,
			 @lPageSize INT,
			 @lSortColumn NVARCHAR(200),
			 @lFirstRec INT,
			 @lLastRec INT,
			 @lTotalRows INT,			
			 @lFilter Nvarchar(100),
			 @lSortDirection NVARCHAR(200)
			 


			 SET @lPage = @PageNo;
			 SET @lPageSize = @PageSize;
			 SET @lSortColumn = @SortColumn;
			 SET @lFirstRec = (@lPage - 1) * @lPageSize;
			 SET @lLastRec = ( @lPage * @lPageSize + 1 );
			 SET @lTotalRows = @lFirstRec - @lLastRec + 1;
			 SET @lSortDirection = @SortDirection;
			 SET @lFilter = @Filter;		

			

			 WITH ProductList AS(
			  
					SELECT 
						
						(SELECT TOP 1 ImageName from ProductsImage where ProductId=p.Id)as ImageName,
						p.Id,
						p.IsDelete,
						ProductName,
						ProducDescription,
						c.CategoryName,
						DistributorId,
						UserId as ProductUserId,
						p.IsActive,
						p.Price,
						TotalRecords = COUNT(1) OVER()
					 FROM ProductMaster p  
			 JOIN Categories c on c.Id = p.CategoryId
			 where  UserId	=@CurrentUserId	  
					  
			 ) ,Cte_result as(
			 SELECT  ROW_NUMBER() OVER (
			     ORDER BY 
						CASE WHEN(LOWER(@lSortColumn)= LOWER('ProductName') 
						AND LOWER(@lSortDirection)=LOWER('ASC')) THEN  ProductName END ASC,

						CASE WHEN(LOWER(@lSortColumn)= LOWER('ProductName')
						AND LOWER(@lSortDirection)=LOWER('DESC')) THEN ProductName END DESC,

						CASE WHEN(LOWER(@lSortColumn)= LOWER('ProducDescription')
						AND LOWER(@lSortDirection)=LOWER('ASC')) THEN  ProducDescription END ASC,

						CASE WHEN(LOWER(@lSortColumn)= LOWER('ProducDescription')
						AND LOWER(@lSortDirection)=LOWER('DESC')) THEN  ProducDescription END DESC,

						CASE WHEN(LOWER(@lSortColumn)= LOWER('CategoryName') 
						AND LOWER(@lSortDirection)=LOWER('ASC')) THEN CategoryName END ASC,

						CASE WHEN(LOWER(@lSortColumn)= LOWER('CategoryName') 
						AND LOWER(@lSortDirection)=LOWER('DESC')) THEN CategoryName END DESC,

						CASE WHEN(LOWER(@lSortColumn)= LOWER('Price') 
						AND LOWER(@lSortDirection)=LOWER('ASC')) THEN Price END ASC,

						CASE WHEN(LOWER(@lSortColumn)= LOWER('Price') 
						AND LOWER(@lSortDirection)=LOWER('DESC')) THEN Price END  DESC
			)AS ROWNUM ,		
				Id,IsActive,IsDelete,ProductName,ProducDescription, Price,CategoryName ,DistributorId,ISNULL(ProductUserId,0)as ProductUserId,
				ImageName ,TotalRecords --= COUNT(1) OVER()
			 FROM ProductList p )
			 select * from Cte_result c
			 WHERE 	 
					(@lFilter IS NULL OR @lFilter=''  OR c.ProductName Like '%' + CAST(@lFilter AS nvarchar) + '%'
					OR c.ProductName Like '' + CAST(@lFilter AS nvarchar) + '%' OR c.ProducDescription Like '%' + CAST(@lFilter AS nvarchar) + '%'
					OR c.ProducDescription Like '' + CAST(@lFilter AS nvarchar) + '%'
					)
					
					 AND IsDelete=0 
					 AND ROWNUM > @lFirstRec AND ROWNUM < @lLastRec 
					
					END
			
			--exec [SP_GetAllUserProductList] @PageNo = 1, @CurrentUserId=2, @PageSize=5 , @SortDirection='asc', @SortColumn ='productName' , @Filter = ''
			--exec [Sp_GetAllCategoriesForList] @PageNo = 1 , @Ma@PageSize  = 25, @SortColumn ='asc', @Filter = 'el',	@CategoryNameFilter = null

