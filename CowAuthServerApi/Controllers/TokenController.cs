using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CowAuthServerApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        // GET: /<controller>/
        [HttpGet]
        [Authorize]
        public IActionResult Get()
        {
            var user = new UserDto
            {
                Username = User.Identity.Name
            };

            var token = GenerateJwtToken();



            return Ok(new UserDto
            {
                Username = User.Identity.Name,
                Token = token
            });
        }

        private string GenerateJwtToken()
        {
            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.NameIdentifier, User.Identity.Name),
                new Claim(ClaimTypes.Name, User.Identity.Name)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("super secret key"));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
