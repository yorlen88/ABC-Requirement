using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ABC_Bank_Server.Models;
using System.Text.Json;
using ABC_Bank_Server.Repository;

namespace ABC_Bank_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly AbcBankContext _context;

        private readonly IContactRepository _contactRepository;

        public ContactsController(AbcBankContext context, IContactRepository contactRepository)
        {
            _context = context;
            _contactRepository = contactRepository;
        }

        /// <summary>
        /// Get the list of contacts filtered by the passed parameters.
        /// If no parameters is passed then return all contact's
        /// </summary>
        /// <param name="name">Contact's name</param>
        /// <param name="address">Contact's adress</param>
        /// <param name="ageFrom">Initial age</param>
        /// <param name="ageTo">End age or Top limit age</param>
        /// <returns></returns>
        [HttpGet]

        public async Task<ActionResult<IEnumerable<Contact>>> GetContacts(string? name, string? address, int? ageFrom, int? ageTo)
        {
          if (_context.Contacts == null)
          {
              return NotFound();
          }
          return await _contactRepository.FindContacts(name, address, ageFrom, ageTo);
        }

        // GET: api/Contacts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Contact>> GetContact(int id)
        {
          if (_context.Contacts == null)
          {
              return NotFound();
          }
            var contact = await _context.Contacts.Include(c => c.Addresses).Include(c => c.Phones).FirstOrDefaultAsync(c=>c.Id==id);

            if (contact == null)
            {
                return NotFound();
            }

            return contact;
        }

        // PUT: api/Contacts/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutContact(int id, [FromForm] Contact contact)
        {
            if (id != contact.Id)
            {
                return BadRequest();
            }
            var contactDb  = await _context.Contacts.Include(c => c.Addresses).Include(c => c.Phones).FirstOrDefaultAsync(c => c.Id == id);
            if(contactDb == null)
            {
                return NotFound();
            }

            contact = await _contactRepository.PrepareContact(contact, contactDb);

            contactDb.FirstName = contact.FirstName;
            contactDb.SecondName = contact.SecondName;
            contactDb.Datebirth = contact.Datebirth;
            contactDb.PhotoFileData = contact.PhotoFileData;
            contactDb.PhotoFileName = contact.PhotoFile?.FileName;

            _context.Update(contactDb);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
               throw;
            }

            return NoContent();
        }

        // POST: api/Contacts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Contact>> PostContact([FromForm] Contact contact)
        {
            if (_context.Contacts == null)
            {
                return Problem("Entity set 'AbcBankContext.Contacts'  is null.");
            }
            contact = await _contactRepository.PrepareContact(contact);

            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetContact", new { id = contact.Id }, contact);
        }

        // DELETE: api/Contacts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            if (_context.Contacts == null)
            {
                return NotFound();
            }
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null)
            {
                return NotFound();
            }

            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ContactExists(int id)
        {
            return (_context.Contacts?.Any(e => e.Id == id)).GetValueOrDefault();
        }

    }
}
