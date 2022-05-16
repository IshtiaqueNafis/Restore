using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.data;
using API.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  // menas api/Products
    public class ProductsController : BaseApiController
    {
        private readonly StoreContext _context;

        public ProductsController(StoreContext context)
        {
            _context = context;
        }

        #region GetProducts() --> method: get returns all products 

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts() =>  await _context.Products.ToListAsync();

        #endregion

        #region GetProducts(int id) ==> method: get, get a single product from database

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
           var product =  await _context.Products.FindAsync(id);
           if(product == null) return NotFound();
           return product;
        }  
            

        #endregion


    }
}