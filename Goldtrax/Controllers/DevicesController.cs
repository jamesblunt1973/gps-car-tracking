using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Goldtrax.Data;
using Goldtrax.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Goldtrax.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DevicesController : ControllerBase
    {
        private readonly IRepository repo;

        public DevicesController(IRepository repo)
        {
            this.repo = repo;
        }

        [HttpGet("checkImei/{imei}")]
        public async Task<IActionResult> CheckImei(string imei)
        {
            var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return BadRequest();
            var id = Convert.ToInt32(userId);
            var result = await repo.CheckImei(imei, id);
            if (result.HasValue)
            {
                if (result.Value)
                    return Ok(); // با موفقیت ثبت شد
                else
                    return Unauthorized(); // دستگاه قبلا ثبت شده است
            }
            else
                return NotFound(); // دستگاه در سامانه ثبت نشده است
        }

        [HttpGet]
        public async Task<IActionResult> GetUserDevices()
        {
            var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return BadRequest();
            return Ok(await repo.GetUserDevices(userId));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserDevice(int id)
        {
            var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return BadRequest();
            await repo.DeleteUserDevice(id, userId);
            return NoContent();
        }

        [HttpPost("log")]
        public async Task<IActionResult> GetDeviceLog(GetLogParameter data)
        {
            var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return BadRequest();
            data.UserId = Convert.ToInt32(userId);
            return Ok(await repo.GetDeviceLog(data));
        }
    }
}