using System.Runtime.CompilerServices;

namespace PaymentAPI;

/// <summary>
/// 
/// </summary>
public abstract class PaymentWeiterleitung
{
    public PaymentRückmeldung ExternerService (Payment Payment)
    {
        var random = new Random();
        var Erfolgreich = random.Next(2) == 1;
        return new PaymentRückmeldung(Payment.Id, Erfolgreich);
    }
}