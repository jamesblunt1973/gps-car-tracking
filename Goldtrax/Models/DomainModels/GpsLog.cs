using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Goldtrax.Models
{
    public class GpsLog
    {
        public int Id { get; set; }
        public int DeviceId { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double Altitude { get; set; }
        public double Speed { get; set; }
        public double Direction { get; set; }
        [Column(TypeName = "smalldatetime")]
        public DateTime DeviceDate { get; set; }
        public DateTime SubmitDate { get; set; }
        public long Distance { get; set; }
        public byte Satellite { get; set; }
        public byte Alarm { get; set; }
        public byte Hdop { get; set; }

        // Navigation Properties
        public Device Device { get; set; }
    }
}
