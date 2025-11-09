using Microsoft.AspNetCore.Mvc;

namespace PaymentAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PaymentServiceController : ControllerBase
    {

        private readonly ILogger<PaymentServiceController> _logger;

        public PaymentServiceController(ILogger<PaymentServiceController> logger)
        {
            _logger = logger;
        }

        [HttpPost(Name = "Payment Status")]
        public Rückmeldung Post(Payment payment)
        {
            if (String.IsNullOrWhiteSpace(payment.orderId))
            {
                _logger.LogWarning("Received payment with missing orderId.", payment);
                throw new ArgumentNullException("Fehler im OrderID!");
            }
            else
            {
            _logger.LogInformation($"Processed {payment.paymentMethod} payment for OrderId: {payment.orderId}. Amount: {payment.totalAmount}.");
            return new Rückmeldung(payment.orderId, payment.totalAmount > 200);
            } 
        }

    }
}
