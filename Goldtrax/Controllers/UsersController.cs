using Goldtrax.Data;
using Goldtrax.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Goldtrax.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UsersController : ControllerBase
	{
		private readonly IRepository repo;

		public UsersController(IRepository repo)
		{
			this.repo = repo;
		}

		[HttpGet]
		public async Task<IActionResult> GetUsers()
		{
			var nameId = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
			if (string.IsNullOrEmpty(nameId))
				return BadRequest();
			var userId = Convert.ToInt32(nameId);
			var list = await repo.GetUsers(userId);
			var users = list.Select(a => new AuthResult(a, ""));
			return Ok(users);
		}

		[HttpGet("devices/{id}")]
		public async Task<IActionResult> GetUserDevices(int id)
		{
			var nameId = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
			if (string.IsNullOrEmpty(nameId))
				return BadRequest();
			var ownerId = Convert.ToInt32(nameId);
			return Ok(await repo.GetUserOwnerDevices(id, ownerId));
		}
	}
}