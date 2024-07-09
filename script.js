// CREATING VARIABLESSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS

let dropList = document.querySelectorAll('form select');
let fromCurrency = document.querySelector('.from select');
let toCurrency = document.querySelector('.to select');
let icon = document.querySelector('.icon');
let exchangeTxt = document.querySelector('.exchange_rate');
let getBtn = document.querySelector('button');

// ADDING OPTIONS TO SELECT TAGGGGGGGGGGGGGGGGGGGGGGGGGGGG
for (let i = 0; i < dropList.length; i++) {
    for (let currencyCode in country_list) {
        let selected =
            i == 0 ? currencyCode == 'USD'
                ? 'selected'
                : '' : currencyCode == 'PKR'
                ? 'selected'
                : '';

        let optionTag = `<option value="${currencyCode}" ${selected}>
        ${currencyCode}</option>`;
        dropList[i].insertAdjacentHTML('beforeend', optionTag);
    }

    dropList[i].addEventListener('change', (e) => {
        loadFlag(e.target);
    })
}

// This function is responsible for loading the flag image of the selected currency.
// It does this by iterating over the keys of the country_list object.
// For each key, it checks if the value of the key matches the value of the selected currency.
// If there is a match, it finds the img tag within the parent element of the select element and sets its src attribute to the URL of the flag image.

// The URL of the flag image is constructed using the country code from the country_list object and the value of the selected currency.
// The country code is converted to lowercase and appended to the base URL of the flag image, which is "https://flagcdn.com/48x36/".

// The img tag is then updated with the new src attribute value.

function loadFlag(element) {
    // Iterate over the keys of the country_list object
    for (let code in country_list) {
        // Check if the value of the key matches the value of the selected currency
        if (code == element.value) {
            // Find the img tag within the parent element of the select element
            let imgTag = element.parentElement.querySelector('img');
            // Set the src attribute of the img tag to the URL of the flag image
            imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
        }
    }
}
getBtn.addEventListener('click', (e) => {
    e.preventDefault();
    getExchangeValue();
})



// FETCHING EXCHANGE RATE WITH API --------------------------------------
// This function is responsible for fetching the exchange rate of the selected currencies from an API.
// It does this by constructing a URL with the API endpoint and the selected currencies.
// The API endpoint is "https://v6.exchangerate-api.com/v6/f786e1dd8bf61686d21aa355/latest/<currency_code>".
// The <currency_code> is replaced with the value of the "fromCurrency" select element.
// The fetch API is used to send a request to the constructed URL and retrieve the response.
// The response is then parsed as JSON using the json() method.
// The exchange rate of the selected currencies is retrieved from the response and used to calculate the total amount.
// The total amount is formatted to 2 decimal places and displayed in the "exchange_rate" element.
// If there is an error fetching the exchange rate, an error message is displayed.

function getExchangeValue() {
    // Get the value of the amount input element
    const amount = document.querySelector('form input');
    let amountVal = amount.value;
    // If the amount input is empty or has a value of '0', set it to '1'
    if (amountVal == '' || amountVal == '0') {
        amount.value = '1';
        amountVal = 1;
    }
    // Display the exchange rate text
    exchangeTxt.innerText = 'Exchanging rate...';
    // Construct the URL with the API endpoint and the selected currencies
    let url = `https://v6.exchangerate-api.com/v6/f786e1dd8bf61686d21aa355/latest/${fromCurrency.value}`;
    // Send a request to the constructed URL and retrieve the response
    fetch(url).then(response => response.json())
        .then(result => {
            // Get the exchange rate of the selected currencies
            let exchangeRate = result.conversion_rates[toCurrency.value];
            // Calculate the total amount by multiplying the amount input by the exchange rate
            let total = (amountVal * exchangeRate).toFixed(2);
            // Display the total amount
            exchangeTxt.innerText = `${amountVal} ${fromCurrency.value} = ${total} ${toCurrency.value}`;
        }).catch(() => {
            // If there is an error fetching the exchange rate, display an error message
            exchangeTxt.innerText = 'Error fetching exchange rate!';
        })
}


window.addEventListener('load', () => {
    getExchangeValue();
});


// CURRENCY FLAG ----------------------------------------------------
icon.addEventListener('click', () => {
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeValue();
})