using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.data;
using API.Extensions;
using API.models;
using API.RequestHelpers;
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

        #region Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery] ProductParams productParams) --> returns productlist with product inside

        [HttpGet]
        public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery] ProductParams productParams)
            // From Quey allows object o be passed
        {
            var query = _context.Products
                .Sort(productParams.OrderBy) // sort is from the productextension static classs
                .Search(productParams.SearchTerm)
                .Filter(productParams.Brands, productParams.Types)
                .AsQueryable(); // queryable so it can be delayed. this wont call 


            var products =
                await PagedList<Product>.ToPagedList(
                    query, productParams.PageNumber, productParams.PageSize);
            Response.AddPaginationHeader(products.MetaData);
            return products;
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

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();

            var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();
            return Ok(new {brands, types});
        }
    }
}