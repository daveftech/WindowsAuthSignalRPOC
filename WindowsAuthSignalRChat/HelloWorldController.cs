using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WindowsAuthSignalRChat
{
    [Route("api/[controller]")]
    public class HelloWorldController : ControllerBase
    {
        // GET: api/<controller>
        [HttpGet]
        [Authorize]
        public string Get()
        {
            return $"Hello, {User.Identity.Name}!";
        }
    }
}
