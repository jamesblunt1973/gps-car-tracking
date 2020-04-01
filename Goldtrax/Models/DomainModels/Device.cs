using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Goldtrax.Models
{
    public class Device
    {
        public int Id { get; set; }

        [Required]
        [StringLength(15, MinimumLength = 15, ErrorMessage = "IMEI must be 15 digits.")]
        public string Imei { get; set; }

        public bool Production { get; set; }

        [Column(TypeName = "smalldatetime")]
        public DateTime LastConnection { get; set; }

        // Navigation Properties
        public IEnumerable<GpsLog> GpsLogs { get; set; }
        public IEnumerable<UserDevice> UserDevices { get; set; }
    }
}
