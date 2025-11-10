namespace PaymentAPI
{
    /// <summary>
    /// Klasse zur repräsentation einer Bestellung.
    /// </summary>
    public class Payment
    {
        /// <summary>
        /// Die eindeutige Bestellnummer, zu der die Zahlung gehört. Standardmäßig Leer.
        /// </summary>
        public string orderId { get; set; } = string.Empty;

        /// <summary>
        /// Die verwendete Zahlungsmethode, zum Beispiel "SEPA", "Karte", "Bar" als string-wert gespeichert.
        /// </summary>
        public string paymentMethod { get; set; } = string.Empty;

        /// <summary>
        /// Der Gesamtbetrag der Bestellung.
        /// </summary>
        public decimal totalAmount { get; set; }
    }
}
