using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Diagnostics;
using System.Threading.Tasks;
using WindowsAuthSignalRChat.Models;

namespace WindowsAuthSignalRChat
{
    public class ChatHub : Hub
    {
        public override async Task OnConnectedAsync()
        {


            await base.OnConnectedAsync();
        }

        [Authorize]
        public async Task SendMessage(string text)
        {
            Debug.WriteLine($"Current User: {Context?.User?.Identity?.Name}");

            var message = new ChatMessage
            {
                SenderName = Context?.User?.Identity?.Name,
                Text = text,
                SentAt = DateTimeOffset.UtcNow
            };

            await Clients.All.SendAsync("ReceiveMessage", message.SenderName, message.SentAt, message.Text);
        }
    }
}
