namespace PaymentAPI
{
    /// <summary>
    /// 
    /// </summary>
    public class Rückmeldung
    {

        public string orderId { get; set;  }

        public bool paymentStatus { get; set; }

        public Rückmeldung(string orderid, bool paymentstatus) 
        
        {
            orderId = orderid;
            paymentStatus = paymentstatus;
        }
    }
}
