namespace PaymentAPI
{
    public class Payment
    {
        public string orderID { get; set; } = string.Empty;
        public string zahlungsMethode { get; set; } = string.Empty; 
        public decimal totalAmount { get; set; }

    }
}
