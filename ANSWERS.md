# Answers: Billing form questions

The screen is a mock-up, so I split my answer to (a) into two parts: problems I can see in the design, and things the design doesn't show, written as questions for the team.

## a. Problems with this screen

### What I see in the design

**High**

1. **[Security] No CVV field.** Online card payments usually ask for it. Without it, there is more fraud risk and the payment may be declined.
2. **[Functional] No Country field.** The form seems to assume every customer is from the US.
3. **[Functional] "State or Province" is required.** Countries like Israel have no states, so these users can't finish the form.
4. **[Functional] "Postal Code" is required and says "no dashes".** This looks built for US zip codes. UK postal codes have letters and a space, and some countries have no postal code at all.

**Medium**

5. **[Usability] No currency next to "30.00".** A user from another country doesn't know if it's dollars, euros or something else.
6. **[Usability] Card Type is chosen by hand, and VISA seems to be selected by default.** The type can be found from the first digits of the number. A wrong type may fail the payment.
7. **[Usability] "No dashes or spaces" makes the user do the work.** People often type or paste the number with spaces. The form should clean it by itself.
8. **[Usability] The title says "Account Information", but this is a payment screen.** Also, the user doesn't see what they are paying for, only the amount.
9. **[Usability] In Expiration, the star is only next to Year.** If Month is really optional, the user can send the form without it, and the payment will fail.

**Low**

10. **[Usability] The second address line has no label.** It's not clear what to write there.
11. **[Usability] "MI" (middle initial) is an American thing.** Users from other countries may not understand it.
12. **[Security] Nothing shows that the payment is secure** (lock icon, card logos, payment provider name).

### Questions for the team (not shown in the design)

13. **[Security] How is card data handled?** Only HTTPS and POST, never in the URL? Is the full number saved anywhere?
14. **[Functional] What happens on a double click on Continue?** Can the card be charged twice?
15. **[Usability] What does the user see on errors?** Wrong field or declined card.
16. **[Functional] What are the validation rules?** Expired dates, card number check (Luhn), allowed characters, max length.
17. **[Performance] What happens if the payment is slow?** How long until a timeout? Does the user see a loading state, or can they think it's stuck and click again? Does the page still work well on a slow mobile connection?

## b. Sample test cases

**TC-01: Successful payment**
- Preconditions: Test environment, payment screen open.
- Steps: Fill all required fields with valid data (test card 4111111111111111, future expiration date). Click Continue.
- Expected: Payment approved. Confirmation shows the amount and only the last 4 digits. Card charged once.
- Automation: Yes, main flow.

**TC-02: Expired card is rejected**
- Preconditions: Test environment, payment screen open.
- Steps: Fill all fields with valid data, but choose an expiration date in the past. Click Continue.
- Expected: Payment not sent. Clear error next to Expiration. Other fields keep their data.
- Automation: Yes, simple validation check.

**TC-03: Double click on Continue**
- Preconditions: Test environment, payment screen open.
- Steps: Fill all fields with valid data. Click Continue twice quickly.
- Expected: Button disabled after the first click. Only one payment created.
- Automation: Yes, but I would check on the API side that only one payment exists. Double clicks in UI tests can be flaky.

## c. Solution for the most severe bug

**The bug:** The form is built for US customers. No Country field, and State and Postal Code are required. A global company loses customers who simply can't pay.

**Solution:**
1. Add a Country field, filled automatically when possible.
2. Show the address fields based on the country: State only where it exists, Postal Code optional where there is none, and the right format for each country.
3. Show the currency next to the amount.

**Quick fix for now:** Add Country, and make State and Postal Code optional outside the US.
