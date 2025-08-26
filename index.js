fetch('/data')
	.then(response => response.json())
	.then(currencyData => {
		localStorage.setItem('currencyData', JSON.stringify(currencyData));
		console.log('Currency Data:', currencyData);
	})
	.catch(error => {
		console.error('Error fetching currency data:', error);
	});

let storedCurrencyData = JSON.parse(localStorage.getItem('currencyData'));

function formatDate(date) {
	date = String(date).trim();
	if (!date) return '';
	const [day, month, year] = date.split('-'); // Change order to match dataset format
	return `${year}.${month}.${day}`;
}

function plotCurrencyData(currencyData, currency1, currency2, startDateIndex, endDateIndex) {
	const ctx = document.getElementById('currencyChart').getContext('2d');

	console.log(`Accessing currency data for: ${currency1.toLowerCase()} and ${currency2.toLowerCase()}`);
	// console.log(currencyData);

	if (!currencyData[currency1.toLowerCase()] || !currencyData[currency2.toLowerCase()]) {
		console.error(`One of the selected currencies is not available in the dataset.`);
		alert(`Data for selected currencies is not available.`);
		return;
	}

	const filteredData = {
		date: currencyData.date.slice(endDateIndex, startDateIndex + 1).reverse(),
		currency1: currencyData[currency1.toLowerCase()].slice(endDateIndex, startDateIndex + 1).reverse(),
		currency2: currencyData[currency2.toLowerCase()].slice(endDateIndex, startDateIndex + 1).reverse()
	};

	const chart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: filteredData.date,
			datasets: [
				{
					label: currency1,
					data: filteredData.currency1,
					borderColor: 'rgba(75, 192, 192, 1)',
					borderWidth: 1
				},
				{
					label: currency2,
					data: filteredData.currency2,
					borderColor: 'rgba(54, 162, 235, 1)',
					borderWidth: 1
				}
			]
		},
		options: {
			responsive: true,
			scales: {
				x: {
					beginAtZero: true
				},
				y: {
					beginAtZero: true
				}
			}
		}
	});
}

function isValidDateRange(startDate, endDate) {
	const validStartDate = new Date('2015-01-05');
	const validEndDate = new Date('2023-12-29');
	const start = new Date(startDate);
	const end = new Date(endDate);

	return start >= validStartDate && end <= validEndDate && start <= end;
}

function clearCanvas() {
	const canvas = document.getElementById('currencyChart');
	const context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function logSelectedDate() {
	const currency1 = document.getElementById('Curencies').value;
	const currency2 = document.getElementById('Curencies2').value;
	const dateInput = document.getElementById('Period');
	const dateInput2 = document.getElementById('Period2');
	const formattedDateInput = formatDate(dateInput.value);
	const formattedDateInput2 = formatDate(dateInput2.value);

	if (currency1 === currency2) {
		alert('Please select two different currencies.');
		return;
	}

	if (!dateInput.value || !dateInput2.value) {
		alert('Please select both start and end dates.');
		return;
	}

	const startDateIndex = storedCurrencyData.date.indexOf(formattedDateInput);
	const endDateIndex = storedCurrencyData.date.indexOf(formattedDateInput2);

	if (startDateIndex === -1 || endDateIndex === -1) {
		alert('Selected date is not valid.');
		return;
	}

	if (startDateIndex <= endDateIndex) {
		alert('Please ensure the start date is before the end date.');
		return;
	}

	// Clear canvas before plotting new data
	clearCanvas();

	// Plot only the selected period
	plotCurrencyData(storedCurrencyData, currency1, currency2, startDateIndex, endDateIndex);

	console.log(dateInput.value, dateInput2.value);

	// Clear date inputs after plotting
	dateInput.value = '';
	dateInput2.value = '';

}

const logDateButton = document.getElementById('action-button');
logDateButton.addEventListener('click', logSelectedDate);
