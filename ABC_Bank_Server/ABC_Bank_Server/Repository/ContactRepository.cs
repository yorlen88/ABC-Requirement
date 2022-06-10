using ABC_Bank_Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace ABC_Bank_Server.Repository
{
    public class ContactRepository : IContactRepository
    {
        private readonly AbcBankContext _context;

        public ContactRepository(AbcBankContext context)
        {
            _context = context;
        }

        public async Task<List<Contact>> FindContacts(string? name, string? address, int? ageFrom, int? ageTo)
        {
            var query = _context.Contacts.Include(c => c.Addresses).Include(c => c.Phones).AsQueryable();
            if (!string.IsNullOrEmpty(name))
            {
                query = query.Where(c => c.FirstName.ToLower().Contains(name.ToLower()));
            }
            if (!string.IsNullOrEmpty(address))
            {
                query = query.Where(c => c.Addresses.Any(a => a.HomeAddress.ToLower().Contains(address.ToLower())));
            }
            if (ageFrom.HasValue && ageTo.HasValue)
            {
                if (ageFrom > ageTo)
                {
                    throw new BadHttpRequestException("Incorrect Age range.");
                }
                var dateFrom = Convert.ToDateTime(DateTime.Now.AddYears(-1 * ageFrom.Value - 1).Year.ToString() + "/12/31");
                var dateTo = Convert.ToDateTime(DateTime.Now.AddYears(-1 * ageTo.Value - 1).Year.ToString() + "/01/01");
                query = query.Where(c => c.Datebirth >= dateTo && c.Datebirth <= dateFrom);
            }
            else
            {
                if (ageFrom.HasValue)
                {
                    var dateFrom = Convert.ToDateTime(DateTime.Now.AddYears(-1 * ageFrom.Value - 1).Year.ToString() + "/12/31");
                    query = query.Where(c => c.Datebirth <= dateFrom);
                }
                if (ageTo.HasValue)
                {
                    var dateTo = Convert.ToDateTime(DateTime.Now.AddYears(-1 * ageTo.Value - 1).Year.ToString() + "/01/01");
                    query = query.Where(c => c.Datebirth >= dateTo);
                }
            }
            return await query.ToListAsync();
        }

        public async Task<Contact> PrepareContact(Contact contact, Contact contactDb = null)
        {
            if (contact.PhotoFile != null)
            {
                using var memoryStream = new MemoryStream();

                await contact.PhotoFile.CopyToAsync(memoryStream);

                contact.PhotoFileData = memoryStream.ToArray();
                contact.PhotoFileName = contact.PhotoFile.FileName;
            }

            if (!string.IsNullOrEmpty(contact.AddressesJson))
            {
                contact.Addresses = JsonSerializer.Deserialize<List<Address>>(contact.AddressesJson);
                if(contactDb != null)
                {
                    UpdateAdress(contactDb.Addresses, contact.Addresses);
                }
            }
            if (!string.IsNullOrEmpty(contact.PhonesJson))
            {
                contact.Phones = JsonSerializer.Deserialize<List<Phone>>(contact.PhonesJson);
                if (contactDb != null)
                {
                    UpdatePhones(contactDb.Phones, contact.Phones);
                }
            }
            return contact;
        }
        /// <summary>
        /// <In
        /// </summary>
        /// <param name="addressesDb"></param>
        /// <param name="addresses"></param>
        public void UpdateAdress(ICollection<Address>? addressesDb, ICollection<Address>? addresses)
        {

            var addressesToAdd = addresses.Where(p => !addressesDb.Select(db => db.Id).Contains(p.Id)).ToList();
            var addressesToRemove = addressesDb.Where(p => !addresses.Select(db => db.Id).Contains(p.Id)).ToList();
            var addressesToUpdate = addressesDb.Where(p => addresses.Any(db => db.Id == p.Id && db.HomeAddress != p.HomeAddress)).ToList();

            foreach (var address in addressesToUpdate)
            {
                address.HomeAddress = addresses.Where(p => p.Id == address.Id).Select(p => p.HomeAddress).FirstOrDefault();
            }
            _context.Address.AddRange(addressesToAdd);
            _context.Address.RemoveRange(addressesToRemove);
            _context.Address.UpdateRange(addressesToUpdate);
        }

        public void UpdatePhones(ICollection<Phone>? phonesDb, ICollection<Phone>? phones)
        {
            var phonesToAdd = phones.Where(p => !phonesDb.Select(db => db.Id).Contains(p.Id)).ToList();
            var phonesToRemove = phonesDb.Where(p => !phones.Select(db => db.Id).Contains(p.Id)).ToList();
            var phonesToUpdate = phonesDb.Where(p => phones.Any(db => db.Id == p.Id && db.PhoneNumber != p.PhoneNumber)).ToList();

            foreach(var phone in phonesToUpdate)
            {
                phone.PhoneNumber = phones.Where(p=>p.Id ==phone.Id).Select(p => p.PhoneNumber).FirstOrDefault();
            }

            _context.Phones.AddRange(phonesToAdd);
            _context.Phones.RemoveRange(phonesToRemove);
            _context.Phones.UpdateRange(phonesToUpdate);
        }
    }
}
