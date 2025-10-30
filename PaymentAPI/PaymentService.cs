using PaymentAPI;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapPost("/payment", (PaymentWeiterleitung weiterleitung, Payment payment) =>
{
    PaymentRückmeldung rückmeldung = weiterleitung.ExternerService(payment);
    return rückmeldung;
});
    

app.Run();

public record Payment(string Id, string Währung, decimal Wert, string Zahlungsmethode);



