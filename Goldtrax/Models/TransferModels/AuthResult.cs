namespace Goldtrax.Models
{
    public class AuthResult
    {
        public AuthResult(User user, string token)
        {
            Id = user.Id;
            Name = user.Name;
            UserName = user.UserName;
            Cell = user.Cell;
            Gender = user.Gender;
            Token = token;
        }
        public int Id { get; set; }
        public string Name { get; set; }
        public string UserName { get; set; }
        public string Cell { get; set; }
        public string Token { get; set; }
        public bool? Gender { get; set; }
    }
}
