using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using SocialEcommerce.WebAPI.Common;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using SocialEcommerce.Data.Entities;
using SocialEcommerce.Repository.ViewModels;
using SocialEcommerce.Shared.Utilities;
using SocialEcommerce.Shared.Constants;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;

namespace SocialEcommerce.WebAPI.Controllers
{

    [Route("api/account")]
    
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly ILogger<AccountController> _logger;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;
        private readonly IOptions<IdentityOptions> _options;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            RoleManager<Role> roleManager,
            SignInManager<ApplicationUser> signInManager,
            ILogger<AccountController> logger,
            IMapper mapper,
            IHttpContextAccessor httpContextAccessor,
            IConfiguration config, IOptions<IdentityOptions> options,
            IWebHostEnvironment webHostEnvironment
            )
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _logger = logger;
            _mapper = mapper;
            _config = config;
            _options = options;
            _webHostEnvironment = webHostEnvironment;

        }

        //Register api for user and distributor
        [Route("register")]
        [HttpPost]
        public async Task<Message> Register(RegisterDto input)
        {
            
            string returnUrl = null;
            returnUrl = returnUrl ?? Url.Content("~/");

            bool isSuccess = false;
            string message = string.Empty;
            try
            {        


            if (ModelState.IsValid)
            {
                var user = new ApplicationUser { FirstName = input.FirstName, LastName = input.LastName, UserName = input.Email, Email = input.Email, PhoneNumber = input.PhoneNumber };
                var result = await _userManager.CreateAsync(user, input.Password);
                if (input.isRole)
                {
                    await _userManager.AddToRoleAsync(user, "User");
                }
                else
                {
                    await _userManager.AddToRoleAsync(user, "Distributor");
                }

                if (result.Succeeded)
                {
                    _logger.LogInformation("User created a new account with password.");
                    var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                    code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

                    if (!string.IsNullOrEmpty(code))
                    {
                            string physicalUrl = _config.GetValue<string>("CommonProperty:ClientPhysicalUrl");
                            string emailBody = SocialEcommerce.Shared.Utilities.Utility.ReadEmailTemplate(@"wwwroot\", EmailConstant.TemplateName.ConfirmEmail, physicalUrl);
                      
                        var callbackUrl = physicalUrl + "/#/auth/confirm-email/" + user.Email + "/" + code;
                        var logoUrl = _config.GetValue<string>("App:ServerRootAddress") + SocialEcommerce.Shared.Constants.MailLogoURL.LogoURL; //Arti

                        emailBody = emailBody.Replace("{UserName}", user.UserName);
                        emailBody = emailBody.Replace("{CallBackUrl}", callbackUrl);
                        emailBody = emailBody.Replace("{PathURL}", MailLogoURL.PathURL);  //Arti
                        EmailService.Send(@"Email confirmation mail from Divide & conquer Social Ecommerce", emailBody, user.Email);
                        isSuccess = true;
                    }
                    else
                    {
                        isSuccess = false;
                    }

                }

                foreach (var error in result.Errors)
                {
                    isSuccess = false;
                    message = message + " " + error.Description + "";
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            } 
            }
            catch (System.Exception e )
            {

                return new Message()
                {
                    isSuccess = !isSuccess,
                    message = "something went wrong" ,
                    jsonObj = null,// input,
                };
            }
            return new Message()
            {
                isSuccess = isSuccess,
                message = message,
                jsonObj = null,// input,
            };
        }

        //Login api for user and distributor
        [Route("login")]
        [HttpPost]
        public async Task<Message> Login(LoginDto input)
        {
            bool isSuccess = false;
            string message = string.Empty;
            var user_mapping = new ApplicationUserDto();
            var user = await _userManager.FindByEmailAsync(input.Email);
            if (user != null && user.EmailConfirmed && user.IsActive && !user.IsDelete)
            {
                
                var role = await _userManager.GetRolesAsync(user);
                if (role[0] == "Admin"|| role[0] == "Distributor"  || role[0] == "User" )
                {
                    if (ModelState.IsValid)
                    {
                        var result = await _signInManager.PasswordSignInAsync(input.Email, input.Password, input.RememberMe, lockoutOnFailure: false);
                        if (result.Succeeded)
                        {
                         //ClaimsPrincipalFactory claims = new ClaimsPrincipalFactory(_userManager, _roleManager, _options);
                               isSuccess = true;
                            user_mapping = _mapper.Map<ApplicationUserDto>(user);
                            user_mapping.Role = role;
                            _logger.LogInformation("User logged in.");
                            //var claimResult=await claims.createClaimAsync(user);
                           // _userManager.AddClaimAsync(user,new Claim("UserName",))

                        }
                        else
                        {
                            ModelState.AddModelError(string.Empty, "Invalid  login attempt.");
                            message = message + "Invalid  login attempt.";
                            isSuccess = false;
                         



                        }
                    }
                }
                else {
                    isSuccess = false;
                    message = message + "Invalid User ";
                }
            }
            else {
                isSuccess = false;
                message = message + "Invalid User ";
            }
            return new Message()
            {
                isSuccess = isSuccess,
                message = message,
                jsonObj = user_mapping
            };
        }


        [Route("getUserRole")]
        [HttpPost]
        public async Task<Message> GetUserRole(LoginDto input)
        {
            bool isSuccess = false;
            string message = string.Empty;
            var user = await _userManager.FindByEmailAsync(input.Email);
            string UserRole = "";
            if (user != null)
            {
                var role = await _userManager.GetRolesAsync(user);
                if (!string.IsNullOrEmpty(role[0]))
                {
                    isSuccess = true;
                    UserRole = role[0];
                }
                else {
                    isSuccess = false;
                    message = message + "Invalid User";
                }
            }
            return new Message()
            {
                isSuccess = isSuccess,
                message = message,
                jsonObj = UserRole,
            };
        }


        [Route("confirmemail")]
        [HttpPost]
        public async Task<Message> ConfirmEmail(ConfirmEmailDto input)
        {
            bool isSuccess = false;
            string message = string.Empty;
            var user_mapping = new ApplicationUserDto();
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByEmailAsync(input.Email);
                if (user == null || input.accessToken == null)
                {
                    isSuccess = false;
                    message = message + "User is not valid";
                }
                else
                {
                    if (user.EmailConfirmed)
                    {
                        isSuccess = true;
                       
                        message = message + "Your Email is already confirmed. ";
                    }
                    else
                    {
                        var code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(input.accessToken));
                        user.IsActive = true;
                        user.EmailConfirmed = true; //arti
                        var userToken = await _userManager.ConfirmEmailAsync(user, code);
                     
                        if (userToken.Succeeded)
                        {
                            await _userManager.UpdateAsync(user);  //arti
                            isSuccess = true;
                            message = message + "Your Email is confirmed. ";
                        }
                        else
                        {
                            isSuccess = false;
                            message = message + "Invalid Token ";
                        }
                    }
                }

            }
            return new Message()
            {
                isSuccess = isSuccess,
                message = message,
                jsonObj = user_mapping,
            };
        }

        //Forget Password API for user and distributor
        [Route("forgetpassword")]
        [HttpPost]
        public async Task<Message> ForgetPassword(ForgetPasswordDto input)
        {
            string returnUrl = null;
            returnUrl = returnUrl ?? Url.Content("~/");
            bool isSuccess = false;
            string message = string.Empty;
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByEmailAsync(input.Email);
                if (user != null && (await _userManager.IsEmailConfirmedAsync(user)))
                {
                    // Don't reveal that the user does not exist or is not confirmed
                    var code = await _userManager.GeneratePasswordResetTokenAsync(user);
                    code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
                    if (!string.IsNullOrEmpty(code))
                    {
                        string physicalUrl = _config.GetValue<string>("CommonProperty:ClientPhysicalUrl");
                        string emailBody = SocialEcommerce.Shared.Utilities.Utility.ReadEmailTemplate(_webHostEnvironment.WebRootPath, EmailConstant.TemplateName.ForgotPassword, physicalUrl);

                        var logoUrl = _config.GetValue<string>("App:ServerRootAddress") + SocialEcommerce.Shared.Constants.MailLogoURL.LogoURL; //Arti

                        var callbackUrl = physicalUrl + "/#/auth/reset-password/" + code;
                        //var callbackUrl = "http://localhost:4200/auth/reset-password/" + code;

                        emailBody = emailBody.Replace("{UserName}", user.UserName);
                        emailBody = emailBody.Replace("{CallBackUrl}", callbackUrl);
                        emailBody = emailBody.Replace("{PathURL}", MailLogoURL.PathURL);  //Arti
                        EmailService.Send(@"Forget password recovery mail from Divide & conquer Social Ecommerce", emailBody, user.Email);
                        isSuccess = true;
                    }
                    else
                    {
                        isSuccess = false;
                        message = message + "Invalid User ";
                    }
                }
                else
                {
                    isSuccess = false;
                    message = message + "User not Found ";

                }
            }

            return new Message()
            {
                isSuccess = isSuccess,
                message = message,
            };
        }

        [Route("resetpassword")]
        [HttpPost]
        public async Task<Message> ResetPassword(ResetPasswordDto input)
        {
            bool isSuccess = false;
            string message = string.Empty;
            var user = await _userManager.FindByEmailAsync(input.Email);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                isSuccess = false;
                message = message + "User not found. ";
            }
            else
            {
                input.Code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(input.Code));
                var result = await _userManager.ResetPasswordAsync(user, input.Code, input.Password);
                if (result.Succeeded)
                {
                    isSuccess = true;
                }
                foreach (var error in result.Errors)
                {
                    //ModelState.AddModelError(string.Empty, error.Description);
                    isSuccess = false;
                    message = message + error.Description + " ";
                }
            }
            return new Message()
            {
                isSuccess = isSuccess,
                message = message,
            };
        }

        [Route("currentUser")]
        [HttpGet]
        public async Task<Message> GetLoggedInUser()
        {

            bool isSuccess = false;
            string message = string.Empty;
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // will give the user's userId
            var userName = User.FindFirstValue(ClaimTypes.Name); // will give the user's userName
            var userEmail = User.FindFirstValue(ClaimTypes.Email); // will give the user's Email

            ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
            var data = HttpContext.User.Identity.Name;
            if (user == null)
            {
                isSuccess = false;
                message = message + "User not found. ";
            }
            else
            {
                isSuccess = true;
                message = message + "User found .";
            }

            return new Message()
            {
                isSuccess = isSuccess,
                message = message,
                jsonObj = user
            };

        }

        [Route("logout")]
        [HttpPost]
        public async Task<Message> Logout()
        {

            await _signInManager.SignOutAsync();
            _logger.LogInformation("User logged out.");
            return new Message()
            {
                isSuccess = true,
                message = "User logged out"

            };
        }
    }

}