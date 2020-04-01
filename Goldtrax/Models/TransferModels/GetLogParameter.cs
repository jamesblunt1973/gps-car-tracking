using System;

namespace Goldtrax.Models
{
    public class GetLogParameter
    {
        public int UserId { get; set; }
        public int DeviceId { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }
    }
}
