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
            if (String.IsNullOrWhiteSpace(payment.orderID)) throw new ArgumentNullException("Fehler im OrderID!");
            else return new Rückmeldung(payment.orderID, payment.totalAmount > 200);
        }

    }
}
