namespace PaymentAPI
{
    /// <summary>
    /// Klasse die eine Rückmeldung zum Zahlungsstatus einer Bestellung repräsentiert.
    /// </summary>
    public class Rückmeldung
    {
        /// <summary>
        /// Die eindeutige Bestellnummer, auf die sich die Rückmeldung bezieht.
        /// </summary>
        public string orderId { get; set; }

        /// <summary>
        /// Status der Zahlung als erfolgreich oder nicht. True oder False.
        /// </summary>
        public bool paymentStatus { get; set; }

        /// <summary>
        /// Erstellt eine neue Instanz der <see cref="Rückmeldung"/> Klasse.
        /// </summary>
        /// <param name="orderid">Die eindeutige Bestellnummer.</param>
        /// <param name="paymentstatus">Der Zahlungsstatus der Bestellung als bool.</param>
        public Rückmeldung(string orderid, bool paymentstatus)
        {
            orderId = orderid;
            paymentStatus = paymentstatus;
        }
    }
}