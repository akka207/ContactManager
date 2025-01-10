using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ContactManager.Models
{
    public class Contact
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; } = default!;

        public DateTime DateOfBirth { get; set; }

        public bool Married { get; set; }

        public string Phone { get; set; } = default!;

        public decimal Salary { get; set; }
    }
}
