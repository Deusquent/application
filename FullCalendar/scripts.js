window.onload = () =>{
    let elementCalendrier = document.getElementById("calendrier");
    let calendrier = new FullCalendar.Calendar(elementCalendrier,{
        plugins: [ 'dayGrid', 'timeGrid', 'list', 'interaction' ],
        defaultView: 'timeGridWeek',
        local : 'fr',
    })
    calendrier.render();
    

}   