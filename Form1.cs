 using System;
using System.IO;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;

namespace Simulator
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            InitializeWebView();
        }

        private async void InitializeWebView()
        {
            // Initialize WebView2
            await webView21.EnsureCoreWebView2Async(null);

            // Listen for messages from JavaScript
            webView21.CoreWebView2.WebMessageReceived += CoreWebView2_WebMessageReceived;

            // Load local HTML file
            string filePath = Path.Combine(Application.StartupPath, "index.html");
            webView21.Source = new Uri(filePath);
        }

        // Receive messages from JavaScript
        private void CoreWebView2_WebMessageReceived(object sender, CoreWebView2WebMessageReceivedEventArgs e)
        {
            string message = e.TryGetWebMessageAsString();

            if (message == "generate")
            {
                Random rand = new Random();
                int value = rand.Next(1, 101);

                // Send value back to JavaScript
                webView21.CoreWebView2.PostWebMessageAsString(value.ToString());
            }
        }
    }
}