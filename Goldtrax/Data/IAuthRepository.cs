using Goldtrax.Models;
using System.Threading.Tasks;

namespace Goldtrax.Data
{
    public interface IAuthRepository
    {
        Task<User> Register(User user, string password);
        Task<User> Login(string userName, string password);
        Task<User> UserExists(string userName, string cell);
        Task<User> GetUser(int id);
        Task UpdatePassword(User user, string password);
    }
}
