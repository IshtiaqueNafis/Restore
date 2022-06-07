using System.Text.Json;
using API.RequestHelpers;
using Microsoft.AspNetCore.Http;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, MetaData metaData)
        {
            var options = new JsonSerializerOptions {PropertyNamingPolicy = JsonNamingPolicy.CamelCase}; // this makes it like pageNumber
            response.Headers.Add("Pagination", JsonSerializer.Serialize(metaData, options)); //pass the meta deta and then options here. 
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination"); // this makes it avialble on clients. 
        }
    }
}