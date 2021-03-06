USE [SocialEcommerceDb]
GO
/****** Object:  StoredProcedure [dbo].[Sp_GetAllCategoriesForList]    Script Date: 21-10-2020 15:08:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[Sp_GetAllCategoriesForList]
			@PageNo INT = 0,
			@PageSize INT = 10,
			@SortColumn NVARCHAR(200) = NULL,
			@Filter Nvarchar(100) = null,
			@CategoryNameFilter Nvarchar(100) = null,
			@StatusFilter INT = 1
			
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
			 @IStatusFilter INT,
			 @lFilter Nvarchar(100),
			 @ICategoryNameFilter Nvarchar(100)
			 

			 SET @lPage = @PageNo;
			 SET @lPageSize = @PageSize;
			 SET @lSortColumn = @SortColumn;
			 SET @lFirstRec = (@lPage - 1) * @lPageSize;
			 SET @lLastRec = ( @lPage * @lPageSize + 1 );
			 SET @lTotalRows = @lFirstRec - @lLastRec + 1;
			 SET @IStatusFilter = @StatusFilter;
			 SET @lFilter = @Filter;
			 SET @ICategoryNameFilter = @CategoryNameFilter;
			 

			 WITH cteCategory(ID, CategoryName, ParentCategoryID, Level, CategoryWithSubcategory ,IsActive,DisplayOrder)
			 AS
			 (
				SELECT Id, CategoryName, ParentCategoryId, 1, CONVERT(varchar(255),CategoryName),IsActive ,DisplayOrder
				FROM Categories
				WHERE  ParentCategoryId IS NULL AND IsDelete  = 0
		
				UNION ALL
		
				SELECT c.ID, c.CategoryName, c.ParentCategoryID, cte.Level + 1, CONVERT(varchar(255), cte.CategoryWithSubcategory + ' >> ' + c.CategoryName) , c.IsActive ,c.DisplayOrder
				FROM
				Categories c
				INNER JOIN cteCategory cte ON cte.ID = c.ParentCategoryId WHERE  c.IsDelete  = 0
			),CTE_Result AS(
				SELECT ROW_NUMBER() OVER (ORDER BY
		 			CASE WHEN (@lSortColumn='categoryName_ASC')
						THEN CategoryWithSubcategory
					END ASC,
					CASE WHEN (@lSortColumn='categoryName_DESC')
						THEN CategoryWithSubcategory
					END DESC,
					CASE WHEN (@lSortColumn='displayOrder_ASC')
						THEN DisplayOrder
					END ASC,
						CASE WHEN (@lSortColumn='displayOrder_DESC')
						THEN DisplayOrder
					END DESC
			)AS ROWNUM , Count(cteCategory.ID) OVER () AS TotalCount,cteCategory.ID AS Id, CategoryWithSubcategory AS CategoryName, ParentCategoryID AS ParentCategoryId, IsActive, DisplayOrder 
			FROM cteCategory
			WHERE 
			(@ICategoryNameFilter IS NULL OR @ICategoryNameFilter = '' OR cteCategory.CategoryName Like '%' + CAST(@ICategoryNameFilter AS nvarchar) + '%') AND 
					(@lFilter IS NULL OR @lFilter=''  OR cteCategory.CategoryName Like '%' + CAST(@lFilter AS nvarchar) + '%') AND
					(@IStatusFilter=-1 OR (cteCategory.IsActive=@IStatusFilter))
					)
	
			SELECT * from CTE_Result 
				 WHERE ROWNUM > @lFirstRec AND ROWNUM < @lLastRec
		END
			
