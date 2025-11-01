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

app.MapPost("/payment", (Payment payment, Rückmeldung rückmeldung) => //eher fokus auf wert, also >200 = fail
{
    if(payment.totalAmount>x) //Simulation ob erfolgreiche Zahlung oder nicht
{
return new Rückmeldung(payment.orderID, true) 
}
else
{
new Rückmeldung(payment.orderID, false) 
}
});

app.Run();

public record Payment(string orderId, decimal totalAmount);
public record Rückmeldung(string orderID, bool zahlungErfolgreich);



