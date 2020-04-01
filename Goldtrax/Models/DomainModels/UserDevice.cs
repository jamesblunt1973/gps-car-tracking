using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Goldtrax.Models
{
    public class UserDevice
    {
        public int UserId { get; set; }
        public int DeviceId { get; set; }
        public bool Owner { get; set; }

        // Navigation Properties
        public Device Device { get; set; }
        public User User { get; set; }
    }
}
