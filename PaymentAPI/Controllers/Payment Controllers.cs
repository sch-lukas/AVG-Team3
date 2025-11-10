using Microsoft.AspNetCore.Mvc;
using PaymentAPI;

namespace PaymentAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]

    public class PaymentServiceController : ControllerBase
    {

        private readonly ILogger<PaymentServiceController> _logger;
        private readonly IMessageDispatcher _messageDispatcher;
        public PaymentServiceController(ILogger<PaymentServiceController> logger, IMessageDispatcher messageDispatcher)
        {
            _logger = logger;
            _messageDispatcher = messageDispatcher;
        }

        [HttpPost(Name = "Payment Processing")]
        public Rückmeldung Post(Payment payment)
        {
            if (String.IsNullOrWhiteSpace(payment.orderId))
            {
                _logger.LogWarning("Received payment with missing orderId.", payment);
                throw new ArgumentNullException(nameof(payment.orderId), "Incorrect OrderId!");
            }
            else
            {
                _logger.LogInformation($"Processed {payment.paymentMethod} payment for OrderId: {payment.orderId}. Amount: {payment.totalAmount}.");
                _messageDispatcher.Message(payment);
                return new Rückmeldung(payment.orderId, payment.totalAmount > 200);
            } 
        }

    }
}
public interface IMessageDispatcher
{
    void Message(Payment payment);
}
public class HttpLogDispatcher : IMessageDispatcher
{
    private readonly HttpClient _client;
    private readonly ILogger<HttpLogDispatcher> _logger;

    public HttpLogDispatcher(HttpClient client, ILogger<HttpLogDispatcher> logger)
    {
        _client = client;
        _logger = logger;
    }

    public async void Message(Payment payment)
    {
        try {
            var logEntry = new
            {
                Service = "PaymentAPI",
                orderId = payment.orderId,
                paymentMethod = payment.paymentMethod,
                amount = payment.totalAmount,
                paymentStatus = payment.totalAmount > 200 ? "Payment succesful" : "Payment failed",
                timestamp = DateTime.UtcNow
            };

            var response = await _client.PostAsJsonAsync("/log", logEntry);

            _logger.LogInformation($"Sent payment log. Status: {response.StatusCode}");
        }
        catch(Exception ex )
        {

            _logger.LogError(ex, $"Failed to dispatch payment log for orderId {payment.orderId}", payment.orderId);
        }
        }

}

