using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using API.models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService
    {
        private readonly UserManager<User> _userManager; // for managing user 
        private readonly IConfiguration _config; // gives acess to confog setting 

        public TokenService(UserManager<User> userManager, IConfiguration config)
        {
            _userManager = userManager;
            _config = config;
        }

        public async Task<string> GenerateToken(User user) // pass the user here 
        {
            // check with user claim with email and name 

             List<Claim> claims = new List<Claim> // someething user say they are 
            {
                new Claim(ClaimTypes.Email, user.Email), // check for userEmail 
                new Claim(ClaimTypes.Name, user.UserName), //c=heck for User Username
            };
            var roles = await _userManager.GetRolesAsync(user); // get roles 
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role,
                    role)); // check for roles abnd tgeb if tge rikes us tgere add ut, 
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWTSettings:TokenKey"])); // getting the seceret key from appDevelopment setting 
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);
            var tokenOptions = new JwtSecurityToken(
                issuer: null, //  party that "created" the token and signed it with its private ke
                audience: null, //identifies the recipients that the JWT is intended for
                claims: claims, // pass the allthe clain iformation 
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds // creates signing key, signing key identifier, and security algorithms
            );
            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        }
    }
}