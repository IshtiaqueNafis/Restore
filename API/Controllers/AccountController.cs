using System.Threading.Tasks;
using API.data;
using API.DTO;
using API.Extensions;
using API.models;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        private readonly StoreContext _context;

        public AccountController(UserManager<User> userManager, TokenService tokenService, StoreContext context)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _context = context;
        }

        #region public async Task<ActionResult<User>> Login(LogInDto loginDto) HTTP method:POST,--->logs in user return ==>User object***

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LogInDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.Username);


            if (user == null ||
                !await _userManager.CheckPasswordAsync(user,
                    loginDto.Password)) // check whether user name is null or not. 
            {
                return Unauthorized();
            }

            var userBasket = await RetrievedBasket(loginDto.Username);
            var anonymousBasket = await RetrievedBasket(Request.Cookies["buyerId"]);
            if (anonymousBasket != null)
            {
                if (userBasket != null) _context.Baskets.Remove(userBasket);
                anonymousBasket.BuyerId = user.UserName;
                Response.Cookies.Delete("buyerId");
            }

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = anonymousBasket != null ? anonymousBasket.MapBasketToDto() : userBasket.MapBasketToDto()
            };
        }

        #endregion

        #region ***public async Task<ActionResult> Register(RegisterDto registerDto)  HTTP method:post --->register user returns==>201 user registered***

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            var user = new User
            {
                UserName = registerDto.Username,
                Email = registerDto.Email
            };
            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }

                return ValidationProblem();
            }

            await _userManager.AddToRoleAsync(user, "Member");
            return StatusCode(201);
        }

        #endregion

        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByNameAsync(User.Identity?.Name);
            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user)
            };
        }

        private async Task<Basket> RetrievedBasket(string buyerId)
            // no actionresults here since this is a normal method. 
        {
            if (string.IsNullOrEmpty(buyerId))
            {
                Response.Cookies.Delete("buyerId"); // no buyer id delete it. 
                return null;
            }

            return await _context.Baskets.Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
        }
    }
}