using Dapper;
using Goldtrax.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Goldtrax.Data
{
	public class Repository : IRepository
	{
		private readonly DataContext context;
		private readonly IConfiguration configuration;
		private readonly ILogger<Repository> logger;

		public Repository(DataContext context, IConfiguration configuration, ILogger<Repository> logger)
		{
			this.context = context;
			this.configuration = configuration;
			this.logger = logger;
		}

		public async Task<bool?> CheckImei(string imei, int userId)
		{
			var device = await context.Devices
				.Include(a => a.UserDevices)
				.SingleOrDefaultAsync(a => a.Imei == imei);
			if (device == null)
				return null; // دستگاه در سامانه ثبت نشده است
			if (device.UserDevices.Any())
				return false; // دستگاه به نام شخص دیگری ثبت شده است
							  // ثبت دستگاه به نام کاربر
			await context.UserDevices.AddAsync(new UserDevice()
			{
				DeviceId = device.Id,
				Owner = true,
				UserId = userId
			});
			await context.SaveChangesAsync();
			return true;
		}

		public async Task<int> FindDeviceByImei(string imei)
		{
			var device = await context.Devices.SingleOrDefaultAsync(a => a.Imei == imei);
			if (device == null)
			{
				device = new Device()
				{
					Imei = imei,
					LastConnection = DateTime.Now,
					Production = false
				};
				await context.Devices.AddAsync(device);
				await context.SaveChangesAsync();
			}
			return device.Id;
		}

		public async Task<IEnumerable<UserDeviceResult>> GetUserDevices(string userId)
		{
			string connectionString = configuration.GetConnectionString("Default");

			var commandText = "GetUserDevices";
			var command = new CommandDefinition(commandText, new { UserId = userId }, commandType: CommandType.StoredProcedure);

			IEnumerable<UserDeviceResult> result;
			try
			{
				using SqlConnection connection = new SqlConnection(connectionString);
				result = await connection.QueryAsync<Device, GpsLog, UserDevice, UserDeviceResult>(command, (device, gpsLog, devUser) =>
				{
					return new UserDeviceResult()
					{
						Device = device,
						GpsLog = gpsLog,
						Owner = devUser.Owner
					};
				});
			}
			catch (Exception ex)
			{
				var error = ex.GetExceptionMessage();
				logger.LogError(error);
				throw new Exception(error);
			}

			return result;
		}

		public async Task DeleteUserDevice(int deviceId, string userId)
		{
			string connectionString = configuration.GetConnectionString("Default");

			var commandText = "DeleteDeviceUser";
			var command = new CommandDefinition(commandText, new { UserId = userId, DeviceId = deviceId }, commandType: CommandType.StoredProcedure);

			try
			{
				using SqlConnection connection = new SqlConnection(connectionString);
				await connection.QueryAsync(command);
			}
			catch (Exception ex)
			{
				var error = ex.GetExceptionMessage();
				logger.LogError(error);
				throw new Exception(error);
			}
		}

		public async Task SaveGpsLog(GpsLog data)
		{
			await context.GpsLogs.AddAsync(data);
			await context.SaveChangesAsync();
		}

		public async Task<List<GpsLog>> GetDeviceLog(GetLogParameter data)
		{
			// TODO: Convert to sp
			return await context.GpsLogs.Where(a =>
				a.Device.UserDevices.Any(b => b.UserId == data.UserId) &&
				a.DeviceId == data.DeviceId &&
				a.SubmitDate >= data.From &&
				a.SubmitDate <= data.To)
				.ToListAsync();
		}

		public async Task<List<User>> GetUsers(int userId)
		{
			return await context.Users.Where(a => a.ParentId == userId).ToListAsync();
		}

		public async Task<IEnumerable<int>> GetUserOwnerDevices(int userId, int ownerId)
		{
			string connectionString = configuration.GetConnectionString("Default");

			var commandText = "GetUserOwnerDevices";
			var command = new CommandDefinition(commandText, new { userId, ownerId }, commandType: CommandType.StoredProcedure);

			IEnumerable<int> result;
			try
			{
				using SqlConnection connection = new SqlConnection(connectionString);
				result = await connection.QueryAsync<int>(command);
			}
			catch (Exception ex)
			{
				var error = ex.GetExceptionMessage();
				logger.LogError(error);
				throw new Exception(error);
			}

			return result;
		}
	}
}
