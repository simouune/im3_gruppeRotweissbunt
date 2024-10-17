
chart = new Chart(ctx, {
    type: "bar",
    data: {
        labels: labels,
        datasets: [
            {
                label: "Anzahl der neuen NEOs",
                data: neoCountPerDay,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
                borderRadius: 5,
                borderSkipped: false,
                hoverBackgroundColor: 'rgba(75, 192, 192, 0.5)', // Highlight color on hover
                hoverBorderColor: 'rgba(75, 192, 192, 1)', // Border color on hover
                hoverBorderWidth: 2, // Border width on hover
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: true,
                barPercentage: 0.5,
                categoryPercentage: 0.5,
                ticks: {
                    color: 'white', // Farbe der X-Achsenbeschriftungen
                    font: {
                        size: 14,
                    },
                    callback: function (value) {
                        const label = this.getLabelForValue(value);
                        return label.split('\n').join(' ');
                    },
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)', // Farbe der X-Achsen-Hilfslinien
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: 'white', // Farbe der Y-Achsenbeschriftungen
                    font: {
                        size: 14,
                    },
                    stepSize: 1,
                    max: Math.max(...neoCountPerDay),
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)', // Farbe der Y-Achsen-Hilfslinien
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {                    
                    label: function (context) {
                        console.log('context', context);
                       
                        const neosForDay = neoData.filter(neo => {
                            const neoDate = formatDate(new Date(neo.timestamp));                          
                            return neoDate === context.label;
                        });
 
                        console.log('neosForDay', neosForDay);
                       
                        if (neosForDay.length > 0) {
                            return neosForDay.map(neo => {
                                const diameter = neo.estimated_diameter || 'unbekannt';
                                return `Name: ${neo.name}, Distanz: ${formatNumber(neo.distance)} km, Geschwindigkeit: ${neo.velocity.toFixed(2)} km/s, Durchmesser: ${diameter.toFixed(1)} m`;
                            });
                        } else {
                            return `Keine NEO-Daten für diesen Tag`;
                        }
                    },
                },
                titleColor: 'white', // Farbe des Tooltip-Titels
                bodyColor: 'white', // Farbe des Tooltip-Textes
            },
        },
        hover: {
            mode: 'index',
            intersect: false,
        },
    },
});