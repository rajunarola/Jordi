using Microsoft.EntityFrameworkCore.Migrations;

namespace SocialEcommerce.Data.Migrations
{
    public partial class Added_UserId_ProductTBL : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "UserId",
                table: "ProductMaster",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Cart_ProductMaster_UserId",
                table: "Cart",
                column: "UserId",
                principalTable: "ProductMaster",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cart_ProductMaster_UserId",
                table: "Cart");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "ProductMaster");
        }
    }
}
