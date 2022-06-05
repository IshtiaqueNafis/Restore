using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.data;
using API.Extensions;
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

        #region GetProducts() --> method: get returns all products : functionType:Task<ActionResult<List<Product>>>

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts(string orderBy,
            string searchTerm)
        {
            var query = _context.Products
                .Sort(orderBy) // sort is from the productextension static classs
                .Search(searchTerm)
                .AsQueryable(); // queryable so it can be quie


            return await query.ToListAsync();
        }

        #endregion

        #region GetProducts(int id) ==> method: get, get a single product from database

        [HttpGet("{id}")] // this is the route that the this parameter accepts. 
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            return product;
        }

        #endregion
    }
}