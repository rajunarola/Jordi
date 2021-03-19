using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SocialEcommerce.Data;
using SocialEcommerce.Data.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using System;
using System.Linq;
using AutoMapper;
using SocialEcommerce.Data.Repository;
using SocialEcommerce.Repository.Interfaces;
using SocialEcommerce.Repository.Respositories;
using SocialEcommerce.Repository.Mapper;
using SocialEcommerce.WebAPI.Mapper;
using SocialEcommerce.WebAPI;
using SocialEcommerce.Data.Seeders;


namespace SocialEcommerce
{
    public class Startup
    {
        const string DefaultCorsPolicyName = "SocialEcommercePolicy";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            
            //Configure CORS for angular2 UI
            services.AddCors(options =>
            {
                options.AddPolicy(DefaultCorsPolicyName, builder =>
                {
                    // App:CorsOrigins in appsettings.json - list of Comma Separated Variables
                    var origins = Configuration.GetSection("App")
                      .GetSection("CorsOrigins")
                      .Value.Split(",", StringSplitOptions.RemoveEmptyEntries)
                      .ToArray();

                    builder
                       .WithOrigins(origins)
                       .AllowAnyHeader()
                       .AllowAnyMethod()
                       .AllowCredentials();
                });
            });

            services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
            services.AddIdentity<ApplicationUser, Role>()
                .AddRoles<Role>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();
            services.AddScoped<RoleManager<Role>>();

            services.AddScoped<IUserClaimsPrincipalFactory<ApplicationUser>, ClaimsPrincipalFactory>();
            //services.AddDbContext<ApplicationDbContext>(options =>
            //    options.UseSqlServer(
            //        Configuration.GetConnectionString("DefaultConnection")));

            //services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
            //    .AddRoles<IdentityRole>()
            //    .AddEntityFrameworkStores<ApplicationDbContext>();


            //services.AddIdentityServer()
            //    .AddApiAuthorization<ApplicationUser<long>, ApplicationDbContext>();
            services.AddHealthChecks();

            services.AddAuthentication()
               .AddIdentityServerJwt();

            services.AddHttpContextAccessor();
            //services.AddControllersWithViews();
            services.AddRazorPages();
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = $"Social Ecommerce - {DateTime.Today.Month}{DateTime.Today.Day}{DateTime.Today.Hour}", Version = "v1" });
            });
            services.AddAutoMapper(typeof(Startup),typeof(AutoMapperProfile),typeof(RepositoryAutoMapperProfile));
            services.AddAutoMapper(typeof(Startup), typeof(AutoMapperProfile), typeof(AutoMapperProfile));
            services.AddControllersWithViews();
            services.AddScoped<IStoredProcedureRepositoryBase, StoredProcedureRepositoryBase>();
            services.AddScoped<ICategory, CategoryRepository>();
            services.AddScoped<IProductService, ProductRepository>();
            services.AddScoped<IUserService, UserRepository>();
            services.AddScoped<ICartService, CartRepository>();


        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, UserManager<ApplicationUser> userManager, RoleManager<Role> roleManager)
        {
            app.UseCors(
                 options => options.SetIsOriginAllowed(x => _ = true).AllowAnyMethod().AllowAnyHeader().AllowCredentials()
             ); // Enable CORS.

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseRouting();

            app.UseAuthentication();
            //app.UseIdentityServer();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                endpoints.MapRazorPages();
            });

            //app.UseSpa(spa =>
            //{
            //    // To learn more about options for serving an Angular SPA from ASP.NET Core,
            //    // see https://go.microsoft.com/fwlink/?linkid=864501

            //    spa.Options.SourcePath = "ClientApp";

            //    if (env.IsDevelopment())
            //    {
            //        spa.UseAngularCliServer(npmScript: "start");
            //    }
            //});

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger(opt =>
            {
            });

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Social Ecommerce API v1");
                c.RoutePrefix = string.Empty;
            }); 

            SeedData.Seed(userManager, roleManager);

        }

        //public class FileUploadOperationSwagger : IOperationFilter
        //{
        //    public void Apply(Operation operation, OperationFilterContext context)
        //    {
        //        if (operation.OperationId == "Post")
        //        {
        //            operation.Parameters = new List<IParameter>
        //        {
        //            new NonBodyParameter
        //            {
        //                Name = "myFile",
        //                Required = true,
        //                Type = "file",
        //                In = "formData"
        //            }
        //        };
        //        }
        //    }
        //}
    }
}

