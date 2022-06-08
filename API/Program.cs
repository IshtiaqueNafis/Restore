using System;
using System.Threading.Tasks;
using API.data;
using API.models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            using var
                scope = host.Services.CreateScope(); // go out of scope when the program is no longer needed to run. 

            #region ***services ***

            var context = scope.ServiceProvider.GetRequiredService<StoreContext>(); // brings in context. 
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>(); // brings in context. 
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

            #endregion

            try
            {
                await context.Database.MigrateAsync(); /// try to migrate database 
                await DbIntializer.Initalize(context, userManager); // seed database 
            }
            catch (Exception e)
            {
                logger.LogError(e, "problem Migrating data");
            }


          await  host.RunAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => { webBuilder.UseStartup<Startup>(); });
    }
}