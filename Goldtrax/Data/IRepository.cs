using Goldtrax.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Goldtrax.Data
{
    public interface IRepository
    {
        Task<bool?> CheckImei(string imei, int userId);
        Task<IEnumerable<UserDeviceResult>> GetUserDevices(string userId);
        Task SaveGpsLog(GpsLog data);
        Task<int> FindDeviceByImei(string imei);
        Task DeleteUserDevice(int deviceId, string userId);
        Task<List<GpsLog>> GetDeviceLog(GetLogParameter data);
        Task<List<User>> GetUsers(int userId);
		Task<IEnumerable<int>> GetUserOwnerDevices(int userId, int ownerId);
	}
}
