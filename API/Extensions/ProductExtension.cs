using System.Collections.Generic;
using System.Linq;
using API.models;

namespace API.Extensions
{
    public static class ProductExtensions // will extend functionalty. 
    {
        #region ***static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy) *** orders product

        public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)

            #region *** IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)*** explained

/*IQueryable -->An IQueryable is not actually a collection of entities, rather it describes how to obtain that collection
 * this IQueryable<Product> query, --> this extends the functuonality so it can be used
 */

            #endregion

        {
            if (string.IsNullOrWhiteSpace(orderBy))
            {
                return query.OrderBy(p => p.Name);
            }

            query = orderBy switch
            {
                "price" => query.OrderBy(p => p.Price),
                "priceDesc" => query.OrderByDescending(p => p.Price),
                _ => query.OrderBy(p => p.Name)
            };
            return query;
        }

        #endregion

        #region ***IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)*** --> returns a list of product based on search

        public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm))
            {
                return query; // this means only the original will reutrn
            }

            var lowerCaseSearchTerm = searchTerm.Trim().ToLower(); // lowers the search term case 

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
                brandList.Count == 0 ||
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