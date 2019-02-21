using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace WindowsAuthSignalRChat
{
    public class ChatUserIdProvider : IUserIdProvider
    {
        public string GetUserId(HubConnectionContext connection)
        {
            return connection.User?.FindFirst(ClaimTypes.Name)?.Value;
        }
    }
}
