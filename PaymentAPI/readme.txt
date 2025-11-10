Externes PaymentAPI

Quellen angaben:

https://blog.postman.com/what-are-http-methods

https://www.ibm.com/think/topics/rest-apis

ChatGPT Prompt: "How can i get started and understand how web apis work? 
Here is an example of the automatically generated code from rider: var builder = WebApplication.CreateBuilder(args); // Add services to the container. 
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi builder.Services.AddOpenApi(); 
var app = builder.Build(); // Configure the HTTP request pipeline. if (app.Environment.IsDevelopment()) { app.MapOpenApi(); } app.UseHttpsRedirection(); 
var summaries = new[] { "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching" }; 
app.MapGet("/weatherforecast", () => { var forecast = Enumerable.Range(1, 5).Select(index => new WeatherForecast ( DateOnly.FromDateTime(DateTime.Now.AddDays(index)), 
Random.Shared.Next(-20, 55), summaries[Random.Shared.Next(summaries.Length)] )) .ToArray(); 
return forecast; }) .WithName("GetWeatherForecast"); app.Run(); 

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary) { 

public int TemperatureF => 32 + (int)(TemperatureC / 0.5556); }"

Wichtig: NET 8.0 erforderlich

Start:  " dotnet run "