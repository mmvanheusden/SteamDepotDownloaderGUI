using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;

namespace DepotDownloaderGUI
{
    public partial class Form1 : Form
    {
        string Command;
        public Form1()
        {
            InitializeComponent();
            Directory.SetCurrentDirectory("./depotdownloader/");
            textBox2.PasswordChar = '*';
        }

        private void Form1_Load(object sender, EventArgs e)
        {

        }

        private void button1_Click(object sender, EventArgs e)
        {
            if (textBox2.Text == "")
                Command = $"/k dotnet DepotDownloader.dll -app {textBox3.Text} -depot {textBox4.Text} -manifest {textBox5.Text} -max-servers {numericUpDown1.Value} -max-downloads {numericUpDown2.Value} -dir ../YourGame {textBox8.Text}";
            else
                Command = $"/k dotnet DepotDownloader.dll -app {textBox3.Text} -depot {textBox4.Text} -manifest {textBox5.Text} -username {textBox1.Text} -password {textBox2.Text} -max-servers {numericUpDown1.Value} -max-downloads {numericUpDown2.Value} -dir ../YourGame {textBox8.Text}";
            System.Diagnostics.Process.Start("cmd.exe", Command);
        }

        private void textBox2_TextChanged(object sender, EventArgs e)
        {

        }

        private void textBox8_TextChanged(object sender, EventArgs e)
        {

        }

        private void button2_Click(object sender, EventArgs e)
        {
            System.Diagnostics.Process.Start("https://github.com/mmvanheusden/SteamDepotDownloaderGUI/discussions/5");
        }

        private void button3_Click(object sender, EventArgs e)
        {
            System.Diagnostics.Process.Start("https://steamdb.info/instantsearch/");
        }

        private void button4_Click(object sender, EventArgs e)
        {
            System.Diagnostics.Process.Start("https://github.com/mmvanheusden/SteamDepotDownloaderGUI");
        }

        private void toolTip1_Popup(object sender, PopupEventArgs e)
        {

        }
    }
}
