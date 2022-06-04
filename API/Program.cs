using System;
using API.data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            using var
                scope = host.Services.CreateScope(); // go out of scope when the program is no longer needed to run. 

            #region ***services ***

            var context = scope.ServiceProvider.GetRequiredService<StoreContext>(); // brings in context. 
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

            #endregion

            try
            {
                context.Database.Migrate(); /// try to migrate database 
                DbIntializer.Initalize(context); // seed database 
            }
            catch (Exception e)
            {
                logger.LogError(e, "problem Migrating data");
            }
           

            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => { webBuilder.UseStartup<Startup>(); });
    }
}