using Goldtrax.Data;
using Goldtrax.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Goldtrax.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	[AllowAnonymous]
	public class AuthController : ControllerBase
	{
		private readonly IAuthRepository repo;
		private readonly IConfiguration configuration;

		public AuthController(IAuthRepository repo, IConfiguration configuration)
		{
			this.repo = repo;
			this.configuration = configuration;
		}

		[HttpPost("register")]
		public async Task<IActionResult> Register(RegisterParameter data)
		{
			var userName = data.UserName.ToLower();
			var user = await repo.UserExists(userName, data.Cell);
			if (user != null)
			{
				if (user.UserName == userName)
					return BadRequest("نام کاربری تکراری است.");
				else if (user.Cell == data.Cell)
					return BadRequest("شماره همراه تکراری است.");
			}
			user = new User()
			{
				UserName = userName, Cell = data.Cell, Gender = data.Gender, Name = data.Name, 
			};
			var createdUser = await repo.Register(user, data.Password);
			// return CreatedAtRoute();
			return Ok(new AuthResult(user, GenerateJwtToken(user)));
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login(LoginParameter data)
		{
			var user = await repo.Login(data.UserName, data.Password);
			if (user == null)
				return Unauthorized();

			return Ok(new AuthResult(user, GenerateJwtToken(user)));
		}

		[HttpGet("checkUser")]
		public async Task<IActionResult> CheckUser()
		{
			var nameId = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
			if (string.IsNullOrEmpty(nameId))
				return Ok(false);
			var userId = Convert.ToInt32(nameId);
			var user = await repo.GetUser(userId);
			if (user == null)
				return NotFound();
			return Ok(new AuthResult(user, GenerateJwtToken(user)));
		}

		private string GenerateJwtToken(User user)
		{
			var claims = new[]
			{
				new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
			};
			var section = configuration.GetSection("AppSettings");
			var appSettings = section.Get<AppSettings>();
			var key = new SymmetricSecurityKey(
				Encoding.ASCII.GetBytes(appSettings.Secret)
			);
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
