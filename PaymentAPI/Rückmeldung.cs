namespace PaymentAPI
{
    public class Rückmeldung
    {

        public string orderId { get; set;  }

        public bool zahlungErfolgreich { get; set; }

        public Rückmeldung(string orderid, bool zahlungerfolgreich) 
        
        {
            orderId = orderid;
            zahlungErfolgreich = zahlungerfolgreich;
        }
    }
}
