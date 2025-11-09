namespace PaymentAPI
{
    public class Payment
    {
        public string orderId { get; set; } = string.Empty;
        public string paymentMethod { get; set; } = string.Empty; 
        public decimal totalAmount { get; set; }

    }
}
