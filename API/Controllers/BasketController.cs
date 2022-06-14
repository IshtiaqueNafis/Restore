using System;
using System.Linq;
using System.Threading.Tasks;
using API.data;
using API.DTO;
using API.Extensions;
using API.models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;

        public BasketController(StoreContext context)
        {
            _context = context;
        }


        #region ***Task<ActionResult<Basket>> GetBasket()***--->get Baskets-->method:get().

        [HttpGet(Name = "GetBasket")] // rename to GetBasket
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            Basket basket = await RetrievedBasket(GetBuyerId());
            if (basket == null) return NotFound();
            return basket.MapBasketToDto();
        }

        #endregion

        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            var basket = await RetrievedBasket(GetBuyerId()) ?? CreateBasket();
            // terrinary if there is a basket retive it. if not create a new one. 

            // ReSharper disable once HeapView.BoxingAllocation
            Product product = await _context.Products.FindAsync(productId);
            if (product == null) return BadRequest(new ProblemDetails {Title = "Product not found"});
            basket.AddItem(product, quantity);
            bool result = await _context.SaveChangesAsync() > 0;
            if (result)
                return CreatedAtRoute("GetBasket",
                    basket.MapBasketToDto()); // shows new basket being created with created at Route. 

            return BadRequest(new ProblemDetails {Title = "problem saving"});
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveItemFromBasket(int productId, int quantity)
        {
            var basket = await RetrievedBasket(GetBuyerId());
            if (basket == null) return NotFound();
            basket.RemoveItem(productId, quantity);


            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok();

            return BadRequest(new ProblemDetails {Title = "problem removing product"});
        }

        #region ***Task<ActionResult<Basket>> RetriveBasket(string buyerid) ---> retrive baskets***

        private async Task<Basket> RetrievedBasket(string buyerId)
            // no actionresults here since this is a normal method. 
        {
            if (string.IsNullOrEmpty(buyerId))
            {
                Response.Cookies.Delete("buyerId"); // no buyer id delete it. 
                return null;
            }

            return await _context.Baskets.Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
        }

        #endregion

        #region ***CreateBasket()*** -->creates a basket if there is no empty basket

        private Basket CreateBasket()
        {
            #region ***creating buyer id ***

            string buyerId = User.Identity?.Name; // get tthe name from identityy.
            if (string.IsNullOrEmpty(buyerId))
            {
                buyerId = Guid.NewGuid().ToString();
                CookieOptions cookieOptions = new CookieOptions
                    {IsEssential = true, Expires = DateTime.Now.AddDays(30)};
                Response.Cookies.Append("buyerId", buyerId, cookieOptions); // adds to server 
            }

            #endregion

            Basket basket = new Basket {BuyerId = buyerId};
            _context.Baskets.Add(basket);
            return basket;
        }

        #endregion


        private string GetBuyerId() =>
            User.Identity?.Name ?? Request.Cookies["buyerId"]; //get the id for username or buyer id. 
    }
}