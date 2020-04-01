using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;

namespace Goldtrax.Hubs
{
    public class DeviceHub : Hub<IClientMethods>
    {
        public static Dictionary<int, string> connections = new Dictionary<int, string>();
        public void ConnectUser(int userId, string[] devices)
        {
            if (connections.ContainsKey(userId))
            {
                connections[userId] = Context.ConnectionId;
            }
            else
            {
                connections.Add(userId, Context.ConnectionId);
            }
            foreach (var deviceId in devices)
            {
                Groups.AddToGroupAsync(Context.ConnectionId, deviceId);
            }
        }
    }
}
