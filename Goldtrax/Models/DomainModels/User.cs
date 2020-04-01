using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Goldtrax.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string UserName { get; set; }

        [Required]
        [StringLength(50)]
        public string Cell { get; set; }

        [Required]
        [StringLength(250)]
        public string Name { get; set; }

        public bool? Gender { get; set; }

        [Required]
        [MaxLength(1000)]
        public byte[] PasswordHash { get; set; }

        [Required]
        [MaxLength(1000)]
        public byte[] PasswordSalt { get; set; }

        public int? ParentId { get; set; }

        // Navigation Properties
        public IEnumerable<UserDevice> UserDevices { get; set; }
        public User Parent { get; set; }
        public IEnumerable<User> Childs { get; set; }
    }
}
