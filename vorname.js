console.log('vorname.js');

const apiURL = 'https://projekt.rotweissbunt.com/vorname_api.php';

fetch(apiURL)
    .then(response => response.json())
    .then((myData) => {
        console.log(myData);

        let station = myData.map((item) => item.chargerID);
        let status = myData.map((item) => item.id);
       
       
       
       
       
        const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: station,
      datasets: [{
        label: '# of Votes',
        data: status,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
    
        

    })