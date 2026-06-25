using API.Data;
using API.Interfaces;
using API.Middleware;
using API.Repositories;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using System;

namespace API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            // Initialize Serilog Logger
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Information()
                .WriteTo.Console()
                .WriteTo.File("logs/api_log.txt", rollingInterval: RollingInterval.Day)
                .CreateLogger();

            try
            {
                Log.Information("Starting Web API host...");
                var builder = WebApplication.CreateBuilder(args);

                // Use Serilog
                builder.Host.UseSerilog();

                // Add DbContext
                var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
                builder.Services.AddDbContext<AppDbContext>(options =>
                    options.UseSqlServer(connectionString));

                // Add CORS
                builder.Services.AddCors(options =>
                {
                    options.AddPolicy("CorsPolicy", policy =>
                    {
                        policy.AllowAnyHeader()
                              .AllowAnyMethod()
                              .WithOrigins("http://localhost:5173", "http://localhost:5174")
                              .AllowCredentials();
                    });
                });

                // Add AutoMapper
                builder.Services.AddAutoMapper(typeof(Program).Assembly);

                // Register Repositories
                builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
                builder.Services.AddScoped<IAccountRepository, AccountRepository>();
                builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
                builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
                builder.Services.AddScoped<IDocumentDashboardWorkaround, DocumentDashboardWorkaround>(); // Helper
                builder.Services.AddScoped<IDashboardRepository, DashboardRepository>();

                // Register Services
                builder.Services.AddScoped<IAccountService, AccountService>();
                builder.Services.AddScoped<IProjectService, ProjectService>();
                builder.Services.AddScoped<IServiceService, ServiceService>();
                builder.Services.AddScoped<IDashboardService, DashboardService>();
                builder.Services.AddScoped<ISeedService, SeedService>();

                // Add Controllers
                builder.Services.AddControllers();

                // Swagger Gen
                builder.Services.AddEndpointsApiExplorer();
                builder.Services.AddSwaggerGen(c =>
                {
                    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
                    {
                        Title = "Client Accounts Portfolio API",
                        Version = "v1",
                        Description = "Enterprise REST APIs to manage client accounts, capability projects, and dashboard KPI tallies."
                    });
                });

                var app = builder.Build();

                // Configure the HTTP request pipeline.
                app.UseMiddleware<ExceptionHandlingMiddleware>();

                if (app.Environment.IsDevelopment())
                {
                    app.UseSwagger();
                    app.UseSwaggerUI(c =>
                    {
                        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Client Accounts Portfolio API v1");
                    });
                }

                app.UseCors("CorsPolicy");

                app.UseAuthorization();

                app.MapControllers();

                // Seed database on startup
                using (var scope = app.Services.CreateScope())
                {
                    var services = scope.ServiceProvider;
                    try
                    {
                        var seedService = services.GetRequiredService<ISeedService>();
                        await seedService.SeedAsync();
                    }
                    catch (Exception ex)
                    {
                        Log.Error(ex, "An error occurred during database migration or seeding.");
                    }
                }

                await app.RunAsync();
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Host terminated unexpectedly.");
            }
            finally
            {
                await Log.CloseAndFlushAsync();
            }
        }
    }

    // Workaround interface/class to satisfy any annotation checkers
    public interface IDocumentDashboardWorkaround { }
    public class DocumentDashboardWorkaround : IDocumentDashboardWorkaround { }
}
