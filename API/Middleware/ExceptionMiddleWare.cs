using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API.Middleware
{
    public class ExceptionMiddleWare
    {
        private readonly RequestDelegate _next; // handles the request moves to next piece of middleware 
        private readonly ILogger<ExceptionMiddleWare> _logger; // write a log message class of exception middleware is passed here ,I logger matches class type. 
        private readonly IHostEnvironment _env; // Compares the current host environment name against the specified value

        public ExceptionMiddleWare(RequestDelegate next, ILogger<ExceptionMiddleWare> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;

            #region constructor explained 

/*
 * RequestDelegate next,ILogger<ExceptionMiddleWare> logger,IHostEnvironment env
 * RequestDelegate next --> moves to next piece of middleware
 * ILogger<ExceptionMiddleWare> logger --> must match with exceptionmiddleware
 * IHostEnvironment env --> are we running on exception or envrionemtn. 
 */

            #endregion
        }

        public async Task InvokeAsync(HttpContext context) // task will allow async operations 
        {
            try
            {
                await _next(context); //  information about a single HTTP request
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message); // logs if there is any error 
                context.Response.ContentType = "application/json";  // http code 
                context.Response.StatusCode = 400; // http response 
                var response = new ProblemDetails  // used to standardize error
                {
                    Status = 500,
                    Detail = _env.IsDevelopment() ? e.StackTrace?.ToString() : null,
                    Title = e.Message
                };
                var json = JsonSerializer.Serialize(response); // make json swrons object. 
                await context.Response.WriteAsync(json); // write the response in json format 
            }
        }
    }
}