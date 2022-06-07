using System.Collections.Generic;
using System.Linq;
using API.models;

namespace API.Extensions
{
    public static class ProductExtensions // will extend functionalty of the product class extension methods are static in their nature. 
    {
        #region ***static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy) *** sort product using linq order

        public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)

            #region *** IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)*** explained

/*IQueryable -->An IQueryable is not actually a collection of entities, rather it describes how to obtain that collection
 * this IQueryable<Product> query, --> this extends the functuonality so it can be used
 */

            #endregion

        {
            if (string.IsNullOrWhiteSpace(orderBy)) // check if it is null or white space do orderby. 
            {
                return query.OrderBy(p => p.Name);
            }

            query = orderBy switch
            {
                "price" => query.OrderBy(p => p.Price), // when price is passed 
                "priceDesc" => query.OrderByDescending(p => p.Price), // when priceDesc passed 
                _ => query.OrderBy(p => p.Name)
            };
            return query;
        }

        #endregion
        
        

        #region ***IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)*** --> returns a list of product based on search using linq where

        public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm))
            {
                return query; // this means only the original will reutrn
            }

            var lowerCaseSearchTerm = searchTerm.Trim().ToLower(); // lowers the search term case and get rid of white space 

            return query.Where(p => p.Name.ToLower().Contains(lowerCaseSearchTerm));
        }

        #endregion

        #region ***IQueryable<Product> Filter(this IQueryable<Product> query, string brands, string types)***

        public static IQueryable<Product> Filter(this IQueryable<Product> query, string brands, string types)
        {
            // will holdstring here 
            var brandList = new List<string>();
            var typeList = new List<string>();

            //making list out of quieries
            if (!string.IsNullOrEmpty(brands))
            {
                brandList.AddRange(brands.ToLower().Split(",").ToList()); 
            }

            if (!string.IsNullOrEmpty(types))
            {
                typeList.AddRange(types.ToLower().Split(",").ToList());
            }
//check for brandlist 
            query = query.Where(p =>
                brandList.Count == 0 || // this is same as if and else statment
                brandList.Contains(p.Brand.ToLower())); // if its 0 do not anything if its not return ir 
//check for type list         
            query = query.Where(p =>
                typeList.Count == 0 ||
                typeList.Contains(p.Type.ToLower()));
            return query;
        }

        #endregion
    }
}