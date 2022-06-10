using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Reflection;

namespace ABC_Bank_Server.Models
{
    public class AbcBankContext: DbContext
    {
        public virtual DbSet<Contact> Contacts { get; set; }

        public virtual DbSet<Address> Address { get; set; }

        public virtual DbSet<Phone> Phones { get; set; }


        public AbcBankContext()
        {
        }


        public AbcBankContext(DbContextOptions<AbcBankContext> options) : base(options)
        {
        }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelbuilder)
        {
            modelbuilder.Entity<Contact>(entity =>
            {
                entity.ToTable("Contact");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.FirstName)
                    .IsRequired();
                entity.Property(e => e.SecondName);
                entity.Property(e => e.Datebirth)
                    .IsRequired();
            });
            modelbuilder.Entity<Address>(entity =>
            {
                entity.ToTable("Address");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.HomeAddress)
                    .IsRequired();

                entity.HasOne(e => e.Contact)
                    .WithMany(p => p.Addresses)
                    .HasForeignKey(d => d.ContactId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_Adress_Contact");
            });
            modelbuilder.Entity<Phone>(entity =>
            {
                entity.ToTable("Phone");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.PhoneNumber)
                    .IsRequired();

                entity.HasOne(e => e.Contact)
                    .WithMany(p => p.Phones)
                    .HasForeignKey(d => d.ContactId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_Phones_Contact");
            });

            base.OnModelCreating(modelbuilder);
        }
    }
}
