using System.ComponentModel.DataAnnotations;

namespace Goldtrax.Models
{
    public class DeviceLogin
    {
        [Required]
        [StringLength(15, MinimumLength = 15, ErrorMessage = "IMEI must be 15 digits.")]
        public string Imei { get; set; }
    }
}
