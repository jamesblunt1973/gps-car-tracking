using Goldtrax.Models;
using Microsoft.EntityFrameworkCore;

namespace Goldtrax.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Device> Devices { get; set; }
        public DbSet<GpsLog> GpsLogs { get; set; }
        public DbSet<UserDevice> UserDevices { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserDevice>()
                .HasKey(a => new { a.UserId, a.DeviceId });

            modelBuilder.Entity<User>()
                .HasOne(a => a.Parent)
                .WithMany(a => a.Childs)
                .HasForeignKey(a => a.ParentId);
        }
    }
}
