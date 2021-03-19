USE [SocialEcommerceDb]
GO
/****** Object:  StoredProcedure [dbo].[Sp_ActiveDeactiveCategory]    Script Date: 21-10-2020 15:06:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[Sp_ActiveDeactiveCategory]
				@CategoryId bigint,
				@IsActive	bit
			AS
			BEGIN

				SET NOCOUNT ON;
				DECLARE @Temp_Next_Id bigint;
				SET @Temp_Next_Id = @CategoryId

				IF(@IsActive=0)
					BEGIN
						UPDATE Categories SET IsActive=0 WHERE id= @CategoryId
			
						While @Temp_Next_Id !=0
						BEGIN
							IF((SELECT COUNT(id) FROM Categories WHERE ParentCategoryId=@Temp_Next_Id and IsActive=1) > 0)
							BEGIN
								DECLARE @tmp bigint;
								SET @tmp = 0;
								SELECT @tmp=id FROM Categories WHERE  ParentCategoryId=@Temp_Next_Id and IsActive=1;

								UPDATE Categories SET IsActive=0 WHERE id=@tmp;

								IF((SELECT COUNT(id) FROM Categories WHERE ParentCategoryId=@Temp_Next_Id and IsActive=1) !> 0)
								BEGIN
									SET @Temp_Next_Id = @tmp;
								END
							END
							ELSE
							BEGIN
								SET @Temp_Next_Id=0;
							END
						END
					END

				ELSE IF(@IsActive=1)
					BEGIN
						UPDATE Categories SET IsActive=1 WHERE id= @CategoryId

				While @Temp_Next_Id !=0
				BEGIN
					IF((SELECT COUNT(id) FROM Categories WHERE ParentCategoryId=@Temp_Next_Id and IsActive=0) > 0)
						BEGIN
				
							DECLARE @tmpActive bigint;
							SET @tmpActive = 0;

							SELECT @tmpActive=id FROM Categories WHERE  ParentCategoryId=@Temp_Next_Id and IsActive=0;

							UPDATE Categories SET IsActive=1 WHERE id=@tmpActive;

							IF((SELECT COUNT(id) FROM Categories WHERE ParentCategoryId=@Temp_Next_Id and IsActive=0) !> 0)
							BEGIN
								SET @Temp_Next_Id = @tmpActive;
							END
						END

					ELSE
						BEGIN
							SET @Temp_Next_Id=0;
						END
					END
				END
			END
			
