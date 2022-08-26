/*
Using JavaScript's fetch() and the DOM, you are to update the f1.html and f1.js 
files to create a table of data using the F1 racer API (i.e. use "f1" as <series> 
in API call). I have attached a link to the documentation below. The Overview 
will show you how to make the API call. The table should display at least position,
points, driver name, driver nationality, and constructor name. The table should
dynamically populate the data when a "season" and "round" are specified within your form.
*/

// Get the table of racer data from the form and display on the page
{
    // Give the form an id
    let addID = document.getElementsByTagName('form')
    addID[0].id = 'racerForm'
    // console.log(addID)

    // Grab the form
    let form = document.getElementById('racerForm')
    // console.log(form)

    // Create a function to handle submit event
    async function handleSubmit(event){
        event.preventDefault()
        let inputSeason = event.target.season.value
        let inputRound = event.target.round.value
        let racer = await getRacerInfo(inputSeason, inputRound)
        buildRacerTable(racer)
    }

    // Function that will ge the data from the racer API
    async function getRacerInfo(season, round){
        let res = await fetch(`https://ergast.com/api/f1/${season}/${round}/driverStandings.json`)
        let data = await res.json()
        // console.log(data.MRData.StandingsTable.StandingsLists[0].DriverStandings)
        return data.MRData.StandingsTable.StandingsLists[0].DriverStandings
    }

    // function that will take the racer object from the API an build an HTML table for it
    function buildRacerTable(racerObj){
        // Create a table
        let table = document.createElement('table')
        table.className = 'table'

        // Create table head
        let tHead = document.createElement('thead')
        table.append(tHead) // add tHead as a child to the table 

        // Create table row
        let tr = document.createElement('tr')
        tHead.append(tr)

        // Create table row headers which should include info from racerObj
        // Create funtion to loop through table row headers and insert to innerHTML
        let headers = []
        function addHeaders(){
            for (let i in racerObj[0]){
                headers.push(i)
            }
            headers.splice(1,1)
            for (let header of headers){
                let th = document.createElement('th')
                th.scope = 'col'
                tr.append(th)
                th.innerHTML = (header[0].toUpperCase() + header.slice(1))
            } 
        }
        addHeaders()

        // Create table body
        let tBody = document.createElement('tbody')
        table.append(tBody)

        // Create table body rows with info from racerObj
        for (let obj of racerObj){
            let tr = document.createElement('tr')
            tBody.append(tr)
            
            for (let header of headers){
                let td = document.createElement('td')
                td.innerHTML = obj[header]

                if (header === 'Driver'){
                    td.innerHTML = obj[header]['givenName'] + ' ' + obj[header]['familyName']
                } else if (header == 'Constructors'){
                    td.innerHTML = obj[header][0]['name']
                }
                tr.append(td)
            }
        }
        // Create a column for the row
        let col = document.createElement('div')
        col.className = 'col-12'

        // add the table as a child to the column
        col.append(table)

        // Get the standingTable row and add our new column
        document.getElementById('standingTable').append(col)
        
        // Clear the table when a new search is submitted
        let display = document.getElementById('standingTable')
        display.innerHTML = ''
        display.append(col)
    }

    // handleSubmit function as listener to submit event or form
    form.addEventListener('submit', handleSubmit)
}