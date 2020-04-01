using Goldtrax.Data;
using Goldtrax.Models;
using Goldtrax.Hubs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace Goldtrax.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class MessageController: ControllerBase
    {
        private readonly IHubContext<DeviceHub, IClientMethods> hub;
        private readonly IRepository repo;

        public MessageController(IHubContext<DeviceHub, IClientMethods> hub, IRepository repo)
        {
            this.hub = hub;
            this.repo = repo;
        }

        public async Task Post(GpsLog data)
        {
            // save to database
            data.SubmitDate = DateTime.Now;
            await repo.SaveGpsLog(data);
            var groupId = data.DeviceId.ToString();
            await hub.Clients.Group(groupId).NewPosition(data.DeviceId, data.Latitude, data.Longitude);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(DeviceLogin data)
        {
            return Ok(await repo.FindDeviceByImei(data.Imei));
        }
    }
}
