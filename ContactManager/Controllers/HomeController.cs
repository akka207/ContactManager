using System.Diagnostics;
using System.Globalization;
using ContactManager.Data;
using ContactManager.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ContactManager.Controllers
{
    public class HomeController : Controller
    {
        private readonly ContactsDBContext _context;


        public HomeController(ContactsDBContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [HttpPost]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            using (StreamReader reader = new StreamReader(file.OpenReadStream()))
            {
                string data = await reader.ReadToEndAsync();
                try
                {
                    await _context.Contacts.AddRangeAsync(ConvertCSVtoContacts(data));
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    ViewData["FileErrorMessage"] = ex.Message;
                }
                return View("Index");
            }
        }

        private List<Contact> ConvertCSVtoContacts(string csv)
        {
            var contacts = new List<Contact>();
            var lines = csv.Split('\n');

            if (lines.Length < 2)
            {
                throw new Exception("Empty file or only headers occured");
            }

            for (int i = 1; i < lines.Length; i++)
            {
                var columns = lines[i].Split(',');

                if (columns.Length != 5)
                    throw new Exception($"Row {i + 1} doesn't contain enough values");

                try
                {
                    var contact = new Contact
                    {
                        Name = columns[0],
                        DateOfBirth = DateTime.ParseExact(columns[1], "yyyy-MM-dd", CultureInfo.InvariantCulture),
                        Married = bool.Parse(columns[2]),
                        Phone = columns[3],
                        Salary = decimal.Parse(columns[4], CultureInfo.InvariantCulture)
                    };
                    contacts.Add(contact);
                }
                catch (FormatException)
                {
                    throw new Exception($"Invalid data format (row {i + 1})");
                }
            }

            return contacts;
        }
    }
}
