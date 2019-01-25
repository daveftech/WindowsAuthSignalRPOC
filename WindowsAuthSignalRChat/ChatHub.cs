using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using WindowsAuthSignalRChat.Models;

namespace WindowsAuthSignalRChat
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string name, string text)
        {
            var message = new ChatMessage
            {
                SenderName = name,
                Text = text,
                SentAt = DateTimeOffset.UtcNow
            };

            await Clients.All.SendAsync("ReceiveMessage", message.SenderName, message.SentAt, message.Text);
        }
    }
}
