using Microsoft.AspNetCore.Mvc;
using PaymentAPI;
using System.Text.Json;

namespace PaymentAPI.Controllers
{
    /// <summary>
    /// Stellt Endpunkte zur Verarbeitung von Zahlungen bereit.
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    public class PaymentServiceController : ControllerBase
    {
        private readonly ILogger<PaymentServiceController> _logger;
        private readonly IMessageDispatcher _messageDispatcher;

        /// <summary>
        /// Erstellt eine neue Instanz des <see cref="PaymentServiceController"/>.
        /// </summary>
        /// <param name="logger">Der Logger für Diagnose- und Statusmeldungen.</param>
        /// <param name="messageDispatcher">Der Dienst zum Weiterleiten von Zahlungsinformationen.</param>
        public PaymentServiceController(
            ILogger<PaymentServiceController> logger,
            IMessageDispatcher messageDispatcher)
        {
            _logger = logger;
            _messageDispatcher = messageDispatcher;
        }

        /// <summary>
        /// Verarbeitet eine eingehende Zahlung und gibt eine Rückmeldung über den Zahlungsstatus zurück.
        /// </summary>
        /// <param name="payment">Die zu verarbeitenden Zahlungsdaten.</param>
        /// <returns>Eine <see cref="Rückmeldung"/> über den Status der Zahlung.</returns>
        /// <exception cref="ArgumentNullException">
        /// Wird ausgelöst, wenn die <see cref="Payment.orderId" fehlt oder ungültig ist.
        /// </exception>
        [HttpPost(Name = "Payment Processing")]
        public Rückmeldung Post(Payment payment)
        {
            if (string.IsNullOrWhiteSpace(payment.orderId))
            {
                _logger.LogWarning("Received payment with missing orderId.", payment);
                throw new ArgumentNullException(nameof(payment.orderId), "Incorrect OrderId!");
            }
            else
            {
                _logger.LogInformation(
                    $"Processed {payment.paymentMethod} payment for OrderId: {payment.orderId}. Amount: {payment.totalAmount}.");

                _messageDispatcher.Message(payment);

                return new Rückmeldung(payment.orderId, payment.totalAmount > 200);
            }
        }
    }

    /// <summary>
    /// Definiert einen Dienst zum Weiterleiten oder Verarbeiten von Zahlungsinformationen.
    /// </summary>
    public interface IMessageDispatcher
    {
        /// <summary>
        /// Der Dienst zum weiterleiten einer Nachricht.
        /// </summary>
        /// <param name="payment">Die zu versendenden Zahlungsdaten.</param>
        void Message(Payment payment);
    }

    /// <summary>
    /// Implementiert einen Nachrichten-Dispatcher, der Zahlungslogs per HTTP-POST an dem Logging-Service sendet.
    /// </summary>
    public class HttpLogDispatcher : IMessageDispatcher
    {
        private readonly HttpClient _client;
        private readonly ILogger<HttpLogDispatcher> _logger;

        /// <summary>
        /// Erstellt eine neue Instanz von <see cref="HttpLogDispatcher"/>.
        /// </summary>
        /// <param name="client">Der verwendete <see cref="HttpClient"/> für das Senden der Logdaten.</param>
        /// <param name="logger">Der Logger für Informationen und Fehler.</param>
        public HttpLogDispatcher(HttpClient client, ILogger<HttpLogDispatcher> logger)
        {
            _client = client;
            _logger = logger;
        }

        /// <summary>
        /// Sendet die Zahlungsdaten als Logeintrag an dem LoggingService.
        /// </summary>
        /// <param name="payment"> Die Zahlungsdaten, die als Logeintrag versendet werden sollen. </param>
        /// <remarks>
        /// Die Methode erstellt ein LogObjekt aus den Zahlungsdaten und
        /// übermittelt dieses per HTTP POST. Fehler beim Versand werden geloggt.
        /// </remarks>
        /// <exception cref="System.Exception">
        /// Wird geloggt, falls der Versand des Logeintrags fehlschlägt.
        /// </exception>
        public async void Message(Payment payment)
        {
            try
            {
                var logEntry = new { Message = $"[PaymentAPI] [{payment.orderId}] PaymentMethod: {payment.paymentMethod}, TotalAmount: {payment.totalAmount}, PaymentStatus: {((payment.totalAmount > 200) ? "Payment successful" : "Payment failed")}, at: {DateTime.UtcNow}" };

                var options = new JsonSerializerOptions { PropertyNamingPolicy = null };
                var response = await _client.PostAsJsonAsync("/log", logEntry, options);

                _logger.LogInformation($"Sent payment log. Status: {response.StatusCode}");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    $"Failed to dispatch payment log for orderId {payment.orderId}",
                    payment.orderId);
            }
        }
    }
}