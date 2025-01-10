using ContactManager.Models;
using Microsoft.EntityFrameworkCore;

namespace ContactManager.Data
{
    public class ContactsDBContext:DbContext
    {
        public ContactsDBContext(DbContextOptions<ContactsDBContext> options) : base(options) { }
        
        public DbSet<Contact> Contacts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Contact>(entity =>
            {
                entity.Property(e => e.Salary)
                    .HasColumnType("decimal(18, 2)");
            });
        }
    }
}
