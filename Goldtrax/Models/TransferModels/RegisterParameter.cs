using System.ComponentModel.DataAnnotations;

namespace Goldtrax.Models
{
    public class RegisterParameter
    {
        [Required]
        [StringLength(255, ErrorMessage = "نام باید حداکثر 255 کاراکتر باشد")]
        public string Name { get; set; }

        [Required]
        [StringLength(11, MinimumLength = 11, ErrorMessage = "شماره همراه باید 11 رقم باشد")]
        public string Cell { get; set; }

        [Required]
        public string UserName { get; set; }

        public bool? Gender { get; set; }

        [Required]
        [StringLength(255, MinimumLength = 4, ErrorMessage = "رمزعبور باید بین 4 تا 255 کاراکتر باشد")]
        public string Password { get; set; }
    }
}
