namespace PaymentAPI;

public record PaymentRückmeldung(string id, bool erfolgreich)
{
    public string Id => id;
    public bool Erfolgreich => Erfolgreich;
}