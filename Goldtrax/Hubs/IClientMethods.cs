using System.Threading.Tasks;

namespace Goldtrax.Hubs
{
    public interface IClientMethods
    {
        Task NewPosition(int id, double lat, double lng);
    }
}
