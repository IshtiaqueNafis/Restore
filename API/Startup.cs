using System.Collections.Generic;
using System.Text;
using API.data;
using API.Middleware;
using API.models;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo {Title = "API", Version = "v1"});

                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "jwt auth header",
                    Name = "Authorization",
                    In = ParameterLocation.Header, // where is it hidden 
                    Type = SecuritySchemeType.ApiKey // what type is it. 
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            },
                            Scheme = "oauth2",
                            Name = "Bearer",
                            In = ParameterLocation.Header,

                        },
                        new List<string>()
                    }
                });
                
            });


            #region *** Configuring Db Context Connecttion for database ***

            services.AddDbContext<StoreContext>(opt =>
                opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));

            #endregion

            services.AddCors(); //add cors 

            #region ***set up identity***

            services.AddIdentityCore<User>(opt =>
                    // 
                {
                    opt.User.RequireUniqueEmail = true; // only speific email is allowed. 
                }).AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<StoreContext>(); // adds identity tables 

            #endregion

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(opt =>
            {
                opt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false, //token matches the issuer(authority) that the API trusts
                    ValidateAudience = false, // claim inside the access token matches the audience parameter.
                    ValidateLifetime = true, // related to expiry date 
                    ValidateIssuerSigningKey = true, // this checks the secert key from the server 
                    IssuerSigningKey =
                        new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(Configuration["JWTSettings:TokenKey"])) // key from the signing key 
                };
            }); // authentication 
            services.AddAuthorization(); // autherization
            services.AddScoped<TokenService>(); // addiangCustom service. 
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ExceptionMiddleWare>();

            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
            }


            app.UseRouting();
            app.UseCors(opt =>
            {
                opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
            });

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }
    }
}